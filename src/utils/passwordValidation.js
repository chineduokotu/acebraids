export const validatePasswordChange = ({ currentPassword, newPassword, confirmPassword }) => {
  const errors = {};

  if (!currentPassword) errors.currentPassword = 'Enter your current password.';

  if (!newPassword || !newPassword.trim()) {
    errors.newPassword = 'Enter a new password that is not only spaces.';
  } else if (Array.from(newPassword).length < 15) {
    errors.newPassword = 'Use at least 15 characters for your new password.';
  } else if (new TextEncoder().encode(newPassword).length > 72) {
    errors.newPassword = 'Your new password is too long (maximum 72 UTF-8 bytes).';
  } else if (newPassword === currentPassword) {
    errors.newPassword = 'Choose a password different from your current password.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm your new password.';
  } else if (confirmPassword !== newPassword) {
    errors.confirmPassword = 'The new passwords do not match.';
  }

  return errors;
};
