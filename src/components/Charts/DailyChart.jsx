import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/constants';
import { BarChart2, TrendingDown } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '0.8rem'
      }}>
        <p style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingDown size={14} />
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DailyChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart2 size={18} /> Gastos Diarios (últimos 14 días)
        </h3>
        <div className="empty-state"><p>No hay datos suficientes para el gráfico</p></div>
      </div>
    );
  }

  const formatted = data.map(d => ({
    ...d,
    date: new Date(d.date + 'T00:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BarChart2 size={18} /> Gastos Diarios (últimos 14 días)
      </h3>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={formatted} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a35" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.8rem', color: '#94a3b8' }} />
            <Bar dataKey="gastos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
