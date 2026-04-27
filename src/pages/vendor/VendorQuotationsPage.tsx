import { useAuth } from '../../context/AuthContext';
import { MOCK_QUOTATIONS } from '../../config/mockData';

export default function VendorQuotationsPage() {
  const { user } = useAuth();
  const vendorId = user?.id || 100;

  // Get quotations submitted by this vendor
  const myQuotations = MOCK_QUOTATIONS.filter((q) => q.vendorId === vendorId - 99);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          My Quotations
        </h1>
        <p style={{ color: '#4b5563', marginTop: '8px' }}>
          Track all your submitted quotations
        </p>
      </div>

      {/* Quotations Table */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  RFQ Number
                </th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  Total Price
                </th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  Lead Time
                </th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  Payment Terms
                </th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  Status
                </th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody>
              {myQuotations.map((quotation) => (
                <tr key={quotation.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ fontWeight: '500', color: '#0a6ed1', margin: 0 }}>
                      {quotation.rfqId ? `RFQ-2025-00${quotation.rfqId}` : 'N/A'}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ fontWeight: '500', color: '#111827', margin: 0 }}>
                      ₹{quotation.totalPrice.toLocaleString('en-IN')}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#374151' }}>
                    {quotation.leadTimeDays} days
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#374151' }}>
                    {quotation.paymentTerms}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: '#dcfce7',
                      color: '#166534'
                    }}>
                      {quotation.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                    {new Date(quotation.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {myQuotations.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
            No quotations submitted yet
          </div>
        )}
      </div>

      {/* Quotation Details - Latest */}
      {myQuotations.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {myQuotations.slice(0, 2).map((quotation) => (
            <div key={quotation.id} style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '24px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                  RFQ-2025-00{quotation.rfqId}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                  Submitted on {new Date(quotation.submittedAt).toLocaleDateString()}
                </p>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: '#f9fafb',
                padding: '16px',
                borderRadius: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#374151' }}>Total Amount:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>₹{quotation.totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#374151' }}>Lead Time:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{quotation.leadTimeDays} days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#374151' }}>Payment Terms:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{quotation.paymentTerms}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#374151' }}>Score:</span>
                  <span style={{ fontWeight: '600', color: '#111827' }}>{quotation.score?.toFixed(1)} / 5</span>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                <button style={{
                  width: '100%',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#0a6ed1',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Edit Quotation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
