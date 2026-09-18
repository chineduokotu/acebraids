import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { createServer } from 'vite';
import { formatPaymentAmount, paymentStatusLabel, canVerifyBankTransfer, mergeNotifications } from '../src/utils/paymentDisplay.js';

const vite = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' });
after(() => vite.close());
const { NotificationCard } = await vite.ssrLoadModule('/src/pages/admin/AdminNotifications.jsx');
const { OrderPaymentSummary } = await vite.ssrLoadModule('/src/pages/OrderConfirmation.jsx');
const { subscribeAdminNotifications } = await vite.ssrLoadModule('/src/api/adminNotifications.js');
const { default: axiosClient } = await vite.ssrLoadModule('/src/api/axiosClient.js');

const notification = { id: 'one', orderId: 'order-one', orderReference: 'ABB-TEST', customer: { name: 'Ada Buyer', email: 'ada@example.test' }, items: [{ name: 'Braided Wig', qty: 2, price: 50 }], amount: 100, currency: 'EUR', paymentStatus: 'paid', paymentMethod: 'stripe', createdAt: '2026-09-17T10:00:00Z', read: false };
const snapshot = { notifications: [notification], unreadCount: 1, nextCursor: null };
const tick = () => new Promise((resolve) => setImmediate(resolve));

test('stored EUR payments display without applying the storefront conversion again', () => {
  assert.match(formatPaymentAmount(100, 'EUR'), /EUR\s*100\.00/);
  assert.doesNotMatch(formatPaymentAmount(100, 'EUR'), /118/);
});

test('customer reports remain unverified and manual controls never approve Stripe', () => {
  assert.match(paymentStatusLabel({ paymentMethod: 'bank_transfer', paymentStatus: 'awaiting_verification' }), /not yet verified/);
  assert.match(paymentStatusLabel({ paymentMethod: 'stripe', paymentStatus: 'paid' }), /confirmed by Stripe/);
  assert.equal(canVerifyBankTransfer({ paymentMethod: 'stripe', paymentStatus: 'awaiting_verification' }), false);
  assert.equal(canVerifyBankTransfer({ paymentMethod: 'bank_transfer', paymentStatus: 'awaiting_verification' }), true);
});

test('notifications expose order, customer, items, amount, currency and payment source', () => {
  const markup = renderToStaticMarkup(React.createElement(StaticRouter, { location: '/admin/notifications' }, React.createElement(NotificationCard, { notification, onMarkRead() {} })));
  for (const value of ['ABB-TEST', 'Ada Buyer', 'ada@example.test', 'Braided Wig', 'EUR', '100.00', 'confirmed by Stripe', '/admin/orders?order=order-one']) assert.ok(markup.includes(value), value);
});

test('the return page only reports success after stored payment confirmation', () => {
  const render = (paymentStatus) => renderToStaticMarkup(React.createElement(OrderPaymentSummary, { order: { paymentMethod: 'stripe', paymentStatus } }));
  assert.match(render('pending'), /Awaiting payment confirmation/);
  assert.doesNotMatch(render('pending'), /<h1[^>]*>Payment confirmed/);
  assert.match(render('failed'), /Payment needs attention/);
  assert.match(render('paid'), /Payment confirmed/);
});

test('replayed notifications merge by durable ID and preserve latest read state', () => {
  const result = mergeNotifications([notification], [{ ...notification, read: true }, { ...notification, id: 'two', createdAt: '2026-09-17T11:00:00Z' }]);
  assert.equal(result.length, 2);
  assert.equal(result[0].id, 'two');
  assert.equal(result[1].read, true);
});

class FakeEventSource {
  static latest;
  constructor(url, options) { this.url = url; this.options = options; this.listeners = new Map(); FakeEventSource.latest = this; }
  addEventListener(name, handler) { this.listeners.set(name, handler); }
  emit(name, data) { this.listeners.get(name)?.({ data: JSON.stringify(data) }); }
  close() { this.closed = true; }
}

test('SSE uses the API origin and HttpOnly cookie, catches up, and closes on session expiry', async (t) => {
  const updates = [];
  let expired = 0;
  const subscription = subscribeAdminNotifications({ onSnapshot: (data) => updates.push(data), onState() {}, onError() {}, fetchSnapshot: async () => snapshot, EventSourceImpl: FakeEventSource, onAuthExpired: () => expired++ });
  t.after(() => subscription.close());
  await tick();
  const stream = FakeEventSource.latest;
  assert.equal(stream.url, `${axiosClient.defaults.baseURL}/admin/notifications/stream`);
  assert.equal(stream.options.withCredentials, true);
  assert.equal(updates.length, 1);
  stream.emit('notifications', { ...snapshot, unreadCount: 2 });
  assert.equal(updates.at(-1).unreadCount, 2);
  stream.emit('auth-expired');
  assert.equal(expired, 1);
  assert.equal(stream.closed, true);
});

test('late REST results cannot overwrite a more recent streamed payment', async (t) => {
  let resolveRequest;
  const updates = [];
  const subscription = subscribeAdminNotifications({ onSnapshot: (data) => updates.push(data), onState() {}, onError() {}, fetchSnapshot: () => new Promise((resolve) => { resolveRequest = resolve; }), EventSourceImpl: FakeEventSource });
  t.after(() => subscription.close());
  FakeEventSource.latest.emit('notifications', snapshot);
  resolveRequest({ notifications: [], unreadCount: 0 });
  await tick();
  assert.deepEqual(updates, [snapshot]);
});

test('without SSE the client retrieves persisted notifications and cleans up', async () => {
  const updates = [];
  const states = [];
  const subscription = subscribeAdminNotifications({ onSnapshot: (data) => updates.push(data), onState: (state) => states.push(state), onError() {}, fetchSnapshot: async () => snapshot, EventSourceImpl: null });
  await tick();
  subscription.close();
  assert.deepEqual(updates, [snapshot]);
  assert.deepEqual(states, ['polling']);
});
