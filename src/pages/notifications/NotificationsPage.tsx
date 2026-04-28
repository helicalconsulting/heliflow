import { useState, useMemo, useCallback } from 'react';
import {
  Bell, BellOff, Search, CheckCheck, Trash2, X,
  ShoppingCart, FileText, CheckSquare, AlertTriangle, Clock,
  Users, Shield, ChevronLeft, ChevronRight, MailOpen, Mail,
} from 'lucide-react';
import './NotificationsPage.css';

type NotiType = 'APPROVAL' | 'ORDER' | 'RFQ' | 'SYSTEM' | 'VENDOR' | 'ALERT';

interface MockNotification {
  id: number; type: NotiType; title: string; message: string; isRead: boolean;
  linkedRef: string; createdAt: string; from: string;
}

const TYPE_ICONS: Record<NotiType, React.ReactNode> = {
  APPROVAL: <CheckSquare size={16} />, ORDER: <ShoppingCart size={16} />, RFQ: <FileText size={16} />,
  SYSTEM: <Shield size={16} />, VENDOR: <Users size={16} />, ALERT: <AlertTriangle size={16} />,
};
const TYPE_CLS: Record<NotiType, string> = {
  APPROVAL: 'approval', ORDER: 'order', RFQ: 'rfq', SYSTEM: 'system', VENDOR: 'vendor', ALERT: 'alert',
};
const FILTERS: ('ALL' | 'UNREAD' | 'READ')[] = ['ALL', 'UNREAD', 'READ'];

const MOCK_NOTIS: MockNotification[] = [
  { id: 1, type: 'APPROVAL', title: 'Approval Required', message: 'PO-2024-0042 requires your approval. Server Room Equipment worth ₹17,85,000 submitted by Rahul Sharma.', isRead: false, linkedRef: 'PO-2024-0042', createdAt: '2024-04-26T14:30:00', from: 'System' },
  { id: 2, type: 'ORDER', title: 'Order Dispatched', message: 'PO-2024-0040 has been dispatched by SafeGuard Corp. Expected delivery: 02 May 2024.', isRead: false, linkedRef: 'PO-2024-0040', createdAt: '2024-04-26T11:15:00', from: 'SafeGuard Corp.' },
  { id: 3, type: 'RFQ', title: 'New Quotation Received', message: 'ElectroPower India submitted a quotation for RFQ-2024-021 — Industrial Safety Equipment.', isRead: false, linkedRef: 'RFQ-2024-021', createdAt: '2024-04-26T09:00:00', from: 'ElectroPower India' },
  { id: 4, type: 'ALERT', title: 'Delivery Overdue', message: 'PO-2024-0035 from WiringHub Pvt. Ltd. is 2 days past expected delivery date. Please follow up.', isRead: false, linkedRef: 'PO-2024-0035', createdAt: '2024-04-25T16:45:00', from: 'System' },
  { id: 5, type: 'SYSTEM', title: 'Role Updated', message: 'Your role permissions have been updated by the Administrator. You now have Finance Approver access.', isRead: true, linkedRef: '-', createdAt: '2024-04-25T14:20:00', from: 'Admin' },
  { id: 6, type: 'VENDOR', title: 'Vendor Registration', message: 'LabTech Solutions has completed vendor registration and is pending approval.', isRead: true, linkedRef: 'VND-008', createdAt: '2024-04-25T10:00:00', from: 'LabTech Solutions' },
  { id: 7, type: 'APPROVAL', title: 'Approval Completed', message: 'RFQ-2024-020 has been approved at all levels. Office Furniture Procurement can proceed.', isRead: true, linkedRef: 'RFQ-2024-020', createdAt: '2024-04-24T15:30:00', from: 'System' },
  { id: 8, type: 'ORDER', title: 'Order Delivered', message: 'PO-2024-0037 — PPE Kits for Workshop has been delivered and receipt confirmed.', isRead: true, linkedRef: 'PO-2024-0037', createdAt: '2024-04-23T09:15:00', from: 'PPE Direct' },
  { id: 9, type: 'RFQ', title: 'RFQ Deadline Approaching', message: 'RFQ-2024-018 closes in 24 hours. 2 of 4 vendors have responded so far.', isRead: true, linkedRef: 'RFQ-2024-018', createdAt: '2024-04-22T08:00:00', from: 'System' },
  { id: 10, type: 'SYSTEM', title: 'Scheduled Maintenance', message: 'System maintenance scheduled for 28 Apr 2024, 02:00-04:00 IST. Please save your work.', isRead: true, linkedRef: '-', createdAt: '2024-04-21T12:00:00', from: 'System' },
  { id: 11, type: 'ALERT', title: 'Budget Threshold Reached', message: 'Q2 procurement budget utilization has reached 85%. Review remaining allocations.', isRead: false, linkedRef: '-', createdAt: '2024-04-26T08:00:00', from: 'System' },
  { id: 12, type: 'VENDOR', title: 'Vendor Compliance Expiring', message: 'ISO 9001 certificate for DigiParts Ltd. expires in 15 days. Request renewal.', isRead: false, linkedRef: 'VND-005', createdAt: '2024-04-26T07:00:00', from: 'System' },
];

