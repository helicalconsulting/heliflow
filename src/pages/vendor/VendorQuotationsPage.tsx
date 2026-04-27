import { useAuth } from '../../context/AuthContext';
import { MOCK_QUOTATIONS } from '../../config/mockData';
import { FileText, TrendingUp, Calendar } from 'lucide-react';
import '../../styles/vendor-portal.css';

export default function VendorQuotationsPage() {
  const { user } = useAuth();
  const vendorId = user?.id || 100;

  // Get quotations submitted by this vendor
  const myQuotations = MOCK_QUOTATIONS.filter((q) => q.vendorId === vendorId - 99);

  const acceptedCount = myQuotations.filter((q) => q.status === 'accepted').length;
  const pendingCount = myQuotations.filter((q) => q.status === 'pending').length;

  return (
    <div className="vendor-portal">
      <div className="vendor-portal__container">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="vendor-header">
          <div className="vendor-header__content">
            <h1>My Quotations</h1>
            <p>Track and manage all your submitted quotations</p>
          </div>
        </div>

        {/* ── Stats ───────────────────────────────────────── */}
        <div className="vendor-kpis">
          <div className="vendor-kpi-card">
            <div className="vendor-kpi-icon">
              <FileText size={24} />
            </div>
            <div>
              <div className="vendor-kpi-label">Total Quotations</div>
              <div className="vendor-kpi-value">{myQuotations.length}</div>
              <div className="vendor-kpi-subtext">All submitted quotations</div>
            </div>
          </div>

          <div className="vendor-kpi-card">
            <div className="vendor-kpi-icon">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="vendor-kpi-label">Accepted</div>
              <div className="vendor-kpi-value">{acceptedCount}</div>
              <div className="vendor-kpi-subtext">Successfully approved</div>
            </div>
          </div>

          <div className="vendor-kpi-card">
            <div className="vendor-kpi-icon">
              <Calendar size={24} />
            </div>
            <div>
              <div className="vendor-kpi-label">Pending Review</div>
              <div className="vendor-kpi-value">{pendingCount}</div>
              <div className="vendor-kpi-subtext">Awaiting response</div>
            </div>
          </div>
        </div>

        {/* ── Quotations Table ────────────────────────────── */}
        <div className="vendor-section">
          <div className="vendor-section__title">
            <FileText size={20} style={{ color: 'var(--vendor-primary)' }} />
            Quotations List
          </div>

          {myQuotations.length > 0 ? (
            <div className="vendor-table-container">
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>RFQ Number</th>
                    <th>Total Price</th>
                    <th>Lead Time</th>
                    <th>Payment Terms</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {myQuotations.map((quotation) => (
                    <tr key={quotation.id}>
                      <td style={{ fontWeight: 600, color: 'var(--vendor-primary)' }}>
                        {quotation.rfqId ? `RFQ-2025-00${quotation.rfqId}` : 'N/A'}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        ₹{quotation.totalPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="text-secondary">{quotation.leadTimeDays} days</td>
                      <td className="text-secondary">{quotation.paymentTerms}</td>
                      <td>
                        <span className={`vendor-badge vendor-badge--${quotation.status.toLowerCase()}`}>
                          {quotation.status}
                        </span>
                      </td>
                      <td className="text-secondary">
                        {new Date(quotation.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="vendor-empty-state">
              <div className="vendor-empty-state__icon">📋</div>
              <div className="vendor-empty-state__title">No Quotations Yet</div>
              <div className="vendor-empty-state__text">
                Submit quotations for assigned RFQs to track them here.
              </div>
            </div>
          )}
        </div>

        {/* ── Quotations Cards ────────────────────────────── */}
        {myQuotations.length > 0 && (
          <div className="vendor-section">
            <div className="vendor-section__title">
              Recent Quotation Details
            </div>

            <div className="vendor-cards-grid">
              {myQuotations.slice(0, 3).map((quotation) => (
                <div key={quotation.id} className="vendor-card">
                  <div className="vendor-card__header">
                    <div>
                      <div className="vendor-card__title">RFQ-2025-00{quotation.rfqId}</div>
                      <div className="vendor-card__subtitle">
                        Submitted {new Date(quotation.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`vendor-badge vendor-badge--${quotation.status.toLowerCase()}`}>
                      {quotation.status}
                    </span>
                  </div>

                  <div className="vendor-card__body">
                    <div className="vendor-card__row">
                      <div className="vendor-card__row-label">Total Price</div>
                      <div className="vendor-card__row-value">
                        ₹{quotation.totalPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="vendor-card__row">
                      <div className="vendor-card__row-label">Lead Time</div>
                      <div className="vendor-card__row-value">{quotation.leadTimeDays} days</div>
                    </div>
                    <div className="vendor-card__row">
                      <div className="vendor-card__row-label">Payment Terms</div>
                      <div className="vendor-card__row-value">{quotation.paymentTerms}</div>
                    </div>
                    {quotation.score && (
                      <div className="vendor-card__row">
                        <div className="vendor-card__row-label">Score</div>
                        <div className="vendor-card__row-value">
                          ⭐ {quotation.score.toFixed(1)}/5
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="vendor-card__footer">
                    <button className="vendor-btn vendor-btn--secondary" style={{ flex: 1 }}>
                      View Details
                    </button>
                    <button className="vendor-btn vendor-btn--tertiary" style={{ flex: 1 }}>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
