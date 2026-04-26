import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, roles, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__brand">
          <LayoutDashboard size={24} />
          <h1 className="dashboard__title">Heliflow</h1>
        </div>
        <div className="dashboard__user-area">
          <div className="dashboard__user-info">
            <span className="dashboard__user-name">{user?.fullName}</span>
            <span className="dashboard__user-role">
              {roles.join(', ')}
            </span>
          </div>
          <button
            className="dashboard__logout-btn"
            onClick={logout}
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="dashboard__content">
        <div className="dashboard__welcome">
          <h2>Welcome back, {user?.fullName?.split(' ')[0]} 👋</h2>
          <p>Your Digital RFQ Workflow dashboard is coming soon.</p>
        </div>

        <div className="dashboard__cards">
          <div className="dashboard__card">
            <span className="dashboard__card-label">Open RFQs</span>
            <span className="dashboard__card-value">0</span>
          </div>
          <div className="dashboard__card">
            <span className="dashboard__card-label">Pending Approvals</span>
            <span className="dashboard__card-value">0</span>
          </div>
          <div className="dashboard__card">
            <span className="dashboard__card-label">Active POs</span>
            <span className="dashboard__card-value">0</span>
          </div>
          <div className="dashboard__card">
            <span className="dashboard__card-label">Vendors</span>
            <span className="dashboard__card-value">0</span>
          </div>
        </div>
      </main>
    </div>
  );
}
