import { useState } from 'react';
import { formatCurrency, getMonthOptions } from '../utils/constants';
import { groupBySource, groupByCategory, filterByMonth } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#14b8a6'];

export default function ReportsPage({ finances }) {
  const { transactions } = finances;
  const monthOptions = getMonthOptions();
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]?.value || '');

  const incomeBySource = groupBySource(transactions);
  const monthTransactions = filterByMonth(transactions, selectedMonth);
  const expensesByCategory = groupByCategory(monthTransactions.filter(t => t.type === 'expense'));

  const totalIncomeBySource = incomeBySource.reduce((s, i) => s + i.value, 0);
  const totalExpensesMonth = expensesByCategory.reduce((s, i) => s + i.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '0.8rem' }}>
          <p style={{ fontWeight: 600 }}>{payload[0].name || payload[0].payload.name}</p>
          <p style={{ color: 'var(--accent-cyan)' }}>{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Reportes</h1>
        <p className="page-subtitle">Analiza tus finanzas en detalle</p>
      </div>

      {/* INCOME BY SOURCE */}
      <div className="chart-container">
        <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} /> Ingresos totales por fuente
        </h3>
        {incomeBySource.length === 0 ? (
          <div className="empty-state"><p>No hay ingresos registrados</p></div>
        ) : (
          <>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={incomeBySource} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a35" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {incomeBySource.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <table className="report-table" style={{ marginTop: '16px' }}>
              <thead>
                <tr><th>Fuente</th><th>Total</th></tr>
              </thead>
              <tbody>
                {incomeBySource.map(item => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td style={{ color: 'var(--success)' }}>{formatCurrency(item.value)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 700 }}>
                  <td>TOTAL</td>
                  <td style={{ color: 'var(--accent-cyan)' }}>{formatCurrency(totalIncomeBySource)}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* EXPENSES BY CATEGORY */}
      <div className="chart-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <h3 className="chart-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingDown size={18} /> Gastos por categoría
          </h3>
          <select className="form-select month-selector" style={{ maxWidth: '220px' }} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            {monthOptions.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        {expensesByCategory.length === 0 ? (
          <div className="empty-state"><p>No hay gastos en este mes</p></div>
        ) : (
          <>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expensesByCategory.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <table className="report-table" style={{ marginTop: '16px' }}>
              <thead>
                <tr><th>Categoría</th><th>Total</th></tr>
              </thead>
              <tbody>
                {expensesByCategory.map(item => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td style={{ color: 'var(--danger)' }}>{formatCurrency(item.value)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 700 }}>
                  <td>TOTAL</td>
                  <td style={{ color: 'var(--danger)' }}>{formatCurrency(totalExpensesMonth)}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
