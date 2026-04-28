import { useState, useMemo } from 'react';
import {
  History, Search, ChevronLeft, ChevronRight, X, Clock,
  UserCog, CheckSquare, Settings,
  LogIn, Edit3, Trash2, Plus, Download,
} from 'lucide-react';
import './AuditTrailPage.css';

type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'LOGIN' | 'EXPORT';
type AuditModule = 'RFQ' | 'Purchase Order' | 'Quotation' | 'Users' | 'Roles' | 'Vendors' | 'Approvals' | 'Auth' | 'Documents';

interface AuditEntry {
  id: number; action: AuditAction; module: AuditModule; description: string;
  performedBy: string; performedByInitials: string; avatarMod: string;
  ipAddress: string; referenceId: string; timestamp: string;
}

const ACTION_ICONS: Record<AuditAction, React.ReactNode> = {
  CREATE: <Plus size={14} />, UPDATE: <Edit3 size={14} />, DELETE: <Trash2 size={14} />,
  APPROVE: <CheckSquare size={14} />, REJECT: <X size={14} />, LOGIN: <LogIn size={14} />, EXPORT: <Download size={14} />,
};
const ACTION_CLS: Record<AuditAction, string> = {
  CREATE: 'create', UPDATE: 'update', DELETE: 'delete', APPROVE: 'approve', REJECT: 'reject', LOGIN: 'login', EXPORT: 'export',
};

const MOCK_AUDIT: AuditEntry[] = [
  { id: 1, action: 'APPROVE', module: 'Purchase Order', description: 'Approved PO-2024-0042 — Server Room Equipment (₹17,85,000)', performedBy: 'Admin User', performedByInitials: 'AU', avatarMod: '1', ipAddress: '192.168.1.101', referenceId: 'PO-2024-0042', timestamp: '2024-04-26T14:30:00' },
  { id: 2, action: 'CREATE', module: 'RFQ', description: 'Created RFQ-2024-021 — Industrial Safety Equipment with 4 vendor invitations', performedBy: 'Rahul Sharma', performedByInitials: 'RS', avatarMod: '2', ipAddress: '192.168.1.105', referenceId: 'RFQ-2024-021', timestamp: '2024-04-26T11:15:00' },
  { id: 3, action: 'UPDATE', module: 'Vendors', description: 'Updated vendor status: DigiParts Ltd. marked as Inactive', performedBy: 'Priya Patel', performedByInitials: 'PP', avatarMod: '3', ipAddress: '192.168.1.108', referenceId: 'VND-005', timestamp: '2024-04-26T09:00:00' },
  { id: 4, action: 'LOGIN', module: 'Auth', description: 'User login — successful authentication via SSO', performedBy: 'Vikram Singh', performedByInitials: 'VS', avatarMod: '6', ipAddress: '192.168.1.115', referenceId: '-', timestamp: '2024-04-26T08:30:00' },
  { id: 5, action: 'REJECT', module: 'Approvals', description: 'Rejected QT-2024-052 — Networking Switches. Reason: Pricing exceeds budget', performedBy: 'Admin User', performedByInitials: 'AU', avatarMod: '1', ipAddress: '192.168.1.101', referenceId: 'QT-2024-052', timestamp: '2024-04-25T16:45:00' },
  { id: 6, action: 'CREATE', module: 'Users', description: 'Created new user account: kavita.reddy@heliflow.in — Staff role', performedBy: 'Admin User', performedByInitials: 'AU', avatarMod: '1', ipAddress: '192.168.1.101', referenceId: 'USR-012', timestamp: '2024-04-25T14:20:00' },
  { id: 7, action: 'EXPORT', module: 'Documents', description: 'Exported Q2 Budget Forecast report as XLSX', performedBy: 'Amit Kumar', performedByInitials: 'AK', avatarMod: '4', ipAddress: '192.168.1.120', referenceId: 'DOC-008', timestamp: '2024-04-25T10:00:00' },
  { id: 8, action: 'UPDATE', module: 'Roles', description: 'Updated permissions for Finance Approver — added Purchase Order approve access', performedBy: 'Admin User', performedByInitials: 'AU', avatarMod: '1', ipAddress: '192.168.1.101', referenceId: 'ROLE-004', timestamp: '2024-04-24T15:30:00' },
  { id: 9, action: 'DELETE', module: 'Documents', description: 'Deleted expired compliance certificate — WiringHub_Old_Cert.pdf', performedBy: 'Priya Patel', performedByInitials: 'PP', avatarMod: '3', ipAddress: '192.168.1.108', referenceId: 'DOC-003', timestamp: '2024-04-24T11:00:00' },
  { id: 10, action: 'APPROVE', module: 'Approvals', description: 'Approved RFQ-2024-020 at Level 2 — Office Furniture Procurement', performedBy: 'Sneha Gupta', performedByInitials: 'SG', avatarMod: '5', ipAddress: '192.168.1.130', referenceId: 'RFQ-2024-020', timestamp: '2024-04-24T09:15:00' },
  { id: 11, action: 'CREATE', module: 'Purchase Order', description: 'Created PO-2024-0041 from approved RFQ-2024-018 — ElectroPower India', performedBy: 'Vikram Singh', performedByInitials: 'VS', avatarMod: '6', ipAddress: '192.168.1.115', referenceId: 'PO-2024-0041', timestamp: '2024-04-23T13:00:00' },
  { id: 12, action: 'LOGIN', module: 'Auth', description: 'Failed login attempt — incorrect password (3rd attempt)', performedBy: 'deepak.joshi', performedByInitials: 'DJ', avatarMod: '2', ipAddress: '203.0.113.42', referenceId: '-', timestamp: '2024-04-23T07:45:00' },
  { id: 13, action: 'UPDATE', module: 'Quotation', description: 'Updated quotation QT-2024-056 — revised pricing from LabTech Solutions', performedBy: 'Amit Kumar', performedByInitials: 'AK', avatarMod: '4', ipAddress: '192.168.1.120', referenceId: 'QT-2024-056', timestamp: '2024-04-22T16:30:00' },
  { id: 14, action: 'CREATE', module: 'Vendors', description: 'Registered new vendor: PPE Direct — Safety Equipment category', performedBy: 'Admin User', performedByInitials: 'AU', avatarMod: '1', ipAddress: '192.168.1.101', referenceId: 'VND-009', timestamp: '2024-04-22T10:20:00' },
];

