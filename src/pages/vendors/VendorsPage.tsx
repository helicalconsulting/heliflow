import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  Star,
  Eye,
  Edit3,
  Trash2,
  X,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Filter,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';
import './VendorsPage.css';

// ─── Types ──────────────────────────────────────────────────

interface MockVendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  category: string;
  location: string;
  website: string;
  isActive: boolean;
  initials: string;
  avatarMod: string;
  avgQuality: number;
  avgDelivery: number;
  avgPriceScore: number;
  overallScore: number;
  totalOrders: number;
  createdAt: string;
}

// ─── Mock Data ──────────────────────────────────────────────

const MOCK_VENDORS: MockVendor[] = [
  {
    id: 1, name: 'TechSupply Co.', email: 'sales@techsupply.in', phone: '+91 98765 11100',
    contactPerson: 'Arun Mehta', category: 'IT & Electronics', location: 'Mumbai, MH',
    website: 'techsupply.in', isActive: true, initials: 'TS', avatarMod: '1',
    avgQuality: 92, avgDelivery: 88, avgPriceScore: 85, overallScore: 92, totalOrders: 34,
    createdAt: '2023-06-15',
  },
  {
    id: 2, name: 'ElectroPower India', email: 'bids@electropower.in', phone: '+91 98765 22200',
    contactPerson: 'Meena Sharma', category: 'Electrical', location: 'Pune, MH',
    website: 'electropower.in', isActive: true, initials: 'EP', avatarMod: '3',
    avgQuality: 88, avgDelivery: 90, avgPriceScore: 78, overallScore: 88, totalOrders: 28,
    createdAt: '2023-07-20',
  },
  {
    id: 3, name: 'SafeGuard Corp.', email: 'orders@safeguard.in', phone: '+91 98765 33300',
    contactPerson: 'Ravi Tiwari', category: 'Safety Equipment', location: 'Delhi, DL',
    website: 'safeguard.in', isActive: true, initials: 'SC', avatarMod: '1',
    avgQuality: 95, avgDelivery: 92, avgPriceScore: 90, overallScore: 95, totalOrders: 41,
    createdAt: '2023-03-10',
  },
  {
    id: 4, name: 'PackRight India', email: 'bid@packright.in', phone: '+91 98765 44400',
    contactPerson: 'Sunita Devi', category: 'Packaging', location: 'Jaipur, RJ',
    website: 'packright.in', isActive: true, initials: 'PR', avatarMod: '4',
    avgQuality: 80, avgDelivery: 85, avgPriceScore: 92, overallScore: 85, totalOrders: 19,
    createdAt: '2023-09-01',
  },
  {
    id: 5, name: 'DigiParts Ltd.', email: 'info@digiparts.co.in', phone: '+91 98765 55500',
    contactPerson: 'Karan Singh', category: 'IT & Electronics', location: 'Bangalore, KA',
    website: 'digiparts.co.in', isActive: false, initials: 'DP', avatarMod: '2',
    avgQuality: 72, avgDelivery: 68, avgPriceScore: 80, overallScore: 73, totalOrders: 12,
    createdAt: '2023-11-05',
  },
  {
    id: 6, name: 'WiringHub Pvt. Ltd.', email: 'quotes@wiringhub.com', phone: '+91 98765 66600',
    contactPerson: 'Priya Nair', category: 'Electrical', location: 'Chennai, TN',
    website: 'wiringhub.com', isActive: true, initials: 'WH', avatarMod: '6',
    avgQuality: 82, avgDelivery: 75, avgPriceScore: 88, overallScore: 81, totalOrders: 22,
    createdAt: '2023-08-18',
  },
  {
    id: 7, name: 'SwitchGear Pro', email: 'team@switchgearpro.in', phone: '+91 98765 77700',
    contactPerson: 'Amit Patel', category: 'Electrical', location: 'Ahmedabad, GJ',
    website: 'switchgearpro.in', isActive: true, initials: 'SG', avatarMod: '5',
    avgQuality: 78, avgDelivery: 82, avgPriceScore: 75, overallScore: 78, totalOrders: 15,
    createdAt: '2024-01-10',
  },
  {
    id: 8, name: 'LabTech Solutions', email: 'sales@labtech.co.in', phone: '+91 98765 88800',
    contactPerson: 'Deepa Joshi', category: 'Lab Equipment', location: 'Hyderabad, TS',
    website: 'labtech.co.in', isActive: true, initials: 'LT', avatarMod: '4',
    avgQuality: 90, avgDelivery: 86, avgPriceScore: 82, overallScore: 87, totalOrders: 26,
    createdAt: '2023-05-22',
  },
  {
    id: 9, name: 'PPE Direct', email: 'sales@ppedirect.in', phone: '+91 98765 99900',
    contactPerson: 'Rajesh Kumar', category: 'Safety Equipment', location: 'Lucknow, UP',
    website: 'ppedirect.in', isActive: true, initials: 'PD', avatarMod: '2',
    avgQuality: 84, avgDelivery: 80, avgPriceScore: 90, overallScore: 84, totalOrders: 18,
    createdAt: '2024-02-01',
  },
  {
    id: 10, name: 'InstruPrecision', email: 'info@instruprecision.in', phone: '+91 98765 10100',
    contactPerson: 'Vikram Rao', category: 'Lab Equipment', location: 'Kolkata, WB',
    website: 'instruprecision.in', isActive: false, initials: 'IP', avatarMod: '5',
    avgQuality: 65, avgDelivery: 60, avgPriceScore: 70, overallScore: 65, totalOrders: 8,
    createdAt: '2024-03-12',
  },
];

