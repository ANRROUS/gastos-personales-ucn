import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, CreditCard, PiggyBank } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={20} className="nav-icon" />
        Dashboard
      </NavLink>
      <NavLink to="/income" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Wallet size={20} className="nav-icon" />
        Ingresos
      </NavLink>
      <NavLink to="/expenses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <CreditCard size={20} className="nav-icon" />
        Gastos
      </NavLink>
      <NavLink to="/savings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <PiggyBank size={20} className="nav-icon" />
        Ahorro
      </NavLink>
    </nav>
  );
}
