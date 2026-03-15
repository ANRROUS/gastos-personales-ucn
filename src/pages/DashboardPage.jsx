import { formatCurrency } from '../utils/constants';
import { groupByDay } from '../utils/calculations';
import DailyChart from '../components/Charts/DailyChart';
import { Wallet, CircleDollarSign, TrendingUp, TrendingDown, Landmark, BarChart2 } from 'lucide-react';

export default function DashboardPage({ finances }) {
  const { transactions, totalIncome, totalExpenses, balance, availableBalance, totalSaved } = finances;

  const last30 = transactions.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    const diff = (now - d) / (1000 * 60 * 60 * 24);
    return diff <= 30;
  });

  const expenseData = groupByDay(last30, 'expense');

  const chartData = {};
  expenseData.forEach(d => { chartData[d.date] = { date: d.date, gastos: d.total }; });
  
  const dailyData = Object.values(chartData)
    .map(d => ({ date: d.date, gastos: d.gastos || 0 }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen de tus finanzas</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label"><Wallet size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Balance Total</div>
          <div className="stat-value">{formatCurrency(balance)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><CircleDollarSign size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Disponible</div>
          <div className="stat-value">{formatCurrency(availableBalance)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Ingresos</div>
          <div className="stat-value income">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><TrendingDown size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Gastos</div>
          <div className="stat-value expense">{formatCurrency(totalExpenses)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><Landmark size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Ahorrado</div>
          <div className="stat-value savings">{formatCurrency(totalSaved)}</div>
        </div>
      </div>

      <DailyChart data={dailyData} />

      {transactions.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><BarChart2 size={48} /></div>
          <p>Aún no hay transacciones. ¡Agrega tu primer ingreso!</p>
        </div>
      )}
    </div>
  );
}
