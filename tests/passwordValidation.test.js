import assert from 'node:assert/strict';
import test from 'node:test';
import { validatePasswordChange } from '../src/utils/passwordValidation.js';

const validForm = {
  currentPassword: 'An existing admin password',
  newPassword: 'A new and memorable passphrase',
  confirmPassword: 'A new and memorable passphrase',
};

test('accepts a matching new passphrase', () => {
  assert.deepEqual(validatePasswordChange(validForm), {});
});

test('requires all three password fields', () => {
  const errors = validatePasswordChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
  assert.deepEqual(Object.keys(errors), ['currentPassword', 'newPassword', 'confirmPassword']);
});

test('rejects mismatched confirmation and reuse of the current password', () => {
  assert.ok(validatePasswordChange({ ...validForm, confirmPassword: 'A different passphrase' }).confirmPassword);
  assert.ok(validatePasswordChange({ ...validForm, newPassword: validForm.currentPassword, confirmPassword: validForm.currentPassword }).newPassword);
});

test('counts Unicode code points and enforces the UTF-8 byte limit', () => {
  const check = (password) => validatePasswordChange({ ...validForm, newPassword: password, confirmPassword: password });
  assert.ok(check('a'.repeat(14)).newPassword);
  assert.deepEqual(check('a'.repeat(15)), {});
  assert.deepEqual(check('a'.repeat(72)), {});
  assert.ok(check('a'.repeat(73)).newPassword);
  assert.ok(check('😀'.repeat(14)).newPassword);
  assert.deepEqual(check('😀'.repeat(18)), {});
  assert.ok(check('😀'.repeat(19)).newPassword);
});

test('rejects whitespace-only passwords without trimming valid passwords', () => {
  assert.ok(validatePasswordChange({ ...validForm, newPassword: ' '.repeat(20), confirmPassword: ' '.repeat(20) }).newPassword);
  const spacedPassword = '  an exact passphrase  ';
  assert.deepEqual(validatePasswordChange({ ...validForm, newPassword: spacedPassword, confirmPassword: spacedPassword }), {});
  assert.ok(validatePasswordChange({ ...validForm, newPassword: spacedPassword, confirmPassword: spacedPassword.trim() }).confirmPassword);
});
