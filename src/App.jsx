import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useFinances } from './hooks/useFinances';
import Navbar from './components/Layout/Navbar';
import DashboardPage from './pages/DashboardPage';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import SavingsPage from './pages/SavingsPage';
import ReportsPage from './pages/ReportsPage';

function AppContent() {
  const finances = useFinances();

  return (
    <div className="app-layout">
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage finances={finances} />} />
          <Route path="/income" element={<IncomePage finances={finances} />} />
          <Route path="/expenses" element={<ExpensePage finances={finances} />} />
          <Route path="/savings" element={<SavingsPage finances={finances} />} />
          <Route path="/reports" element={<ReportsPage finances={finances} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      <Navbar />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}
