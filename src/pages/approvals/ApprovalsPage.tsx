import { useState, useMemo, useCallback } from 'react';
import {
  CheckSquare,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  X,
  FileText,
  ShoppingCart,
  ClipboardList,
  Filter,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import './ApprovalsPage.css';

// ─── Types ──────────────────────────────────────────────────

type ApprovalStatusType = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';
type ModuleType = 'RFQ' | 'Purchase Order' | 'Quotation';
type PriorityType = 'HIGH' | 'MEDIUM' | 'LOW';

interface ApprovalRequest {
  id: number;
  module: ModuleType;
  referenceNumber: string;
  title: string;
  requestedBy: string;
  requestedByInitials: string;
  avatarMod: string;
  amount: string;
  amountNum: number;
  currentLevel: number;
  totalLevels: number;
  requiredRole: string;
  status: ApprovalStatusType;
  priority: PriorityType;
  submittedAt: string;
  comments?: string;
  department: string;
}

// ─── Mock Data ──────────────────────────────────────────────

const MOCK_APPROVALS: ApprovalRequest[] = [
  {
    id: 1, module: 'Purchase Order', referenceNumber: 'PO-2024-0042', title: 'Server Room Equipment',
    requestedBy: 'Rahul Sharma', requestedByInitials: 'RS', avatarMod: '2',
    amount: '₹17,85,000', amountNum: 1785000, currentLevel: 2, totalLevels: 3,
    requiredRole: 'Finance Approver', status: 'PENDING', priority: 'HIGH',
    submittedAt: '2024-04-26T10:30:00', department: 'Engineering',
  },
  {
    id: 2, module: 'RFQ', referenceNumber: 'RFQ-2024-021', title: 'Industrial Safety Equipment',
    requestedBy: 'Vikram Singh', requestedByInitials: 'VS', avatarMod: '6',
    amount: '₹4,50,000', amountNum: 450000, currentLevel: 1, totalLevels: 2,
    requiredRole: 'Manager', status: 'PENDING', priority: 'MEDIUM',
    submittedAt: '2024-04-26T09:15:00', department: 'Manufacturing',
  },
  {
    id: 3, module: 'Purchase Order', referenceNumber: 'PO-2024-0041', title: 'Electrical Components Bulk Order',
    requestedBy: 'Priya Patel', requestedByInitials: 'PP', avatarMod: '3',
    amount: '₹6,90,000', amountNum: 690000, currentLevel: 1, totalLevels: 3,
    requiredRole: 'Manager', status: 'PENDING', priority: 'HIGH',
    submittedAt: '2024-04-25T16:45:00', department: 'Operations',
  },
  {
    id: 4, module: 'Quotation', referenceNumber: 'QT-2024-056', title: 'Lab Instruments Quotation Review',
    requestedBy: 'Amit Kumar', requestedByInitials: 'AK', avatarMod: '4',
    amount: '₹9,30,000', amountNum: 930000, currentLevel: 2, totalLevels: 2,
    requiredRole: 'Finance Approver', status: 'PENDING', priority: 'LOW',
    submittedAt: '2024-04-25T14:20:00', department: 'Engineering',
  },
  {
    id: 5, module: 'RFQ', referenceNumber: 'RFQ-2024-020', title: 'Office Furniture Procurement',
    requestedBy: 'Anjali Mehta', requestedByInitials: 'AM', avatarMod: '5',
    amount: '₹2,10,000', amountNum: 210000, currentLevel: 1, totalLevels: 2,
    requiredRole: 'Manager', status: 'APPROVED', priority: 'LOW',
    submittedAt: '2024-04-24T11:00:00', comments: 'Approved. Budget allocation confirmed.', department: 'Admin',
  },
  {
    id: 6, module: 'Purchase Order', referenceNumber: 'PO-2024-0039', title: 'Packaging Materials — Q2',
    requestedBy: 'Suresh Nair', requestedByInitials: 'SN', avatarMod: '6',
    amount: '₹1,95,000', amountNum: 195000, currentLevel: 2, totalLevels: 2,
    requiredRole: 'Finance Approver', status: 'APPROVED', priority: 'MEDIUM',
    submittedAt: '2024-04-23T09:30:00', comments: 'Vendor pricing verified.', department: 'Manufacturing',
  },
  {
    id: 7, module: 'Quotation', referenceNumber: 'QT-2024-052', title: 'Networking Switches Evaluation',
    requestedBy: 'Deepak Joshi', requestedByInitials: 'DJ', avatarMod: '2',
    amount: '₹12,40,000', amountNum: 1240000, currentLevel: 1, totalLevels: 3,
    requiredRole: 'Manager', status: 'REJECTED', priority: 'HIGH',
    submittedAt: '2024-04-22T15:10:00', comments: 'Pricing exceeds approved budget. Re-negotiate.', department: 'IT',
  },
  {
    id: 8, module: 'RFQ', referenceNumber: 'RFQ-2024-018', title: 'Wiring & Cable Supply',
    requestedBy: 'Kavita Reddy', requestedByInitials: 'KR', avatarMod: '3',
    amount: '₹7,10,000', amountNum: 710000, currentLevel: 2, totalLevels: 3,
    requiredRole: 'Finance Approver', status: 'RETURNED', priority: 'MEDIUM',
    submittedAt: '2024-04-21T10:45:00', comments: 'Missing vendor compliance documents.', department: 'Operations',
  },
  {
    id: 9, module: 'Purchase Order', referenceNumber: 'PO-2024-0037', title: 'PPE Kits for Workshop',
    requestedBy: 'Rahul Sharma', requestedByInitials: 'RS', avatarMod: '2',
    amount: '₹3,60,000', amountNum: 360000, currentLevel: 3, totalLevels: 3,
    requiredRole: 'Administrator', status: 'APPROVED', priority: 'HIGH',
    submittedAt: '2024-04-20T08:20:00', comments: 'Final level approved.', department: 'Engineering',
  },
  {
    id: 10, module: 'Quotation', referenceNumber: 'QT-2024-048', title: 'HVAC System Maintenance Contract',
    requestedBy: 'Sneha Gupta', requestedByInitials: 'SG', avatarMod: '5',
    amount: '₹15,80,000', amountNum: 1580000, currentLevel: 1, totalLevels: 3,
    requiredRole: 'Manager', status: 'PENDING', priority: 'HIGH',
    submittedAt: '2024-04-26T07:00:00', department: 'Finance',
  },
];

const STATUS_LABELS: Record<ApprovalStatusType, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  RETURNED: 'Returned',
};

