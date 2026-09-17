import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

// Exercise the real JSX and API modules with the project's existing Vite tools.
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: { getItem: () => null, setItem() {}, removeItem() {} },
});
const vite = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true, include: [] },
  appType: 'custom',
});
after(async () => { await vite.close(); delete globalThis.window; delete globalThis.localStorage; });
const { PasswordField } = await vite.ssrLoadModule('/src/components/common/PasswordField.jsx');
const { AdminSettings } = await vite.ssrLoadModule('/src/pages/admin/AdminSettings.jsx');
const { AuthProvider } = await vite.ssrLoadModule('/src/context/AuthContext.jsx');
const { default: axiosClient, AUTH_EXPIRED_EVENT } = await vite.ssrLoadModule('/src/api/axiosClient.js');
const { adminLoginUser, changeAdminPassword } = await vite.ssrLoadModule('/src/api/auth.js');

test('password fields initially hide text and expose an accessible, non-submit toggle', () => {
  const markup = renderToStaticMarkup(React.createElement(PasswordField, { id: 'test-password', label: 'Current password', value: '', onChange() {}, autoComplete: 'current-password' }));
  assert.match(markup, /type="password"/);
  assert.match(markup, /for="test-password"/);
  assert.match(markup, /type="button"/);
  assert.match(markup, /aria-label="Show current password"/);
  assert.match(markup, /aria-controls="test-password"/);
  assert.match(markup, /aria-pressed="false"/);
});

test('settings initially renders all three password fields hidden with password-manager hints', () => {
  const markup = renderToStaticMarkup(React.createElement(AuthProvider, null, React.createElement(AdminSettings)));
  assert.equal((markup.match(/type="password"/g) || []).length, 3);
  assert.equal((markup.match(/autoComplete="new-password"/g) || []).length, 2);
  assert.match(markup, /autoComplete="current-password"/);
  for (const name of ['currentPassword', 'newPassword', 'confirmPassword']) assert.match(markup, new RegExp(`name="${name}"`));
  assert.match(markup, /role="status"/);
});

test('change-password calls the real endpoint with the three fields and cookies enabled', async () => {
  const passwords = { currentPassword: 'Current password for testing', newPassword: 'New password for testing', confirmPassword: 'New password for testing' };
  let request;
  axiosClient.defaults.adapter = async (config) => {
    request = config;
    return { data: { message: 'Password changed' }, status: 200, headers: {}, config };
  };
  assert.deepEqual(await changeAdminPassword(passwords), { message: 'Password changed' });
  assert.equal(request.url, '/auth/admin/change-password');
  assert.equal(request.method, 'post');
  assert.equal(request.withCredentials, true);
  assert.deepEqual(JSON.parse(request.data), passwords);
});

test('wrong-current errors preserve auth, expired sessions clear auth, and login errors do not clear auth', async () => {
  globalThis.window = new EventTarget();
  let expiredEvents = 0;
  window.addEventListener(AUTH_EXPIRED_EVENT, () => { expiredEvents += 1; });
  const rejectWith = (status, data, headers = {}) => {
    axiosClient.defaults.adapter = async (config) => { throw { config, response: { status, data, headers } }; };
  };
  rejectWith(400, { message: 'Current password is incorrect.' });
  await assert.rejects(changeAdminPassword({}), (error) => error.status === 400);
  assert.equal(expiredEvents, 0);
  rejectWith(401, { message: 'Session expired.' });
  await assert.rejects(changeAdminPassword({}), (error) => error.status === 401);
  assert.equal(expiredEvents, 1);
  await assert.rejects(adminLoginUser({ email: 'admin@example.test', password: 'incorrect' }), (error) => error.status === 401);
  assert.equal(expiredEvents, 1);
});

test('rate-limit errors retain retry guidance and never include the password request/config', async () => {
  axiosClient.defaults.adapter = async (config) => {
    throw { config, response: { status: 429, data: { message: 'Too many attempts', code: 'RATE_LIMITED' }, headers: { 'retry-after': '900' } } };
  };
  await assert.rejects(changeAdminPassword({ currentPassword: 'private password' }), (error) => {
    assert.deepEqual(error, { message: 'Too many attempts', status: 429, code: 'RATE_LIMITED', retryAfter: 900 });
    assert.equal(JSON.stringify(error).includes('private password'), false);
    return true;
  });
});