const CATEGORIES = ['IT & Electronics', 'Electrical', 'Safety Equipment', 'Packaging', 'Lab Equipment'];

function getScoreClass(s: number) { return s >= 85 ? 'high' : s >= 70 ? 'mid' : 'low'; }

// ─── Component ──────────────────────────────────────────────

export default function VendorsPage() {
  const [search, setSearch] = useState('');
  const [vendors, setVendors] = useState(MOCK_VENDORS);
  const [view, setView] = useState<'table' | 'card'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [detailVendor, setDetailVendor] = useState<MockVendor | null>(null);
  const perPage = 8;

  // Form state
  const [fName, setFName] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fPhone, setFPhone] = useState('');
  const [fContact, setFContact] = useState('');
  const [fCategory, setFCategory] = useState('');
  const [fLocation, setFLocation] = useState('');
  const [fWebsite, setFWebsite] = useState('');

  // Summary
  const summary = useMemo(() => ({
    total: vendors.length,
    active: vendors.filter((v) => v.isActive).length,
    inactive: vendors.filter((v) => !v.isActive).length,
    topRated: vendors.filter((v) => v.overallScore >= 85).length,
  }), [vendors]);

  // Filter
  const filtered = useMemo(() => {
    if (!search.trim()) return vendors;
    const q = search.toLowerCase();
    return vendors.filter(
      (v) => v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) || v.contactPerson.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q)
    );
  }, [vendors, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleActive = useCallback((id: number) => {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v)));
  }, []);

  const openAddModal = useCallback(() => {
    setFName(''); setFEmail(''); setFPhone(''); setFContact('');
    setFCategory(''); setFLocation(''); setFWebsite('');
    setShowModal(true);
  }, []);

  const handleCreate = useCallback(() => {
    if (!fName.trim() || !fEmail.trim()) return;
    const initials = fName.trim().split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    const newV: MockVendor = {
      id: Date.now(), name: fName.trim(), email: fEmail.trim(),
      phone: fPhone.trim() || '-', contactPerson: fContact.trim() || '-',
      category: fCategory || 'General', location: fLocation.trim() || '-',
      website: fWebsite.trim() || '-', isActive: true,
      initials, avatarMod: String((vendors.length % 6) + 1),
      avgQuality: 0, avgDelivery: 0, avgPriceScore: 0, overallScore: 0,
      totalOrders: 0, createdAt: new Date().toISOString().split('T')[0],
    };
    setVendors((prev) => [...prev, newV]);
    setShowModal(false);
  }, [fName, fEmail, fPhone, fContact, fCategory, fLocation, fWebsite, vendors.length]);

  const canCreate = fName.trim() && fEmail.trim();

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="vendors-page">
      {/* Header */}
      <div className="vendors-page__header">
        <div className="vendors-page__header-left">
          <h1>Vendors</h1>
          <p>Manage vendor directory, track performance, and onboard new suppliers</p>
        </div>
        <button className="vendors-page__add-btn" onClick={openAddModal}>
          <Plus size={18} /> Add Vendor
        </button>
      </div>

      {/* Summary */}
      <div className="vendors-summary">
        {[
          { icon: <Users size={22} />, val: summary.total, label: 'Total Vendors', cls: 'total' },
          { icon: <UserCheck size={22} />, val: summary.active, label: 'Active', cls: 'active' },
          { icon: <UserX size={22} />, val: summary.inactive, label: 'Inactive', cls: 'inactive' },
          { icon: <Award size={22} />, val: summary.topRated, label: 'Top Rated', cls: 'top' },
        ].map((c) => (
          <div key={c.cls} className="vendors-summary-card">
            <div className={`vendors-summary-card__icon vendors-summary-card__icon--${c.cls}`}>{c.icon}</div>
            <div className="vendors-summary-card__info">
              <span className="vendors-summary-card__value">{c.val}</span>
              <span className="vendors-summary-card__label">{c.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="vendors-toolbar">
        <div className="vendors-toolbar__search">
          <Search size={16} className="vendors-toolbar__search-icon" />
          <input type="text" placeholder="Search by name, email, category, contact, or location..."
            value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
        </div>
        <div className="vendors-toolbar__right">
          <button className="vendors-toolbar__filter"><Filter size={14} /> Category</button>
          <div className="vendors-toolbar__view-toggle">
            <button className={`vendors-toolbar__view-btn ${view === 'table' ? 'vendors-toolbar__view-btn--active' : ''}`}
              onClick={() => setView('table')} title="Table"><LayoutList size={16} /></button>
            <button className={`vendors-toolbar__view-btn ${view === 'card' ? 'vendors-toolbar__view-btn--active' : ''}`}
              onClick={() => setView('card')} title="Cards"><LayoutGrid size={16} /></button>
          </div>
        </div>
      </div>

      {/* Content */}
      {paginated.length > 0 ? (
        view === 'table' ? (
          <div className="vendors-table-card">
            <div className="vendors-table-wrap">
              <table className="vendors-table">
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th><Star size={11} /> Score</th>
                    <th>Orders</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <div className="vendors-table__vendor">
                          <div className={`vendors-table__avatar vendors-table__avatar--${v.avatarMod}`}>{v.initials}</div>
                          <div className="vendors-table__vendor-info">
                            <span className="vendors-table__name">{v.name}</span>
                            <span className="vendors-table__email">{v.email}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="vendors-cat-badge">{v.category}</span></td>
                      <td className="vendors-table__loc"><MapPin size={12} /> {v.location}</td>
                      <td>
                        <div className="vendors-score">
                          <div className="vendors-score__bar">
                            <div className={`vendors-score__fill vendors-score__fill--${getScoreClass(v.overallScore)}`}
                              style={{ width: `${v.overallScore}%` }} />
                          </div>
                          <span className="vendors-score__value">{v.overallScore}</span>
                        </div>
                      </td>
                      <td className="vendors-table__orders">{v.totalOrders}</td>
                      <td>
                        <div className="vendors-status-toggle" onClick={() => toggleActive(v.id)}>
                          <div className={`vendors-status-toggle__track ${v.isActive ? 'vendors-status-toggle__track--active' : ''}`}>
                            <div className="vendors-status-toggle__knob" />
                          </div>
                          <span className={`vendors-status-toggle__label vendors-status-toggle__label--${v.isActive ? 'active' : 'inactive'}`}>
                            {v.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="vendors-table__date">{formatDate(v.createdAt)}</td>
                      <td>
                        <div className="vendors-table__actions">
                          <button className="vendors-table__action-btn" title="View" onClick={() => setDetailVendor(v)}><Eye size={15} /></button>
                          <button className="vendors-table__action-btn" title="Edit"><Edit3 size={15} /></button>
                          <button className="vendors-table__action-btn vendors-table__action-btn--danger" title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length > perPage && (
              <div className="vendors-pagination">
                <span className="vendors-pagination__info">Showing {(currentPage-1)*perPage+1}–{Math.min(currentPage*perPage, filtered.length)} of {filtered.length}</span>
                <div className="vendors-pagination__btns">
                  <button className="vendors-pagination__btn" disabled={currentPage===1} onClick={() => setCurrentPage(p=>p-1)}><ChevronLeft size={14} /></button>
                  {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                    <button key={p} className={`vendors-pagination__btn ${currentPage===p?'vendors-pagination__btn--active':''}`} onClick={()=>setCurrentPage(p)}>{p}</button>
                  ))}
                  <button className="vendors-pagination__btn" disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)}><ChevronRight size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Card View */
          <div className="vendors-cards">
            {paginated.map((v) => (
              <div key={v.id} className="vendors-card" onClick={() => setDetailVendor(v)}>
                <div className="vendors-card__top">
                  <div className={`vendors-card__avatar vendors-table__avatar--${v.avatarMod}`}>{v.initials}</div>
                  <div className="vendors-card__name-block">
                    <span className="vendors-card__name">{v.name}</span>
                    <span className="vendors-card__cat">{v.category}</span>
                  </div>
                  <span className={`vendors-card__status-dot ${v.isActive ? 'vendors-card__status-dot--active' : ''}`} />
                </div>
                <div className="vendors-card__details">
                  <div className="vendors-card__detail"><Mail size={12} /><span>{v.email}</span></div>
                  <div className="vendors-card__detail"><MapPin size={12} /><span>{v.location}</span></div>
                </div>
                <div className="vendors-card__footer">
                  <div className="vendors-card__score">
                    <div className={`vendors-card__score-ring vendors-card__score-ring--${getScoreClass(v.overallScore)}`}>{v.overallScore}</div>
                    <div><div className="vendors-card__score-label">{getScoreClass(v.overallScore)==='high'?'Excellent':getScoreClass(v.overallScore)==='mid'?'Good':'Fair'}</div>
                    <div className="vendors-card__score-sub">Overall Score</div></div>
                  </div>
                  <div className="vendors-card__orders">{v.totalOrders} orders</div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="vendors-table-card">
          <div className="vendors-empty">
            <div className="vendors-empty__icon"><Users size={48} /></div>
            <div className="vendors-empty__title">No vendors found</div>
            <div className="vendors-empty__desc">{search ? 'Try adjusting your search.' : 'Add your first vendor to get started.'}</div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showModal && (
        <div className="vendors-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="vendors-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vendors-modal__header">
              <span className="vendors-modal__title"><Building2 size={20} /> Add New Vendor</span>
              <button className="vendors-modal__close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="vendors-modal__body">
              <div className="vendors-modal__field">
                <label className="vendors-modal__label">Company Name <span>*</span></label>
                <input className="vendors-modal__input" placeholder="e.g. TechSupply Co." value={fName} onChange={e=>setFName(e.target.value)} />
              </div>
              <div className="vendors-modal__row">
                <div className="vendors-modal__field">
                  <label className="vendors-modal__label"><Mail size={13} style={{marginRight:4}} /> Email <span>*</span></label>
                  <input className="vendors-modal__input" type="email" placeholder="vendor@company.in" value={fEmail} onChange={e=>setFEmail(e.target.value)} />
                </div>
                <div className="vendors-modal__field">
                  <label className="vendors-modal__label"><Phone size={13} style={{marginRight:4}} /> Phone</label>
                  <input className="vendors-modal__input" type="tel" placeholder="+91 98765 XXXXX" value={fPhone} onChange={e=>setFPhone(e.target.value)} />
                </div>
              </div>
              <div className="vendors-modal__row">
                <div className="vendors-modal__field">
                  <label className="vendors-modal__label">Contact Person</label>
                  <input className="vendors-modal__input" placeholder="e.g. Arun Mehta" value={fContact} onChange={e=>setFContact(e.target.value)} />
                </div>
                <div className="vendors-modal__field">
                  <label className="vendors-modal__label">Category</label>
                  <select className="vendors-modal__select" value={fCategory} onChange={e=>setFCategory(e.target.value)}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="vendors-modal__row">
                <div className="vendors-modal__field">
                  <label className="vendors-modal__label"><MapPin size={13} style={{marginRight:4}} /> Location</label>
                  <input className="vendors-modal__input" placeholder="e.g. Mumbai, MH" value={fLocation} onChange={e=>setFLocation(e.target.value)} />
                </div>
                <div className="vendors-modal__field">
                  <label className="vendors-modal__label"><Globe size={13} style={{marginRight:4}} /> Website</label>
                  <input className="vendors-modal__input" placeholder="e.g. company.in" value={fWebsite} onChange={e=>setFWebsite(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="vendors-modal__footer">
              <button className="vendors-modal__btn vendors-modal__btn--secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="vendors-modal__btn vendors-modal__btn--primary" disabled={!canCreate} onClick={handleCreate}>
                <Building2 size={16} /> Add Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailVendor && (
        <div className="vendors-modal-backdrop" onClick={() => setDetailVendor(null)}>
          <div className="vendors-modal vendors-modal--detail" onClick={(e) => e.stopPropagation()}>
            <div className="vendors-modal__header">
              <span className="vendors-modal__title"><Eye size={20} /> Vendor Details</span>
              <button className="vendors-modal__close" onClick={() => setDetailVendor(null)}><X size={18} /></button>
            </div>
            <div className="vendors-modal__body">
              <div className="vendors-detail-top">
                <div className={`vendors-detail-avatar vendors-table__avatar--${detailVendor.avatarMod}`}>{detailVendor.initials}</div>
                <div>
                  <div className="vendors-detail-name">{detailVendor.name}</div>
                  <div className="vendors-detail-cat">{detailVendor.category} · {detailVendor.location}</div>
                </div>
              </div>
              <div className="vendors-detail-grid">
                {[
                  { l: 'Email', v: detailVendor.email }, { l: 'Phone', v: detailVendor.phone },
                  { l: 'Contact', v: detailVendor.contactPerson }, { l: 'Website', v: detailVendor.website },
                  { l: 'Status', v: detailVendor.isActive ? 'Active' : 'Inactive' },
                  { l: 'Total Orders', v: String(detailVendor.totalOrders) },
                  { l: 'Joined', v: formatDate(detailVendor.createdAt) },
                ].map(i => (
                  <div key={i.l} className="vendors-detail-grid__item">
                    <span className="vendors-detail-grid__label">{i.l}</span>
                    <span className="vendors-detail-grid__value">{i.v}</span>
                  </div>
                ))}
              </div>
              <div className="vendors-detail-perf">
                <span className="vendors-detail-perf__title"><TrendingUp size={14} /> Performance Scores</span>
                <div className="vendors-detail-perf__bars">
                  {[
                    { l: 'Quality', v: detailVendor.avgQuality },
                    { l: 'Delivery', v: detailVendor.avgDelivery },
                    { l: 'Pricing', v: detailVendor.avgPriceScore },
                    { l: 'Overall', v: detailVendor.overallScore },
                  ].map(b => (
                    <div key={b.l} className="vendors-detail-perf__row">
                      <span className="vendors-detail-perf__label">{b.l}</span>
                      <div className="vendors-detail-perf__bar">
                        <div className={`vendors-detail-perf__fill vendors-detail-perf__fill--${getScoreClass(b.v)}`} style={{width:`${b.v}%`}} />
                      </div>
                      <span className={`vendors-detail-perf__val vendors-detail-perf__val--${getScoreClass(b.v)}`}>{b.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="vendors-modal__footer">
              <button className="vendors-modal__btn vendors-modal__btn--secondary" onClick={() => setDetailVendor(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