const MODULE_ICONS: Record<ModuleType, React.ReactNode> = {
  RFQ: <FileText size={15} />,
  'Purchase Order': <ShoppingCart size={15} />,
  Quotation: <ClipboardList size={15} />,
};

const PRIORITY_CLASS: Record<PriorityType, string> = { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' };
const STATUS_FILTERS: ('ALL' | ApprovalStatusType)[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'RETURNED'];

// ─── Component ──────────────────────────────────────────────

export default function ApprovalsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApprovalStatusType>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [approvals, setApprovals] = useState(MOCK_APPROVALS);
  const [actionModal, setActionModal] = useState<{ request: ApprovalRequest; action: 'approve' | 'reject' | 'return' } | null>(null);
  const [actionComment, setActionComment] = useState('');
  const [detailRequest, setDetailRequest] = useState<ApprovalRequest | null>(null);
  const perPage = 8;

  // Summary
  const summary = useMemo(() => ({
    total: approvals.length,
    pending: approvals.filter((a) => a.status === 'PENDING').length,
    approved: approvals.filter((a) => a.status === 'APPROVED').length,
    rejected: approvals.filter((a) => a.status === 'REJECTED').length,
  }), [approvals]);

  // Filter counts
  const filterCounts = useMemo(() => {
    const c: Record<string, number> = { ALL: approvals.length };
    for (const a of approvals) c[a.status] = (c[a.status] || 0) + 1;
    return c;
  }, [approvals]);

  // Filter + search
  const filtered = useMemo(() => {
    let list = approvals;
    if (statusFilter !== 'ALL') list = list.filter((a) => a.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.referenceNumber.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.requestedBy.toLowerCase().includes(q) ||
          a.module.toLowerCase().includes(q)
      );
    }
    return list;
  }, [approvals, statusFilter, search]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Action handler
  const handleAction = useCallback(() => {
    if (!actionModal) return;
    const newStatus: ApprovalStatusType =
      actionModal.action === 'approve' ? 'APPROVED' :
      actionModal.action === 'reject' ? 'REJECTED' : 'RETURNED';
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === actionModal.request.id
          ? { ...a, status: newStatus, comments: actionComment.trim() || undefined }
          : a
      )
    );
    setActionModal(null);
    setActionComment('');
  }, [actionModal, actionComment]);

  const openAction = useCallback((request: ApprovalRequest, action: 'approve' | 'reject' | 'return') => {
    setActionModal({ request, action });
    setActionComment('');
  }, []);

  const formatDateTime = (d: string) => {
    const date = new Date(d);
    return `${date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const actionTitle = actionModal?.action === 'approve' ? 'Approve Request' : actionModal?.action === 'reject' ? 'Reject Request' : 'Return Request';
  const actionColor = actionModal?.action === 'approve' ? 'approve' : actionModal?.action === 'reject' ? 'reject' : 'return';

  return (
    <div className="approvals-page">
      {/* Header */}
      <div className="approvals-page__header">
        <div className="approvals-page__header-left">
          <h1>Approvals</h1>
          <p>Review, approve, or reject pending requests across modules</p>
        </div>
      </div>

      {/* Summary */}
      <div className="approvals-summary">
        {[
          { icon: <CheckSquare size={22} />, value: summary.total, label: 'Total Requests', cls: 'total' },
          { icon: <Clock size={22} />, value: summary.pending, label: 'Pending', cls: 'pending' },
          { icon: <CheckCircle2 size={22} />, value: summary.approved, label: 'Approved', cls: 'approved' },
          { icon: <XCircle size={22} />, value: summary.rejected, label: 'Rejected', cls: 'rejected' },
        ].map((c) => (
          <div key={c.cls} className="approvals-summary-card">
            <div className={`approvals-summary-card__icon approvals-summary-card__icon--${c.cls}`}>{c.icon}</div>
            <div className="approvals-summary-card__info">
              <span className="approvals-summary-card__value">{c.value}</span>
              <span className="approvals-summary-card__label">{c.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Status Filter Pills */}
      <div className="approvals-pills">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            className={`approvals-pill ${statusFilter === s ? 'approvals-pill--active' : ''}`}
            onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
          >
            {s === 'ALL' ? 'All' : STATUS_LABELS[s]}
            <span className="approvals-pill__count">{filterCounts[s] || 0}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="approvals-toolbar">
        <div className="approvals-toolbar__search">
          <Search size={16} className="approvals-toolbar__search-icon" />
          <input
            type="text"
            placeholder="Search by reference, title, requester, or module..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <button className="approvals-toolbar__filter">
          <Filter size={14} />
          Module
        </button>
      </div>

      {/* Table */}
      {paginated.length > 0 ? (
        <div className="approvals-table-card">
          <div className="approvals-table-wrap">
            <table className="approvals-table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Module</th>
                  <th>Amount</th>
                  <th>Priority</th>
                  <th>Approval Level</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className="approvals-table__request">
                        <div className={`approvals-table__avatar approvals-table__avatar--${req.avatarMod}`}>
                          {req.requestedByInitials}
                        </div>
                        <div className="approvals-table__request-info">
                          <span className="approvals-table__ref">{req.referenceNumber}</span>
                          <span className="approvals-table__title">{req.title}</span>
                          <span className="approvals-table__requester">by {req.requestedBy} · {req.department}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`approvals-module-badge approvals-module-badge--${req.module.toLowerCase().replace(' ', '-')}`}>
                        {MODULE_ICONS[req.module]}
                        {req.module}
                      </span>
                    </td>
                    <td className="approvals-table__amount">{req.amount}</td>
                    <td>
                      <span className={`approvals-priority approvals-priority--${PRIORITY_CLASS[req.priority]}`}>
                        {req.priority === 'HIGH' && <AlertTriangle size={11} />}
                        {req.priority}
                      </span>
                    </td>
                    <td>
                      <div className="approvals-level">
                        <div className="approvals-level__bar">
                          {Array.from({ length: req.totalLevels }, (_, i) => (
                            <div
                              key={i}
                              className={`approvals-level__dot ${i < req.currentLevel ? 'approvals-level__dot--filled' : ''} ${i === req.currentLevel - 1 ? 'approvals-level__dot--current' : ''}`}
                            />
                          ))}
                        </div>
                        <span className="approvals-level__text">L{req.currentLevel}/{req.totalLevels}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`approvals-badge approvals-badge--${req.status}`}>{STATUS_LABELS[req.status]}</span>
                    </td>
                    <td className="approvals-table__date">{formatDateTime(req.submittedAt)}</td>
                    <td>
                      <div className="approvals-table__actions">
                        <button className="approvals-table__action-btn" title="View Details" onClick={() => setDetailRequest(req)}>
                          <Eye size={15} />
                        </button>
                        {req.status === 'PENDING' && (
                          <>
                            <button className="approvals-table__action-btn approvals-table__action-btn--approve" title="Approve" onClick={() => openAction(req, 'approve')}>
                              <ThumbsUp size={15} />
                            </button>
                            <button className="approvals-table__action-btn approvals-table__action-btn--reject" title="Reject" onClick={() => openAction(req, 'reject')}>
                              <ThumbsDown size={15} />
                            </button>
                            <button className="approvals-table__action-btn approvals-table__action-btn--return" title="Return" onClick={() => openAction(req, 'return')}>
                              <RotateCcw size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > perPage && (
            <div className="approvals-pagination">
              <span className="approvals-pagination__info">
                Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
              </span>
              <div className="approvals-pagination__btns">
                <button className="approvals-pagination__btn" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`approvals-pagination__btn ${currentPage === p ? 'approvals-pagination__btn--active' : ''}`} onClick={() => setCurrentPage(p)}>
                    {p}
                  </button>
                ))}
                <button className="approvals-pagination__btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="approvals-table-card">
          <div className="approvals-empty">
            <div className="approvals-empty__icon"><CheckSquare size={48} /></div>
            <div className="approvals-empty__title">No requests found</div>
            <div className="approvals-empty__desc">{search ? 'Try adjusting your search.' : 'All caught up! No approval requests at the moment.'}</div>
          </div>
        </div>
      )}

      {/* Action Modal (Approve / Reject / Return) */}
      {actionModal && (
        <div className="approvals-modal-backdrop" onClick={() => setActionModal(null)}>
          <div className="approvals-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`approvals-modal__header approvals-modal__header--${actionColor}`}>
              <div className="approvals-modal__title">
                {actionModal.action === 'approve' ? <ThumbsUp size={20} /> : actionModal.action === 'reject' ? <ThumbsDown size={20} /> : <RotateCcw size={20} />}
                <span>{actionTitle}</span>
              </div>
              <button className="approvals-modal__close" onClick={() => setActionModal(null)}><X size={18} /></button>
            </div>
            <div className="approvals-modal__body">
              <div className="approvals-modal__request-summary">
                <div className="approvals-modal__summary-row">
                  <span className="approvals-modal__summary-label">Reference</span>
                  <span className="approvals-modal__summary-value">{actionModal.request.referenceNumber}</span>
                </div>
                <div className="approvals-modal__summary-row">
                  <span className="approvals-modal__summary-label">Title</span>
                  <span className="approvals-modal__summary-value">{actionModal.request.title}</span>
                </div>
                <div className="approvals-modal__summary-row">
                  <span className="approvals-modal__summary-label">Amount</span>
                  <span className="approvals-modal__summary-value approvals-modal__summary-value--amount">{actionModal.request.amount}</span>
                </div>
                <div className="approvals-modal__summary-row">
                  <span className="approvals-modal__summary-label">Requested By</span>
                  <span className="approvals-modal__summary-value">{actionModal.request.requestedBy}</span>
                </div>
              </div>
              <div className="approvals-modal__field">
                <label className="approvals-modal__label">
                  <MessageSquare size={13} style={{ marginRight: 4 }} />
                  Comments {actionModal.action !== 'approve' && <span>*</span>}
                </label>
                <textarea
                  className="approvals-modal__textarea"
                  rows={4}
                  placeholder={actionModal.action === 'approve' ? 'Optional comments...' : 'Provide a reason...'}
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                />
              </div>
            </div>
            <div className="approvals-modal__footer">
              <button className="approvals-modal__btn approvals-modal__btn--secondary" onClick={() => setActionModal(null)}>Cancel</button>
              <button
                className={`approvals-modal__btn approvals-modal__btn--${actionColor}`}
                disabled={actionModal.action !== 'approve' && !actionComment.trim()}
                onClick={handleAction}
              >
                {actionModal.action === 'approve' ? <ThumbsUp size={16} /> : actionModal.action === 'reject' ? <ThumbsDown size={16} /> : <RotateCcw size={16} />}
                {actionModal.action === 'approve' ? 'Approve' : actionModal.action === 'reject' ? 'Reject' : 'Return'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailRequest && (
        <div className="approvals-modal-backdrop" onClick={() => setDetailRequest(null)}>
          <div className="approvals-modal approvals-modal--detail" onClick={(e) => e.stopPropagation()}>
            <div className="approvals-modal__header">
              <div className="approvals-modal__title"><Eye size={20} /><span>Request Details</span></div>
              <button className="approvals-modal__close" onClick={() => setDetailRequest(null)}><X size={18} /></button>
            </div>
            <div className="approvals-modal__body">
              <div className="approvals-detail-grid">
                {[
                  { label: 'Reference', value: detailRequest.referenceNumber },
                  { label: 'Module', value: detailRequest.module },
                  { label: 'Title', value: detailRequest.title },
                  { label: 'Amount', value: detailRequest.amount },
                  { label: 'Requested By', value: detailRequest.requestedBy },
                  { label: 'Department', value: detailRequest.department },
                  { label: 'Priority', value: detailRequest.priority },
                  { label: 'Status', value: STATUS_LABELS[detailRequest.status] },
                  { label: 'Approval Level', value: `Level ${detailRequest.currentLevel} of ${detailRequest.totalLevels}` },
                  { label: 'Required Role', value: detailRequest.requiredRole },
                  { label: 'Submitted', value: formatDateTime(detailRequest.submittedAt) },
                ].map((item) => (
                  <div key={item.label} className="approvals-detail-grid__item">
                    <span className="approvals-detail-grid__label">{item.label}</span>
                    <span className="approvals-detail-grid__value">{item.value}</span>
                  </div>
                ))}
              </div>
              {detailRequest.comments && (
                <div className="approvals-detail-comments">
                  <span className="approvals-detail-comments__label"><MessageSquare size={13} /> Comments</span>
                  <p className="approvals-detail-comments__text">{detailRequest.comments}</p>
                </div>
              )}
            </div>
            <div className="approvals-modal__footer">
              <button className="approvals-modal__btn approvals-modal__btn--secondary" onClick={() => setDetailRequest(null)}>Close</button>
              {detailRequest.status === 'PENDING' && (
                <>
                  <button className="approvals-modal__btn approvals-modal__btn--approve" onClick={() => { setDetailRequest(null); openAction(detailRequest, 'approve'); }}>
                    <ThumbsUp size={16} /> Approve
                  </button>
                  <button className="approvals-modal__btn approvals-modal__btn--reject" onClick={() => { setDetailRequest(null); openAction(detailRequest, 'reject'); }}>
                    <ThumbsDown size={16} /> Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
