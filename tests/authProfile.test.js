import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { persistAuthProfile, readAuthProfile, safeAuthProfile } from '../src/utils/authProfile.js';

const profile = { _id: 'admin-id', name: 'Admin', email: 'admin@example.test', role: 'admin' };
afterEach(() => { delete globalThis.localStorage; });

test('allowlists profile fields and strips credentials before persistence', () => {
  let record;
  globalThis.localStorage = { setItem: (_key, value) => { record = value; }, removeItem() {} };
  const safe = persistAuthProfile({ ...profile, token: 'private-session-token', password: 'private-password', authVersion: 7 });
  assert.deepEqual(safe, profile);
  assert.deepEqual(JSON.parse(record), profile);
});

test('cleans credentials out of a legacy cached login response immediately', () => {
  let record = JSON.stringify({ ...profile, token: 'legacy-token', password: 'legacy-password' });
  globalThis.localStorage = { getItem: () => record, setItem: (_key, value) => { record = value; }, removeItem() {} };
  assert.deepEqual(readAuthProfile(), profile);
  assert.deepEqual(JSON.parse(record), profile);
});

test('discards malformed cached profiles', () => {
  let removed = false;
  globalThis.localStorage = { getItem: () => '{invalid', removeItem: () => { removed = true; } };
  assert.equal(readAuthProfile(), null);
  assert.equal(removed, true);
  assert.equal(safeAuthProfile({ token: 'token', role: 'admin' }), null);
});

test('cookie authentication can continue if browser storage is disabled', () => {
  globalThis.localStorage = { getItem() { throw new Error('Storage unavailable'); }, setItem() { throw new Error('Storage unavailable'); }, removeItem() { throw new Error('Storage unavailable'); } };
  assert.deepEqual(persistAuthProfile(profile), profile);
  assert.equal(readAuthProfile(), null);
});
