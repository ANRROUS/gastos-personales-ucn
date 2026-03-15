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

/**
 * Agrupa transacciones por día para gráficos
 */
export const groupByDay = (transactions, type) => {
  const grouped = {};
  const filtered = type ? transactions.filter(t => t.type === type) : transactions;

  filtered.forEach(t => {
    if (!grouped[t.date]) grouped[t.date] = 0;
    grouped[t.date] += t.amount;
  });

  return Object.entries(grouped)
    .map(([date, total]) => ({ date, total: Number(total.toFixed(2)) }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Agrupa y suma por categoría
 */
export const groupByCategory = (transactions) => {
  const grouped = {};
  transactions.forEach(t => {
    const key = t.category || 'Sin categoría';
    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += t.amount;
  });
  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Agrupa ingresos por fuente
 */
export const groupBySource = (transactions) => {
  const incomes = transactions.filter(t => t.type === 'income');
  const grouped = {};
  incomes.forEach(t => {
    const key = t.source || t.category || 'Sin fuente';
    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += t.amount;
  });
  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Filtra transacciones por mes (formato 'YYYY-MM')
 */
export const filterByMonth = (transactions, yearMonth) => {
  return transactions.filter(t => t.date && t.date.startsWith(yearMonth));
};
