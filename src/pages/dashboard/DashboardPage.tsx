import { useAuth } from '../../context/AuthContext';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
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
    </div>
  );
}
