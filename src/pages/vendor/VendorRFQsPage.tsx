import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_RFQS } from '../../config/mockData';

export default function VendorRFQsPage() {
  const { user } = useAuth();
  const vendorId = user?.id || 100;

  // Get RFQs assigned to this vendor
  const assignedRFQs = MOCK_RFQS.filter((rfq) =>
    rfq.vendors?.some((v) => v.vendorId === vendorId - 99)
  );

  const [selectedRFQ, setSelectedRFQ] = useState(assignedRFQs[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          My RFQs
        </h1>
        <p style={{ color: '#4b5563', marginTop: '8px' }}>
          RFQs assigned to your company
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        {/* RFQ List */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e5e7eb',
            fontWeight: '600',
            color: '#111827'
          }}>
            Assigned RFQs
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {assignedRFQs.map((rfq) => (
              <button
                key={rfq.id}
                onClick={() => setSelectedRFQ(rfq)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left',
                  backgroundColor: selectedRFQ?.id === rfq.id ? '#dbeafe' : '#fff',
                  borderLeft: selectedRFQ?.id === rfq.id ? '4px solid #0a6ed1' : 'none',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: selectedRFQ?.id === rfq.id ? '#0a6ed1' : '#111827',
                  transition: 'all 0.2s'
                }}
              >
                <p style={{ margin: 0, fontWeight: '600' }}>{rfq.rfqNumber}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {rfq.title}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* RFQ Details */}
        <div>
          {selectedRFQ ? (
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                    {selectedRFQ.rfqNumber}
                  </h2>
                  <p style={{ color: '#4b5563', marginTop: '8px', margin: 0 }}>
                    {selectedRFQ.title}
                  </p>
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: '#fef08a',
                  color: '#713f12'
                }}>
                  {selectedRFQ.status}
                </span>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Description */}
                {selectedRFQ.description && (
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                      Description
                    </h3>
                    <p style={{ color: '#374151', margin: 0 }}>{selectedRFQ.description}</p>
                  </div>
                )}

                {/* Items */}
                {selectedRFQ.items && selectedRFQ.items.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                      Required Items
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      backgroundColor: '#f9fafb',
                      padding: '16px',
                      borderRadius: '6px'
                    }}>
                      {selectedRFQ.items.map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderBottom: idx < selectedRFQ.items!.length - 1 ? '1px solid #e5e7eb' : 'none',
                          paddingBottom: '8px'
                        }}>
                          <div>
                            <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>
                              {item.itemName}
                            </p>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                              {item.description}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>
                              {item.quantity} {item.unit}
                            </p>
                            {item.expectedDate && (
                              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                                By {new Date(item.expectedDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Created Date */}
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  Created on {new Date(selectedRFQ.createdAt).toLocaleDateString()}
                </p>

                {/* Action Button */}
                <button style={{
                  padding: '10px 16px',
                  backgroundColor: '#0a6ed1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0854a0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0a6ed1'}
                >
                  Submit Quotation
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '24px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              Select an RFQ to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