export default function NotificationsPage() {
  const [notis, setNotis] = useState(MOCK_NOTIS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [detail, setDetail] = useState<MockNotification | null>(null);
  const perPage = 8;

  const summary = useMemo(() => ({
    total: notis.length, unread: notis.filter(n => !n.isRead).length, read: notis.filter(n => n.isRead).length,
  }), [notis]);

  const filtered = useMemo(() => {
    let list = notis;
    if (filter === 'UNREAD') list = list.filter(n => !n.isRead);
    if (filter === 'READ') list = list.filter(n => n.isRead);
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(n => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q) || n.linkedRef.toLowerCase().includes(q)); }
    return list;
  }, [notis, filter, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const markRead = useCallback((id: number) => { setNotis(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n)); }, []);
  const markAllRead = useCallback(() => { setNotis(prev => prev.map(n => ({ ...n, isRead: true }))); }, []);
  const deleteNoti = useCallback((id: number) => { setNotis(prev => prev.filter(n => n.id !== id)); }, []);

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const formatDateTime = (d: string) => { const date = new Date(d); return `${date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`; };

  return (
    <div className="noti-page">
      <div className="noti-page__header">
        <div className="noti-page__header-left"><h1>Notifications</h1><p>Stay updated with approvals, orders, and system alerts</p></div>
        {summary.unread > 0 && (
          <button className="noti-page__mark-btn" onClick={markAllRead}><CheckCheck size={16} /> Mark All Read</button>
        )}
      </div>

      <div className="noti-summary">
        {[
          { icon: <Bell size={22} />, val: summary.total, label: 'Total', cls: 'total' },
          { icon: <Mail size={22} />, val: summary.unread, label: 'Unread', cls: 'unread' },
          { icon: <MailOpen size={22} />, val: summary.read, label: 'Read', cls: 'read' },
        ].map(c => (
          <div key={c.cls} className="noti-summary-card">
            <div className={`noti-summary-card__icon noti-summary-card__icon--${c.cls}`}>{c.icon}</div>
            <div className="noti-summary-card__info"><span className="noti-summary-card__value">{c.val}</span><span className="noti-summary-card__label">{c.label}</span></div>
          </div>
        ))}
      </div>

      <div className="noti-toolbar">
        <div className="noti-pills">
          {FILTERS.map(f => (
            <button key={f} className={`noti-pill ${filter === f ? 'noti-pill--active' : ''}`}
              onClick={() => { setFilter(f); setCurrentPage(1); }}>
              {f === 'ALL' ? 'All' : f === 'UNREAD' ? 'Unread' : 'Read'}
              <span className="noti-pill__count">{f === 'ALL' ? summary.total : f === 'UNREAD' ? summary.unread : summary.read}</span>
            </button>
          ))}
        </div>
        <div className="noti-toolbar__search">
          <Search size={16} className="noti-toolbar__search-icon" />
          <input type="text" placeholder="Search notifications..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
        </div>
      </div>

      <div className="noti-list-card">
        {paginated.length > 0 ? (
          <div className="noti-list">
            {paginated.map(n => (
              <div key={n.id} className={`noti-item ${!n.isRead ? 'noti-item--unread' : ''}`} onClick={() => { markRead(n.id); setDetail(n); }}>
                <div className={`noti-item__icon noti-item__icon--${TYPE_CLS[n.type]}`}>{TYPE_ICONS[n.type]}</div>
                <div className="noti-item__content">
                  <div className="noti-item__top">
                    <span className="noti-item__title">{n.title}</span>
                    <span className="noti-item__time"><Clock size={11} /> {timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="noti-item__message">{n.message}</p>
                  <div className="noti-item__meta">
                    {n.linkedRef !== '-' && <span className="noti-item__ref">{n.linkedRef}</span>}
                    <span className="noti-item__from">from {n.from}</span>
                  </div>
                </div>
                <div className="noti-item__actions" onClick={e => e.stopPropagation()}>
                  {!n.isRead && <button className="noti-item__action-btn" title="Mark read" onClick={() => markRead(n.id)}><CheckCheck size={14} /></button>}
                  <button className="noti-item__action-btn noti-item__action-btn--danger" title="Delete" onClick={() => deleteNoti(n.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="noti-empty"><BellOff size={48} /><div className="noti-empty__title">No notifications</div><div className="noti-empty__desc">{search ? 'Try adjusting your search.' : 'You\'re all caught up!'}</div></div>
        )}
        {filtered.length > perPage && (
          <div className="noti-pagination">
            <span className="noti-pagination__info">Showing {(currentPage-1)*perPage+1}–{Math.min(currentPage*perPage, filtered.length)} of {filtered.length}</span>
            <div className="noti-pagination__btns">
              <button className="noti-pagination__btn" disabled={currentPage===1} onClick={() => setCurrentPage(p=>p-1)}><ChevronLeft size={14} /></button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(<button key={p} className={`noti-pagination__btn ${currentPage===p?'noti-pagination__btn--active':''}`} onClick={()=>setCurrentPage(p)}>{p}</button>))}
              <button className="noti-pagination__btn" disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)}><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {detail && (
        <div className="noti-modal-backdrop" onClick={() => setDetail(null)}>
          <div className="noti-modal" onClick={e => e.stopPropagation()}>
            <div className="noti-modal__header"><span className="noti-modal__title"><Bell size={20} /> Notification</span><button className="noti-modal__close" onClick={() => setDetail(null)}><X size={18} /></button></div>
            <div className="noti-modal__body">
              <div className="noti-modal__type-row"><div className={`noti-item__icon noti-item__icon--${TYPE_CLS[detail.type]}`}>{TYPE_ICONS[detail.type]}</div><span className="noti-modal__type-label">{detail.type}</span></div>
              <div className="noti-modal__detail-title">{detail.title}</div>
              <p className="noti-modal__detail-message">{detail.message}</p>
              <div className="noti-modal__detail-grid">
                {[{ l: 'Reference', v: detail.linkedRef !== '-' ? detail.linkedRef : '—' }, { l: 'From', v: detail.from }, { l: 'Time', v: formatDateTime(detail.createdAt) }].map(i => (
                  <div key={i.l} className="noti-modal__detail-item"><span className="noti-modal__detail-label">{i.l}</span><span className="noti-modal__detail-value">{i.v}</span></div>
                ))}
              </div>
            </div>
            <div className="noti-modal__footer"><button className="noti-modal__btn" onClick={() => setDetail(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
