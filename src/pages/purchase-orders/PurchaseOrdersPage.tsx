import { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Search,
  Plus,
  Eye,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  LayoutGrid,
  Calendar,
  IndianRupee,
  AlertTriangle,
} from 'lucide-react';
import './PurchaseOrdersPage.css';

// ─── Types ──────────────────────────────────────────────────

type POStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';

interface MockPO {
  id: number;
  poNumber: string;
  rfqNumber: string;
  vendorName: string;
  vendorInitials: string;
  avatarMod: string;
  totalAmount: string;
  totalAmountNum: number;
  itemCount: number;
  status: POStatus;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  expectedDelivery: string;
  department: string;
  createdBy: string;
}

// ─── Mock Data ──────────────────────────────────────────────

const MOCK_POS: MockPO[] = [
  { id: 1, poNumber: 'PO-2024-0042', rfqNumber: 'RFQ-2024-019', vendorName: 'TechSupply Co.', vendorInitials: 'TS', avatarMod: '1',
    totalAmount: '₹17,85,000', totalAmountNum: 1785000, itemCount: 12, status: 'PENDING_APPROVAL', priority: 'HIGH',
    createdAt: '2024-04-26', expectedDelivery: '2024-05-10', department: 'Engineering', createdBy: 'Rahul Sharma' },
  { id: 2, poNumber: 'PO-2024-0041', rfqNumber: 'RFQ-2024-018', vendorName: 'ElectroPower India', vendorInitials: 'EP', avatarMod: '3',
    totalAmount: '₹6,90,000', totalAmountNum: 690000, itemCount: 15, status: 'APPROVED', priority: 'HIGH',
    createdAt: '2024-04-25', expectedDelivery: '2024-05-05', department: 'Operations', createdBy: 'Priya Patel' },
  { id: 3, poNumber: 'PO-2024-0040', rfqNumber: 'RFQ-2024-017', vendorName: 'SafeGuard Corp.', vendorInitials: 'SC', avatarMod: '1',
    totalAmount: '₹3,60,000', totalAmountNum: 360000, itemCount: 20, status: 'DISPATCHED', priority: 'MEDIUM',
    createdAt: '2024-04-23', expectedDelivery: '2024-05-02', department: 'Manufacturing', createdBy: 'Vikram Singh' },
  { id: 4, poNumber: 'PO-2024-0039', rfqNumber: 'RFQ-2024-015', vendorName: 'PackRight India', vendorInitials: 'PR', avatarMod: '4',
    totalAmount: '₹1,95,000', totalAmountNum: 195000, itemCount: 9, status: 'DELIVERED', priority: 'LOW',
    createdAt: '2024-04-20', expectedDelivery: '2024-04-28', department: 'Manufacturing', createdBy: 'Suresh Nair' },
  { id: 5, poNumber: 'PO-2024-0038', rfqNumber: 'RFQ-2024-014', vendorName: 'DigiParts Ltd.', vendorInitials: 'DP', avatarMod: '2',
    totalAmount: '₹8,20,000', totalAmountNum: 820000, itemCount: 8, status: 'CANCELLED', priority: 'MEDIUM',
    createdAt: '2024-04-18', expectedDelivery: '2024-05-01', department: 'IT', createdBy: 'Deepak Joshi' },
  { id: 6, poNumber: 'PO-2024-0037', rfqNumber: 'RFQ-2024-013', vendorName: 'PPE Direct', vendorInitials: 'PD', avatarMod: '2',
    totalAmount: '₹4,10,000', totalAmountNum: 410000, itemCount: 20, status: 'DELIVERED', priority: 'HIGH',
    createdAt: '2024-04-15', expectedDelivery: '2024-04-22', department: 'Engineering', createdBy: 'Rahul Sharma' },
  { id: 7, poNumber: 'PO-2024-0036', rfqNumber: 'RFQ-2024-012', vendorName: 'LabTech Solutions', vendorInitials: 'LT', avatarMod: '4',
    totalAmount: '₹9,30,000', totalAmountNum: 930000, itemCount: 7, status: 'APPROVED', priority: 'MEDIUM',
    createdAt: '2024-04-12', expectedDelivery: '2024-04-30', department: 'Engineering', createdBy: 'Amit Kumar' },
  { id: 8, poNumber: 'PO-2024-0035', rfqNumber: 'RFQ-2024-011', vendorName: 'WiringHub Pvt. Ltd.', vendorInitials: 'WH', avatarMod: '6',
    totalAmount: '₹5,45,000', totalAmountNum: 545000, itemCount: 11, status: 'DISPATCHED', priority: 'LOW',
    createdAt: '2024-04-10', expectedDelivery: '2024-04-25', department: 'Operations', createdBy: 'Priya Patel' },
  { id: 9, poNumber: 'PO-2024-0034', rfqNumber: 'RFQ-2024-010', vendorName: 'SwitchGear Pro', vendorInitials: 'SG', avatarMod: '5',
    totalAmount: '₹2,80,000', totalAmountNum: 280000, itemCount: 6, status: 'DRAFT', priority: 'LOW',
    createdAt: '2024-04-08', expectedDelivery: '2024-05-15', department: 'Operations', createdBy: 'Kavita Reddy' },
  { id: 10, poNumber: 'PO-2024-0033', rfqNumber: 'RFQ-2024-009', vendorName: 'InstruPrecision', vendorInitials: 'IP', avatarMod: '5',
    totalAmount: '₹10,20,000', totalAmountNum: 1020000, itemCount: 5, status: 'PENDING_APPROVAL', priority: 'HIGH',
    createdAt: '2024-04-05', expectedDelivery: '2024-05-20', department: 'Engineering', createdBy: 'Amit Kumar' },
];

