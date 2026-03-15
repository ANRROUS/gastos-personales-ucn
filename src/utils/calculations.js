import { ANNUAL_INTEREST_RATE } from './constants';

/**
 * Calcula el monto final con interés compuesto
 * Fórmula: M = P × (1 + r/12)^n
 * P = monto ahorrado, r = tasa anual, n = meses
 */

export const calculateCompoundInterest = (principal, startDate, endDate, annualRate = ANNUAL_INTEREST_RATE) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24 * 30)));
  const monthlyRate = annualRate / 12;
  const finalAmount = principal * Math.pow(1 + monthlyRate, months);
  const interest = finalAmount - principal;
  return { finalAmount: Number(finalAmount.toFixed(2)), interest: Number(interest.toFixed(2)), months };
};

/**
 * Calcula el monto a ahorrar basado en porcentaje del balance
 */
export const calculateSavingsAmount = (balance, percentage) => {
  return Number((balance * (percentage / 100)).toFixed(2));
};

