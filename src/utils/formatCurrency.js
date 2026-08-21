/**
 * Currency Formatter for UK (£) and Germany / EU (€)
 */
export const formatCurrency = (amount, currency = 'GBP') => {
  const num = Number(amount) || 0;
  
  if (currency === 'EUR') {
    // 1 GBP ~ 1.18 EUR approximate conversion for German customers
    const eurAmount = num * 1.18;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(eurAmount);
  }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(num);
};

export const getCurrencySymbol = (currency = 'GBP') => {
  return currency === 'EUR' ? '€' : '£';
};