const STATUS_LABELS: Record<POStatus, string> = {
  DRAFT: 'Draft', PENDING_APPROVAL: 'Pending Approval', APPROVED: 'Approved',
  DISPATCHED: 'Dispatched', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
};

const STATUS_ICONS: Record<POStatus, React.ReactNode> = {
  DRAFT: <FileText size={12} />, PENDING_APPROVAL: <Clock size={12} />, APPROVED: <CheckCircle2 size={12} />,
  DISPATCHED: <Truck size={12} />, DELIVERED: <Package size={12} />, CANCELLED: <XCircle size={12} />,
};

const STATUS_FILTERS: ('ALL' | POStatus)[] = ['ALL', 'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];

// ─── Component ──────────────────────────────────────────────

export default function PurchaseOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | POStatus>('ALL');
  const [view, setView] = useState<'table' | 'card'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [detailPO, setDetailPO] = useState<MockPO | null>(null);
  const perPage = 8;

  const summary = useMemo(() => ({
    total: MOCK_POS.length,
    pending: MOCK_POS.filter(p => p.status === 'PENDING_APPROVAL' || p.status === 'DRAFT').length,
    active: MOCK_POS.filter(p => p.status === 'APPROVED' || p.status === 'DISPATCHED').length,
    totalValue: '₹70,35,000',
  }), []);

  const filterCounts = useMemo(() => {
    const c: Record<string, number> = { ALL: MOCK_POS.length };
    for (const p of MOCK_POS) c[p.status] = (c[p.status] || 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list: MockPO[] = MOCK_POS;
    if (statusFilter !== 'ALL') list = list.filter(p => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.poNumber.toLowerCase().includes(q) || p.vendorName.toLowerCase().includes(q) ||
        p.rfqNumber.toLowerCase().includes(q) || p.createdBy.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q)
      );
    }
    return list;
  }, [statusFilter, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="po-page">
      {/* Header */}
      <div className="po-page__header">
        <div className="po-page__header-left">
          <h1>Purchase Orders</h1>
          <p>Track, manage, and monitor all purchase orders across departments</p>
        </div>
        <button className="po-page__add-btn"><Plus size={18} /> Create PO</button>
      </div>

      {/* Summary */}
      <div className="po-summary">
        {[
          { icon: <ShoppingCart size={22} />, val: summary.total, label: 'Total Orders', cls: 'total' },
          { icon: <Clock size={22} />, val: summary.pending, label: 'Pending', cls: 'pending' },
          { icon: <Truck size={22} />, val: summary.active, label: 'Active', cls: 'active' },
          { icon: <IndianRupee size={22} />, val: summary.totalValue, label: 'Total Value', cls: 'value' },
        ].map(c => (
          <div key={c.cls} className="po-summary-card">
            <div className={`po-summary-card__icon po-summary-card__icon--${c.cls}`}>{c.icon}</div>
            <div className="po-summary-card__info">
              <span className="po-summary-card__value">{c.val}</span>
              <span className="po-summary-card__label">{c.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Status Pills */}
      <div className="po-pills">
        {STATUS_FILTERS.map(s => (
          <button key={s} className={`po-pill ${statusFilter === s ? 'po-pill--active' : ''}`}
            onClick={() => { setStatusFilter(s); setCurrentPage(1); }}>
            {s !== 'ALL' && STATUS_ICONS[s]}
            {s === 'ALL' ? 'All' : STATUS_LABELS[s]}
            <span className="po-pill__count">{filterCounts[s] || 0}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="po-toolbar">
        <div className="po-toolbar__search">
          <Search size={16} className="po-toolbar__search-icon" />
          <input type="text" placeholder="Search by PO number, vendor, RFQ, department..."
            value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
        </div>
        <div className="po-toolbar__right">
          <button className="po-toolbar__filter"><Filter size={14} /> Priority</button>
          <div className="po-toolbar__view-toggle">
            <button className={`po-toolbar__view-btn ${view === 'table' ? 'po-toolbar__view-btn--active' : ''}`}
              onClick={() => setView('table')}><LayoutList size={16} /></button>
            <button className={`po-toolbar__view-btn ${view === 'card' ? 'po-toolbar__view-btn--active' : ''}`}
              onClick={() => setView('card')}><LayoutGrid size={16} /></button>
          </div>
        </div>
      </div>

      {/* Content */}
      {paginated.length > 0 ? (
        view === 'table' ? (
          <div className="po-table-card">
            <div className="po-table-wrap">
              <table className="po-table">
                <thead>
                  <tr>
                    <th>Purchase Order</th>
                    <th>Vendor</th>
                    <th>Amount</th>
                    <th>Items</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Expected Delivery</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(po => (
                    <tr key={po.id}>
                      <td>
                        <div className="po-table__po-info">
                          <span className="po-table__po-number">{po.poNumber}</span>
                          <span className="po-table__rfq-link">{po.rfqNumber}</span>
                          <span className="po-table__meta">by {po.createdBy} · {po.department}</span>
                        </div>
                      </td>
                      <td>
                        <div className="po-table__vendor">
                          <div className={`po-table__avatar po-table__avatar--${po.avatarMod}`}>{po.vendorInitials}</div>
                          <span className="po-table__vendor-name">{po.vendorName}</span>
                        </div>
                      </td>
                      <td className="po-table__amount">{po.totalAmount}</td>
                      <td className="po-table__items">{po.itemCount}</td>
                      <td>
                        <span className={`po-priority po-priority--${po.priority.toLowerCase()}`}>
                          {po.priority === 'HIGH' && <AlertTriangle size={11} />}
                          {po.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`po-badge po-badge--${po.status}`}>
                          {STATUS_ICONS[po.status]} {STATUS_LABELS[po.status]}
                        </span>
                      </td>
                      <td className="po-table__date">
                        <Calendar size={12} /> {formatDate(po.expectedDelivery)}
                      </td>
                      <td>
                        <div className="po-table__actions">
                          <button className="po-table__action-btn" title="View Details" onClick={() => setDetailPO(po)}><Eye size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length > perPage && (
              <div className="po-pagination">
                <span className="po-pagination__info">Showing {(currentPage-1)*perPage+1}–{Math.min(currentPage*perPage, filtered.length)} of {filtered.length}</span>
                <div className="po-pagination__btns">
                  <button className="po-pagination__btn" disabled={currentPage===1} onClick={() => setCurrentPage(p=>p-1)}><ChevronLeft size={14} /></button>
                  {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                    <button key={p} className={`po-pagination__btn ${currentPage===p?'po-pagination__btn--active':''}`} onClick={()=>setCurrentPage(p)}>{p}</button>
                  ))}
                  <button className="po-pagination__btn" disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)}><ChevronRight size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="po-cards">
            {paginated.map(po => (
              <div key={po.id} className="po-card" onClick={() => setDetailPO(po)}>
                <div className="po-card__top">
                  <div className="po-card__header-left">
                    <span className="po-card__po-number">{po.poNumber}</span>
                    <span className="po-card__rfq">{po.rfqNumber}</span>
                  </div>
                  <span className={`po-badge po-badge--${po.status}`}>{STATUS_ICONS[po.status]} {STATUS_LABELS[po.status]}</span>
                </div>
                <div className="po-card__vendor-row">
                  <div className={`po-card__avatar po-table__avatar--${po.avatarMod}`}>{po.vendorInitials}</div>
                  <div><div className="po-card__vendor-name">{po.vendorName}</div>
                  <div className="po-card__vendor-meta">{po.department} · {po.createdBy}</div></div>
                </div>
                <div className="po-card__details">
                  <div className="po-card__detail"><span className="po-card__detail-label">Amount</span><span className="po-card__detail-value">{po.totalAmount}</span></div>
                  <div className="po-card__detail"><span className="po-card__detail-label">Items</span><span className="po-card__detail-value">{po.itemCount}</span></div>
                  <div className="po-card__detail"><span className="po-card__detail-label">Delivery</span><span className="po-card__detail-value">{formatDate(po.expectedDelivery)}</span></div>
                </div>
                <div className="po-card__footer">
                  <span className={`po-priority po-priority--${po.priority.toLowerCase()}`}>{po.priority === 'HIGH' && <AlertTriangle size={11} />} {po.priority}</span>
                  <span className="po-card__created">{formatDate(po.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="po-table-card"><div className="po-empty">
          <div className="po-empty__icon"><ShoppingCart size={48} /></div>
          <div className="po-empty__title">No purchase orders found</div>
          <div className="po-empty__desc">{search ? 'Try adjusting your search.' : 'Create your first purchase order to get started.'}</div>
        </div></div>
      )}

      {/* Detail Modal */}
      {detailPO && (
        <div className="po-modal-backdrop" onClick={() => setDetailPO(null)}>
          <div className="po-modal" onClick={e => e.stopPropagation()}>
            <div className="po-modal__header">
              <div className="po-modal__title"><Eye size={20} /><span>Order Details — {detailPO.poNumber}</span></div>
              <button className="po-modal__close" onClick={() => setDetailPO(null)}><X size={18} /></button>
            </div>
            <div className="po-modal__body">
              <div className="po-modal__status-bar">
                <span className={`po-badge po-badge--${detailPO.status}`}>{STATUS_ICONS[detailPO.status]} {STATUS_LABELS[detailPO.status]}</span>
                <span className={`po-priority po-priority--${detailPO.priority.toLowerCase()}`}>{detailPO.priority} Priority</span>
              </div>
              <div className="po-modal__grid">
                {[
                  { l: 'PO Number', v: detailPO.poNumber }, { l: 'RFQ Reference', v: detailPO.rfqNumber },
                  { l: 'Vendor', v: detailPO.vendorName }, { l: 'Total Amount', v: detailPO.totalAmount },
                  { l: 'Items', v: String(detailPO.itemCount) }, { l: 'Department', v: detailPO.department },
                  { l: 'Created By', v: detailPO.createdBy }, { l: 'Created', v: formatDate(detailPO.createdAt) },
                  { l: 'Expected Delivery', v: formatDate(detailPO.expectedDelivery) },
                ].map(i => (
                  <div key={i.l} className="po-modal__grid-item">
                    <span className="po-modal__grid-label">{i.l}</span>
                    <span className="po-modal__grid-value">{i.v}</span>
                  </div>
                ))}
              </div>
              {/* Timeline */}
              <div className="po-modal__timeline">
                <span className="po-modal__timeline-title">Order Timeline</span>
                <div className="po-modal__timeline-steps">
                  {(['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'DISPATCHED', 'DELIVERED'] as POStatus[]).map((step, idx) => {
                    const statusOrder = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'DISPATCHED', 'DELIVERED'];
                    const currentIdx = detailPO.status === 'CANCELLED' ? -1 : statusOrder.indexOf(detailPO.status);
                    const stepIdx = statusOrder.indexOf(step);
                    const isDone = stepIdx <= currentIdx;
                    const isCurrent = stepIdx === currentIdx;
                    return (
                      <div key={step} className="po-modal__timeline-step">
                        <div className={`po-modal__timeline-dot ${isDone ? 'po-modal__timeline-dot--done' : ''} ${isCurrent ? 'po-modal__timeline-dot--current' : ''}`}>
                          {isDone ? <CheckCircle2 size={14} /> : <span>{idx + 1}</span>}
                        </div>
                        {idx < 4 && <div className={`po-modal__timeline-line ${isDone && !isCurrent ? 'po-modal__timeline-line--done' : ''}`} />}
                        <span className={`po-modal__timeline-label ${isDone ? 'po-modal__timeline-label--done' : ''}`}>{STATUS_LABELS[step]}</span>
                      </div>
                    );
                  })}
                </div>
                {detailPO.status === 'CANCELLED' && (
                  <div className="po-modal__cancelled-notice"><XCircle size={14} /> This order has been cancelled.</div>
                )}
              </div>
            </div>
            <div className="po-modal__footer">
              <button className="po-modal__btn po-modal__btn--secondary" onClick={() => setDetailPO(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
