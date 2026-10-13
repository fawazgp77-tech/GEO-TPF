import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticatedUser, applyOtpDigits } from '../shared/authForm.js';

test('auth completion requires a real identity instead of falling back to signup form data', () => {
  assert.throws(() => authenticatedUser({ user: null }), /could not be confirmed/);
  assert.throws(() => authenticatedUser({ user: { email: 'unverified@example.com' } }), /could not be confirmed/);
  const user = { id: 'verified-user', email: 'verified@example.com' };
  assert.equal(authenticatedUser({ user }), user);
});

test('OTP input distributes autofill and paste digits without accepting nonnumeric codes', () => {
  const blank = Array(6).fill('');
  assert.deepEqual(applyOtpDigits(blank, 0, '123 456'), ['1', '2', '3', '4', '5', '6']);
  assert.deepEqual(applyOtpDigits(blank, 4, '789'), ['', '', '', '', '7', '8']);
  assert.deepEqual(applyOtpDigits(['1', '2', '3', '4', '5', '6'], 2, ''), ['1', '2', '', '4', '5', '6']);
  assert.deepEqual(applyOtpDigits(blank, 0, 'letters'), blank);
});

test('email-link completion cannot use a different existing signed-in account', () => {
  const user = { id: 'signed-in-user', email: 'old@example.com' };
  assert.throws(() => authenticatedUser({ user }, 'new@example.com'), /does not match/);
  assert.equal(authenticatedUser({ user }, ' OLD@example.com '), user);
});
