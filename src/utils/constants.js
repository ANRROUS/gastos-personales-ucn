export const DEFAULT_CATEGORIES = {
  income: ['Salario', 'Freelance', 'Ventas', 'Regalo'],
  expense: ['Comida', 'Transporte', 'Entretenimiento', 'Salud', 'Educación']
};

export const SAVINGS_RATES = [10, 20, 30];

export const ANNUAL_INTEREST_RATE = 0.05;

export const CURRENCY_SYMBOL = 'S/';

export const formatCurrency = (amount) => {
  return `${CURRENCY_SYMBOL} ${Number(amount).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const generateId = () => {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

