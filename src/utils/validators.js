export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validateUKPhone = (phone) => {
  if (!phone) return true; // optional
  const clean = phone.replace(/[\s-]/g, '');
  return /^(\+44|0)7\d{9}$|^(\+49|0)\d{9,11}$/.test(clean);
};

export const formatCardNumber = (value) => {
  const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
  const onlyNumbers = value.replace(/[^\d]/g, '');

  return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
    [$1, $2, $3, $4].filter(group => !!group).join(' ')
  );
};

export const formatExpiryDate = (value) => {
  const clean = value.replace(/[^\d]/g, '');
  if (clean.length >= 3) {
    return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
  }
  return clean;
};
