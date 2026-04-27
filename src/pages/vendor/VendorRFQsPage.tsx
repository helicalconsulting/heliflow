import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_RFQS } from '../../config/mockData';
import { FileText, Calendar, Send } from 'lucide-react';
import '../../styles/vendor-portal.css';

export default function VendorRFQsPage() {
  const { user } = useAuth();
  const vendorId = user?.id || 100;

  // Get RFQs assigned to this vendor
  const assignedRFQs = MOCK_RFQS.filter((rfq) =>
    rfq.vendors?.some((v) => v.vendorId === vendorId - 99)
  );

  const [selectedRFQ, setSelectedRFQ] = useState(assignedRFQs[0]);

  return (
    <div className="vendor-portal">
      <div className="vendor-portal__container">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="vendor-header">
          <div className="vendor-header__content">
            <h1>My RFQ Assignments</h1>
            <p>Manage and submit quotations for RFQs assigned to your company</p>
          </div>
        </div>

        {/* ── Two-Column Layout ───────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* ── Left: RFQ List ──────────────────────────── */}
          <div className="vendor-table-container" style={{ maxHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              padding: 'var(--vendor-space-6)',
              borderBottom: '1px solid var(--border)',
              fontWeight: 600,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--text-secondary)'
            }}>
              <FileText size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Assigned RFQs
            </div>
            <div style={{
              flex: 1,
              overflowY: 'auto'
            }}>
              {assignedRFQs.map((rfq, idx) => (
                <button
                  key={rfq.id}
                  onClick={() => setSelectedRFQ(rfq)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    textAlign: 'left',
                    backgroundColor: selectedRFQ?.id === rfq.id ? 'var(--surface-hover)' : 'transparent',
                    borderLeft: selectedRFQ?.id === rfq.id ? '3px solid var(--vendor-primary)' : 'none',
                    borderBottom: idx < assignedRFQs.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: selectedRFQ?.id === rfq.id ? 'var(--vendor-primary)' : 'var(--text-primary)',
                    transition: 'all var(--vendor-transition-fast)',
                    border: 'none',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedRFQ?.id !== rfq.id) {
                      e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedRFQ?.id !== rfq.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 600, color: 'inherit' }}>
                    {rfq.rfqNumber}
                  </p>
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {rfq.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: RFQ Details ──────────────────────── */}
          {selectedRFQ ? (
            <div className="vendor-table-container" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                padding: 'var(--vendor-space-6)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 'var(--vendor-space-4)'
              }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    {selectedRFQ.rfqNumber}
                  </h2>
                  <p style={{
                    color: 'var(--text-secondary)',
                    marginTop: '8px',
                    margin: 0,
                    fontSize: '14px'
                  }}>
                    {selectedRFQ.title}
                  </p>
                </div>
                <span className={`vendor-badge vendor-badge--${selectedRFQ.status.toLowerCase()}`}>
                  {selectedRFQ.status}
                </span>
              </div>

              <div style={{
                padding: 'var(--vendor-space-6)',
                overflow: 'auto',
                flex: 1
              }}>
                {/* ─── Description ─────────────────────── */}
                {selectedRFQ.description && (
                  <div style={{ marginBottom: 'var(--vendor-space-8)' }}>
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 'var(--vendor-space-3)',
                      margin: 0
                    }}>
                      Description
                    </h3>
                    <p style={{
                      color: 'var(--text-primary)',
                      margin: 0,
                      lineHeight: 1.6
                    }}>
                      {selectedRFQ.description}
                    </p>
                  </div>
                )}

                {/* ─── Required Items ──────────────────── */}
                {selectedRFQ.items && selectedRFQ.items.length > 0 && (
                  <div style={{ marginBottom: 'var(--vendor-space-8)' }}>
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: 'var(--vendor-space-4)',
                      margin: 0
                    }}>
                      Required Items
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--vendor-space-3)'
                    }}>
                      {selectedRFQ.items.map((item, idx) => (
                        <div key={idx} style={{
                          padding: 'var(--vendor-space-4)',
                          backgroundColor: 'var(--surface-elevated)',
                          borderRadius: 'var(--vendor-radius-md)',
                          border: '1px solid var(--border)',
                          transition: 'all var(--vendor-transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--vendor-primary)';
                          e.currentTarget.style.backgroundColor = 'rgba(10, 110, 209, 0.03)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
                        }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--vendor-space-2)' }}>
                            <div>
                              <p style={{
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                margin: 0
                              }}>
                                {item.itemName}
                              </p>
                              <p style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                margin: '4px 0 0 0'
                              }}>
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            marginTop: 'var(--vendor-space-3)',
                            paddingTop: 'var(--vendor-space-3)',
                            borderTop: '1px solid var(--border)'
                          }}>
                            <span>Qty: <strong>{item.quantity} {item.unit}</strong></span>
                            {item.expectedDate && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={14} /> By {new Date(item.expectedDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Meta Info ───────────────────────── */}
                <div style={{
                  padding: 'var(--vendor-space-4)',
                  backgroundColor: 'var(--surface-elevated)',
                  borderRadius: 'var(--vendor-radius-md)',
                  border: '1px solid var(--border)',
                  marginBottom: 'var(--vendor-space-6)'
                }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                    <strong>Created:</strong> {new Date(selectedRFQ.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* ─── Action Button ──────────────────────── */}
              <div style={{
                padding: 'var(--vendor-space-6)',
                borderTop: '1px solid var(--border)',
                backgroundColor: 'var(--surface-elevated)'
              }}>
                <button className="vendor-btn vendor-btn--primary" style={{ width: '100%' }}>
                  <Send size={16} /> Submit Quotation
                </button>
              </div>
            </div>
          ) : (
            <div className="vendor-empty-state">
              <div className="vendor-empty-state__icon">📋</div>
              <div className="vendor-empty-state__title">No RFQ Selected</div>
              <div className="vendor-empty-state__text">
                Select an RFQ from the list to view details and submit a quotation.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
