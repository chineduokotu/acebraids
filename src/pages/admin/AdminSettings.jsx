import React, { useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { changeAdminPassword } from '../../api/auth';
import { Button } from '../../components/common/Button';
import { PasswordField } from '../../components/common/PasswordField';
import { useAuth } from '../../context/AuthContext';
import { validatePasswordChange } from '../../utils/passwordValidation';

const emptyPasswords = { currentPassword: '', newPassword: '', confirmPassword: '' };

export const AdminSettings = () => {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState(emptyPasswords);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formVersion, setFormVersion] = useState(0);
  const formRef = useRef(null);
  const submitting = useRef(false);

  const updatePassword = (event) => {
    const { name, value } = event.target;
    setPasswords((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({ ...previous, [name]: undefined }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting.current) return;
    setError('');
    setSuccess('');
    const validationErrors = validatePasswordChange(passwords);
    setFieldErrors(validationErrors);
    const firstInvalidField = Object.keys(validationErrors)[0];
    if (firstInvalidField) {
      setError('Please check the highlighted fields.');
      formRef.current?.elements.namedItem(firstInvalidField)?.focus();
      return;
    }

    submitting.current = true;
    setLoading(true);
    try {
      await changeAdminPassword(passwords);
      // Remount the password inputs so that every visibility toggle resets too.
      setPasswords(emptyPasswords);
      setFormVersion((previous) => previous + 1);
      setSuccess('Password changed. Your other sessions have been signed out.');
    } catch (requestError) {
      let message = requestError.message || 'Unable to change your password. Please try again.';
      if (requestError.status === 429 && requestError.retryAfter > 0) {
        const minutes = Math.ceil(requestError.retryAfter / 60);
        message = `Too many attempts. Try again in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.`;
      }
      setError(message);
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">Settings</h1>
        <p className="text-xs text-neutral-400 mt-1">Manage the security of your admin account.</p>
      </div>

      <section aria-labelledby="change-password-heading" className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-pink-950/40 text-ace-pink flex items-center justify-center">
            <ShieldCheck aria-hidden="true" className="w-5 h-5" />
          </div>
          <div>
            <h2 id="change-password-heading" className="font-heading font-bold text-lg text-white">Change password</h2>
            <p className="text-xs text-neutral-400 mt-1 break-all">{user?.email}</p>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={loading} className="space-y-5">
          {error && (
            <div role="alert" className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle aria-hidden="true" className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div role="status" aria-live="polite" aria-atomic="true">
            {success && (
              <p className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 aria-hidden="true" className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </p>
            )}
            {loading && <p className="text-xs text-neutral-300">Changing your password…</p>}
          </div>

          <div key={formVersion} className="space-y-5">
            <PasswordField
              id="current-password"
              name="currentPassword"
              label="Current password"
              autoComplete="current-password"
              required
              value={passwords.currentPassword}
              onChange={updatePassword}
              disabled={loading}
              error={fieldErrors.currentPassword}
            />
            <PasswordField
              id="new-password"
              name="newPassword"
              label="New password"
              autoComplete="new-password"
              required
              value={passwords.newPassword}
              onChange={updatePassword}
              disabled={loading}
              error={fieldErrors.newPassword}
              descriptionId="password-policy"
            />
            <p id="password-policy" className="text-xs leading-relaxed text-neutral-400">
              Use at least 15 characters and a password different from your current one. The maximum is 72 bytes; emoji and accented characters may use more than one byte each.
            </p>
            <PasswordField
              id="confirm-password"
              name="confirmPassword"
              label="Confirm new password"
              autoComplete="new-password"
              required
              value={passwords.confirmPassword}
              onChange={updatePassword}
              disabled={loading}
              error={fieldErrors.confirmPassword}
            />
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">After changing your password, you will stay signed in here. Your other active sessions will be signed out.</p>
          <Button type="submit" loading={loading} className="w-full sm:w-auto text-xs font-bold shadow-pink-glow">Change password</Button>
        </form>
      </section>
    </div>
  );
};
