import { useState } from 'react';
import { formatCurrency, formatDate, SAVINGS_RATES } from '../utils/constants';
import { calculateCompoundInterest, calculateSavingsAmount } from '../utils/calculations';
import { Coins, Landmark, PiggyBank } from 'lucide-react';

export default function SavingsPage({ finances }) {
  const { savings, availableBalance, createSavings, deleteSavings } = finances;
  const [showModal, setShowModal] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [endDate, setEndDate] = useState('');

  const activeSavings = savings.filter(s => s.active);

  const preview = selectedRate && endDate && availableBalance > 0
    ? (() => {
        const amount = calculateSavingsAmount(availableBalance, selectedRate);
        const today = new Date().toISOString().slice(0, 10);
        const { finalAmount, interest, months } = calculateCompoundInterest(amount, today, endDate);
        return { amount, finalAmount, interest, months };
      })()
    : null;

  const handleCreate = () => {
    if (!selectedRate || !endDate) return;
    const plan = createSavings(selectedRate, endDate);
    if (plan) {
      setShowModal(false);
      setSelectedRate(null);
      setEndDate('');
    }
  };

  const minDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Ahorro</h1>
        <p className="page-subtitle">Haz crecer tu dinero con interés simulado</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label"><Coins size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Disponible para ahorrar</div>
          <div className="stat-value">{formatCurrency(availableBalance)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><Landmark size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />Total Ahorrado</div>
          <div className="stat-value savings">{formatCurrency(savings.filter(s => s.active).reduce((s, p) => s + p.savedAmount, 0))}</div>
        </div>
      </div>

      <button className="btn btn-primary" style={{ marginBottom: '24px' }} onClick={() => setShowModal(true)} disabled={availableBalance <= 0}>
        <PiggyBank size={18} /> ¡Ahorra!
      </button>

      {availableBalance <= 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
          No tienes balance disponible para ahorrar. Agrega ingresos primero.
        </p>
      )}

      <div className="section-header">
        <h2 className="section-title">Planes de Ahorro Activos</h2>
      </div>

      {activeSavings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Landmark size={48} /></div>
          <p>No tienes planes de ahorro activos</p>
        </div>
      ) : (
        <div className="transaction-list">
          {activeSavings.map(s => (
            <div key={s.id} className="card" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-cyan)' }}>{s.percentage}% de ahorro</span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {formatDate(s.startDate)} → {formatDate(s.endDate)} · {s.months} meses
                  </p>
                </div>
                <button className="btn-danger btn-sm" onClick={() => deleteSavings(s.id)}>Liberar</button>
              </div>
              <div className="savings-projection">
                <div className="proj-row">
                  <span className="proj-label">Monto bloqueado</span>
                  <span className="proj-value">{formatCurrency(s.savedAmount)}</span>
                </div>
                <div className="proj-row">
                  <span className="proj-label">Interés generado (5% anual)</span>
                  <span className="proj-value">+{formatCurrency(s.interest)}</span>
                </div>
                <div className="proj-row highlight">
                  <span className="proj-label" style={{ fontWeight: 600 }}>Recibirás al final</span>
                  <span className="proj-value">{formatCurrency(s.projectedReturn)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PiggyBank size={24} /> Crear Plan de Ahorro
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Balance disponible: <strong style={{ color: 'var(--accent-cyan)' }}>{formatCurrency(availableBalance)}</strong>
            </p>

            <label className="form-label">¿Cuánto deseas ahorrar?</label>
            <div className="savings-options">
              {SAVINGS_RATES.map(rate => (
                <button
                  key={rate}
                  className={`savings-option ${selectedRate === rate ? 'selected' : ''}`}
                  onClick={() => setSelectedRate(rate)}
                >
                  <div className="percentage">{rate}%</div>
                  <div className="label">{formatCurrency(calculateSavingsAmount(availableBalance, rate))}</div>
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">¿Hasta cuándo deseas ahorrar?</label>
              <input className="form-input" type="date" min={minDate} value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>

            {preview && (
              <div className="savings-projection">
                <div className="proj-row">
                  <span className="proj-label">Ahorrarás</span>
                  <span className="proj-value">{formatCurrency(preview.amount)}</span>
                </div>
                <div className="proj-row">
                  <span className="proj-label">Duración</span>
                  <span className="proj-value">{preview.months} meses</span>
                </div>
                <div className="proj-row">
                  <span className="proj-label">Interés generado (5% anual)</span>
                  <span className="proj-value">+{formatCurrency(preview.interest)}</span>
                </div>
                <div className="proj-row highlight" style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '12px' }}>
                  <span className="proj-label" style={{ fontWeight: 600 }}>Total al final</span>
                  <span className="proj-value">{formatCurrency(preview.finalAmount)}</span>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={!selectedRate || !endDate}>
                Confirmar Ahorro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