const ACTION_FILTERS: ('ALL' | AuditAction)[] = ['ALL', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'LOGIN', 'EXPORT'];

export default function AuditTrailPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<'ALL' | AuditAction>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [detail, setDetail] = useState<AuditEntry | null>(null);
  const perPage = 10;

  const summary = useMemo(() => ({
    total: MOCK_AUDIT.length,
    today: MOCK_AUDIT.filter(a => a.timestamp.startsWith('2024-04-26')).length,
    actions: new Set(MOCK_AUDIT.map(a => a.action)).size,
    users: new Set(MOCK_AUDIT.map(a => a.performedBy)).size,
  }), []);

  const filterCounts = useMemo(() => {
    const c: Record<string, number> = { ALL: MOCK_AUDIT.length };
    for (const a of MOCK_AUDIT) c[a.action] = (c[a.action] || 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = MOCK_AUDIT as AuditEntry[];
    if (actionFilter !== 'ALL') list = list.filter(a => a.action === actionFilter);
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(a => a.description.toLowerCase().includes(q) || a.performedBy.toLowerCase().includes(q) || a.module.toLowerCase().includes(q) || a.referenceId.toLowerCase().includes(q)); }
    return list;
  }, [actionFilter, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const formatDateTime = (d: string) => { const date = new Date(d); return `${date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`; };
  const timeAgo = (d: string) => { const diff = Date.now() - new Date(d).getTime(); const mins = Math.floor(diff / 60000); if (mins < 60) return `${mins}m ago`; const hrs = Math.floor(mins / 60); if (hrs < 24) return `${hrs}h ago`; return `${Math.floor(hrs / 24)}d ago`; };

  return (
    <div className="audit-page">
      <div className="audit-page__header">
        <div className="audit-page__header-left"><h1>Audit Trail</h1><p>Complete activity log of all system actions and changes</p></div>
        <button className="audit-page__export-btn"><Download size={16} /> Export Log</button>
      </div>

      <div className="audit-summary">
        {[
          { icon: <History size={22} />, val: summary.total, label: 'Total Entries', cls: 'total' },
          { icon: <Clock size={22} />, val: summary.today, label: 'Today', cls: 'today' },
          { icon: <Settings size={22} />, val: summary.actions, label: 'Action Types', cls: 'actions' },
          { icon: <UserCog size={22} />, val: summary.users, label: 'Active Users', cls: 'users' },
        ].map(c => (
          <div key={c.cls} className="audit-summary-card">
            <div className={`audit-summary-card__icon audit-summary-card__icon--${c.cls}`}>{c.icon}</div>
            <div className="audit-summary-card__info"><span className="audit-summary-card__value">{c.val}</span><span className="audit-summary-card__label">{c.label}</span></div>
          </div>
        ))}
      </div>

      <div className="audit-pills">
        {ACTION_FILTERS.map(f => (
          <button key={f} className={`audit-pill ${actionFilter === f ? 'audit-pill--active' : ''}`}
            onClick={() => { setActionFilter(f); setCurrentPage(1); }}>
            {f !== 'ALL' && <span className={`audit-pill__dot audit-pill__dot--${ACTION_CLS[f]}`} />}
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            <span className="audit-pill__count">{filterCounts[f] || 0}</span>
          </button>
        ))}
      </div>

      <div className="audit-toolbar">
        <div className="audit-toolbar__search">
          <Search size={16} className="audit-toolbar__search-icon" />
          <input type="text" placeholder="Search by description, user, module, or reference..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
        </div>
      </div>

      <div className="audit-timeline-card">
        {paginated.length > 0 ? (
          <div className="audit-timeline">
            {paginated.map(entry => (
              <div key={entry.id} className="audit-entry" onClick={() => setDetail(entry)}>
                <div className="audit-entry__connector">
                  <div className={`audit-entry__dot audit-entry__dot--${ACTION_CLS[entry.action]}`}>{ACTION_ICONS[entry.action]}</div>
                  <div className="audit-entry__line" />
                </div>
                <div className="audit-entry__content">
                  <div className="audit-entry__top">
                    <div className="audit-entry__left">
                      <span className={`audit-entry__action audit-entry__action--${ACTION_CLS[entry.action]}`}>{entry.action}</span>
                      <span className="audit-entry__module">{entry.module}</span>
                    </div>
                    <span className="audit-entry__time"><Clock size={11} /> {timeAgo(entry.timestamp)}</span>
                  </div>
                  <p className="audit-entry__desc">{entry.description}</p>
                  <div className="audit-entry__meta">
                    <div className="audit-entry__user">
                      <div className={`audit-entry__avatar audit-entry__avatar--${entry.avatarMod}`}>{entry.performedByInitials}</div>
                      <span>{entry.performedBy}</span>
                    </div>
                    {entry.referenceId !== '-' && <span className="audit-entry__ref">{entry.referenceId}</span>}
                    <span className="audit-entry__ip">{entry.ipAddress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="audit-empty"><History size={48} /><div className="audit-empty__title">No entries found</div><div className="audit-empty__desc">{search ? 'Try adjusting your search.' : 'No audit trail entries yet.'}</div></div>
        )}
        {filtered.length > perPage && (
          <div className="audit-pagination">
            <span className="audit-pagination__info">Showing {(currentPage-1)*perPage+1}–{Math.min(currentPage*perPage, filtered.length)} of {filtered.length}</span>
            <div className="audit-pagination__btns">
              <button className="audit-pagination__btn" disabled={currentPage===1} onClick={() => setCurrentPage(p=>p-1)}><ChevronLeft size={14} /></button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(<button key={p} className={`audit-pagination__btn ${currentPage===p?'audit-pagination__btn--active':''}`} onClick={()=>setCurrentPage(p)}>{p}</button>))}
              <button className="audit-pagination__btn" disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)}><ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {detail && (
        <div className="audit-modal-backdrop" onClick={() => setDetail(null)}>
          <div className="audit-modal" onClick={e => e.stopPropagation()}>
            <div className="audit-modal__header"><span className="audit-modal__title"><History size={20} /> Audit Entry</span><button className="audit-modal__close" onClick={() => setDetail(null)}><X size={18} /></button></div>
            <div className="audit-modal__body">
              <div className="audit-modal__action-row">
                <span className={`audit-entry__action audit-entry__action--${ACTION_CLS[detail.action]}`}>{detail.action}</span>
                <span className="audit-modal__module-label">{detail.module}</span>
              </div>
              <p className="audit-modal__desc">{detail.description}</p>
              <div className="audit-modal__grid">
                {[
                  { l: 'Performed By', v: detail.performedBy }, { l: 'Reference', v: detail.referenceId !== '-' ? detail.referenceId : '—' },
                  { l: 'IP Address', v: detail.ipAddress }, { l: 'Timestamp', v: formatDateTime(detail.timestamp) },
                ].map(i => (
                  <div key={i.l} className="audit-modal__grid-item"><span className="audit-modal__grid-label">{i.l}</span><span className="audit-modal__grid-value">{i.v}</span></div>
                ))}
              </div>
            </div>
            <div className="audit-modal__footer"><button className="audit-modal__btn" onClick={() => setDetail(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
