import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { MOCK_QUOTATIONS, MOCK_RFQS } from '../../config/mockData';
import { FileText, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import '../dashboard/DashboardPage.css';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent',
  progress: 'In Progress',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

export default function VendorDashboard() {
  const { user } = useAuth();

  // Mock vendor ID based on user
  const vendorId = user?.id || 100;

  // Get RFQs assigned to this vendor
  const assignedRFQs = MOCK_RFQS.filter((rfq) =>
    rfq.vendors?.some((v) => v.vendorId === vendorId - 99)
  );

  // Get quotations submitted by this vendor
  const myQuotations = MOCK_QUOTATIONS.filter((q) => q.vendorId === vendorId - 99);

  // Count statistics
  const submittedCount = myQuotations.length;
  const pendingCount = assignedRFQs.length - submittedCount;

  return (
    <div className="dashboard">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="dash-header">
        <div className="dash-header__text">
          <h1>Vendor Dashboard 👋</h1>
          <p>Welcome back, {user?.fullName}! Here's your vendor summary.</p>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div className="dash-kpis">
        <div className="dash-kpi dash-kpi--rfq">
          <div className="dash-kpi__icon">
            <FileText size={20} />
          </div>
          <div className="dash-kpi__body">
            <span className="dash-kpi__label">Assigned RFQs</span>
            <span className="dash-kpi__value">{assignedRFQs.length}</span>
            <span className="dash-kpi__trend dash-kpi__trend--neutral">
              Total RFQs assigned to you
            </span>
          </div>
        </div>

        <div className="dash-kpi dash-kpi--pos">
          <div className="dash-kpi__icon">
            <CheckCircle2 size={20} />
          </div>
          <div className="dash-kpi__body">
            <span className="dash-kpi__label">Quotations Submitted</span>
            <span className="dash-kpi__value">{submittedCount}</span>
            <span className="dash-kpi__trend dash-kpi__trend--up">
              Total quotations submitted
            </span>
          </div>
        </div>

        <div className="dash-kpi dash-kpi--approvals">
          <div className="dash-kpi__icon">
            <Clock size={20} />
          </div>
          <div className="dash-kpi__body">
            <span className="dash-kpi__label">Pending Response</span>
            <span className="dash-kpi__value">{pendingCount}</span>
            <span className="dash-kpi__trend dash-kpi__trend--neutral">
              Awaiting your response
            </span>
          </div>
        </div>
      </div>

      {/* ── Recent RFQs ────────────────────────────────────── */}
      <div className="dash-card">
        <div className="dash-card__header">
          <span className="dash-card__title">
            <FileText size={16} />
            Recent RFQ Assignments
          </span>
          <Link to="/vendor/rfqs" className="dash-card__action">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="dash-card__body dash-card__body--table">
          {assignedRFQs.length > 0 ? (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>RFQ Number</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {assignedRFQs.slice(0, 5).map((rfq) => (
                  <tr key={rfq.id}>
                    <td className="dash-table__rfq-num">{rfq.rfqNumber}</td>
                    <td className="dash-table__title">{rfq.title}</td>
                    <td>
                      <span className={`dash-badge dash-badge--${rfq.status.toLowerCase()}`}>
                        {STATUS_LABELS[rfq.status.toLowerCase()] || rfq.status}
                      </span>
                    </td>
                    <td>{new Date(rfq.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
              No RFQ assignments available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
