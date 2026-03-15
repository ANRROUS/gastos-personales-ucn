import { useState } from 'react';
import { formatCurrency, formatDate, getTodayString } from '../utils/constants';
import { Plus, X, Wallet } from 'lucide-react';

export default function IncomePage({ finances }) {
  const { transactions, categories, addTransaction, deleteTransaction, addCategory } = finances;
  const incomes = transactions.filter(t => t.type === 'income');

  const [form, setForm] = useState({ source: '', category: categories.income[0] || '', amount: '', date: getTodayString(), description: '' });
  const [newCat, setNewCat] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;
    addTransaction('income', { ...form, source: form.source || form.category });
    setForm({ source: '', category: categories.income[0] || '', amount: '', date: getTodayString(), description: '' });
  };

  const handleAddCategory = () => {
    if (newCat.trim()) {
      addCategory('income', newCat.trim());
      setNewCat('');
      setShowNewCat(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Ingresos</h1>
        <p className="page-subtitle">Registra tus fuentes de ingreso</p>
      </div>

      <div className="card-gradient" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fuente del ingreso</label>
              <input className="form-input" type="text" placeholder="Ej: Trabajo, Freelance..." value={form.source} onChange={e => setForm({...form, source: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Monto (S/)</label>
              <input className="form-input" type="number" step="0.01" min="0" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {categories.income.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Descripción (opcional)</label>
            <input className="form-input" type="text" placeholder="Nota breve..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary"><Plus size={16} /> Agregar Ingreso</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowNewCat(!showNewCat)}>
              {showNewCat ? <><X size={14} /> Cancelar</> : <><Plus size={14} /> Categoría</>}
            </button>
            {showNewCat && (
              <div className="form-inline">
                <input className="form-input" style={{ maxWidth: '180px' }} type="text" placeholder="Nueva categoría" value={newCat} onChange={e => setNewCat(e.target.value)} />
                <button type="button" className="btn btn-primary btn-sm" onClick={handleAddCategory}>Crear</button>
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="section-header">
        <h2 className="section-title">Historial de Ingresos</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{incomes.length} registros</span>
      </div>

      {incomes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Wallet size={48} /></div>
          <p>No hay ingresos registrados aún</p>
        </div>
      ) : (
        <div className="transaction-list">
          {incomes.map(t => (
            <div key={t.id} className="transaction-item">
              <div className="transaction-info">
                <span className="transaction-category">{t.source || t.category}</span>
                <span className="transaction-desc">{t.category}{t.description ? ` · ${t.description}` : ''}</span>
                <span className="transaction-date">{formatDate(t.date)}</span>
              </div>
              <div className="transaction-right">
                <span className="transaction-amount income">+{formatCurrency(t.amount)}</span>
                <button className="btn-danger btn-sm" onClick={() => deleteTransaction(t.id)}><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
