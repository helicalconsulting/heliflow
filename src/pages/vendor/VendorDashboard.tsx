import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { MOCK_QUOTATIONS, MOCK_RFQS } from '../../config/mockData';
import { FileText, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
import '../../styles/vendor-portal.css';

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
    <div className="vendor-portal">
      <div className="vendor-portal__container">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="vendor-header">
          <div className="vendor-header__content">
            <h1>Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h1>
            <p>Here's your vendor portal summary. Manage RFQs, quotations, and orders all in one place.</p>
          </div>
        </div>

        {/* ── KPI Cards ───────────────────────────────────── */}
        <div className="vendor-kpis">
          <div className="vendor-kpi-card">
            <div className="vendor-kpi-icon">
              <FileText size={24} />
            </div>
            <div>
              <div className="vendor-kpi-label">Assigned RFQs</div>
              <div className="vendor-kpi-value">{assignedRFQs.length}</div>
              <div className="vendor-kpi-subtext">
                {pendingCount} pending responses
              </div>
            </div>
          </div>

          <div className="vendor-kpi-card">
            <div className="vendor-kpi-icon">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="vendor-kpi-label">Quotations Submitted</div>
              <div className="vendor-kpi-value">{submittedCount}</div>
              <div className="vendor-kpi-subtext">
                {Math.round((submittedCount / assignedRFQs.length) * 100 || 0)}% completion
              </div>
            </div>
          </div>

          <div className="vendor-kpi-card">
            <div className="vendor-kpi-icon">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="vendor-kpi-label">Approval Status</div>
              <div className="vendor-kpi-value">
                {myQuotations.filter((q) => q.status === 'accepted').length}
              </div>
              <div className="vendor-kpi-subtext">
                Quotations approved
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent RFQs Section ────────────────────────── */}
        <div className="vendor-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="vendor-section__title">
              <FileText size={20} style={{ color: 'var(--vendor-primary)' }} />
              Recent RFQ Assignments
            </div>
            <Link
              to="/vendor/rfqs"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--vendor-primary)',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                transition: 'all 250ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(10, 110, 209, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {assignedRFQs.length > 0 ? (
            <div className="vendor-table-container">
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>RFQ Number</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedRFQs.slice(0, 5).map((rfq) => (
                    <tr key={rfq.id}>
                      <td style={{ fontWeight: 600, color: 'var(--vendor-primary)' }}>
                        {rfq.rfqNumber}
                      </td>
                      <td>{rfq.title}</td>
                      <td>
                        <span className={`vendor-badge vendor-badge--${rfq.status.toLowerCase()}`}>
                          {STATUS_LABELS[rfq.status.toLowerCase()] || rfq.status}
                        </span>
                      </td>
                      <td className="text-secondary">
                        {new Date(rfq.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Link
                          to={`/vendor/rfqs/${rfq.id}`}
                          className="vendor-btn vendor-btn--secondary"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="vendor-empty-state">
              <div className="vendor-empty-state__icon">📋</div>
              <div className="vendor-empty-state__title">No RFQs Assigned Yet</div>
              <div className="vendor-empty-state__text">
                When new RFQs are assigned to your company, they will appear here.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
