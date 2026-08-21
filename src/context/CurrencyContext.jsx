import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatCurrency as formatCurr, getCurrencySymbol as getSymbol } from '../utils/formatCurrency';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('ace_currency') || 'GBP';
  });

  useEffect(() => {
    localStorage.setItem('ace_currency', currency);
  }, [currency]);

  const format = (amount) => formatCurr(amount, currency);
  const symbol = getSymbol(currency);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
