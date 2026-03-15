import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_CATEGORIES, generateId, getTodayString } from '../utils/constants';
import { calculateCompoundInterest, calculateSavingsAmount } from '../utils/calculations';

export function useFinances() {
  const [transactions, setTransactions] = useLocalStorage('gp_transactions', []);
  const [categories, setCategories] = useLocalStorage('gp_categories', DEFAULT_CATEGORIES);
  const [savings, setSavings] = useLocalStorage('gp_savings', []);

  const addTransaction = (type, data) => {
    const newTransaction = {
      id: generateId(),
      type,
      amount: Number(data.amount),
      category: data.category,
      description: data.description || '',
      date: data.date || getTodayString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = (type, name) => {
    if (!categories[type].includes(name) && name.trim()) {
      setCategories(prev => ({ ...prev, [type]: [...prev[type], name.trim()] }));
    }
  };

  const createSavings = (percentage, endDate) => {
    const available = availableBalance;
    if (available <= 0) return null;
    const savedAmount = calculateSavingsAmount(available, percentage);
    if (savedAmount <= 0) return null;
    const startDate = getTodayString();
    const { finalAmount, interest, months } = calculateCompoundInterest(savedAmount, startDate, endDate);
    const plan = {
      id: generateId(),
      percentage,
      baseAmount: available,
      savedAmount,
      annualRate: 5.0,
      startDate,
      endDate,
      projectedReturn: finalAmount,
      interest,
      months,
      active: true,
    };
    setSavings(prev => [...prev, plan]);
    return plan;
  };

  const deleteSavings = (id) => {
    setSavings(prev => prev.filter(s => s.id !== id));
  };

  const totalIncome = useMemo(() =>
    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(() =>
    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalSaved = useMemo(() =>
    savings.filter(s => s.active).reduce((sum, s) => sum + s.savedAmount, 0),
    [savings]
  );

  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);
  const availableBalance = useMemo(() => balance - totalSaved, [balance, totalSaved]);

  return {
    transactions,
    categories,
    savings,
    addTransaction,
    deleteTransaction,
    addCategory,
    createSavings,
    deleteSavings,
    totalIncome,
    totalExpenses,
    totalSaved,
    balance,
    availableBalance,
  };
}
