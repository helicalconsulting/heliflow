import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  ClipboardList,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Eye,
  ThumbsUp,
  ThumbsDown,
  LayoutList,
  LayoutGrid,
  Filter,
  ChevronLeft,
  ChevronRight,
  GitCompareArrows,
  Crown,
  X,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  ArrowDownNarrowWide,
} from 'lucide-react';
import './QuotationsPage.css';

// ─── Mock Data ──────────────────────────────────────────────

type QuotStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'SHORTLISTED';

interface MockQuotation {
  id: number;
  rfqNumber: string;
  vendorName: string;
  vendorEmail: string;
  vendorInitials: string;
  avatarMod: string;
  totalPrice: string;
  totalPriceNum: number;
  leadTimeDays: number;
  paymentTerms: string;
  score: number;
  status: QuotStatus;
  submittedAt: string;
  itemCount: number;
}

const MOCK_QUOTATIONS: MockQuotation[] = [
  {
    id: 1, rfqNumber: 'RFQ-2024-019', vendorName: 'TechSupply Co.', vendorEmail: 'sales@techsupply.in', vendorInitials: 'TS', avatarMod: '1',
    totalPrice: '₹17,85,000', totalPriceNum: 1785000, leadTimeDays: 5, paymentTerms: 'Net 30', score: 92, status: 'ACCEPTED', submittedAt: '2024-04-24', itemCount: 12,
  },
  {
    id: 2, rfqNumber: 'RFQ-2024-019', vendorName: 'DigiParts Ltd.', vendorEmail: 'info@digiparts.co.in', vendorInitials: 'DP', avatarMod: '2',
    totalPrice: '₹19,20,000', totalPriceNum: 1920000, leadTimeDays: 7, paymentTerms: 'Net 45', score: 78, status: 'REJECTED', submittedAt: '2024-04-24', itemCount: 12,
  },
  {
    id: 3, rfqNumber: 'RFQ-2024-018', vendorName: 'ElectroPower India', vendorEmail: 'bids@electropower.in', vendorInitials: 'EP', avatarMod: '3',
    totalPrice: '₹6,90,000', totalPriceNum: 690000, leadTimeDays: 4, paymentTerms: 'Net 30', score: 88, status: 'SHORTLISTED', submittedAt: '2024-04-23', itemCount: 15,
  },
  {
    id: 4, rfqNumber: 'RFQ-2024-018', vendorName: 'WiringHub Pvt. Ltd.', vendorEmail: 'quotes@wiringhub.com', vendorInitials: 'WH', avatarMod: '4',
    totalPrice: '₹7,45,000', totalPriceNum: 745000, leadTimeDays: 6, paymentTerms: 'Net 60', score: 71, status: 'UNDER_REVIEW', submittedAt: '2024-04-22', itemCount: 15,
  },
  {
    id: 5, rfqNumber: 'RFQ-2024-018', vendorName: 'SwitchGear Pro', vendorEmail: 'team@switchgearpro.in', vendorInitials: 'SG', avatarMod: '5',
    totalPrice: '₹7,10,000', totalPriceNum: 710000, leadTimeDays: 8, paymentTerms: 'Net 30', score: 65, status: 'SUBMITTED', submittedAt: '2024-04-23', itemCount: 15,
  },
  {
    id: 6, rfqNumber: 'RFQ-2024-017', vendorName: 'SafeGuard Corp.', vendorEmail: 'orders@safeguard.in', vendorInitials: 'SC', avatarMod: '1',
    totalPrice: '₹3,60,000', totalPriceNum: 360000, leadTimeDays: 3, paymentTerms: 'Net 15', score: 95, status: 'ACCEPTED', submittedAt: '2024-04-20', itemCount: 20,
  },
  {
    id: 7, rfqNumber: 'RFQ-2024-017', vendorName: 'PPE Direct', vendorEmail: 'sales@ppedirect.in', vendorInitials: 'PD', avatarMod: '2',
    totalPrice: '₹4,10,000', totalPriceNum: 410000, leadTimeDays: 5, paymentTerms: 'Net 30', score: 82, status: 'SHORTLISTED', submittedAt: '2024-04-20', itemCount: 20,
  },
  {
    id: 8, rfqNumber: 'RFQ-2024-015', vendorName: 'PackRight India', vendorEmail: 'bid@packright.in', vendorInitials: 'PR', avatarMod: '3',
    totalPrice: '₹1,95,000', totalPriceNum: 195000, leadTimeDays: 2, paymentTerms: 'COD', score: 90, status: 'ACCEPTED', submittedAt: '2024-04-16', itemCount: 9,
  },
  {
    id: 9, rfqNumber: 'RFQ-2024-013', vendorName: 'LabTech Solutions', vendorEmail: 'sales@labtech.co.in', vendorInitials: 'LT', avatarMod: '4',
    totalPrice: '₹9,30,000', totalPriceNum: 930000, leadTimeDays: 10, paymentTerms: 'Net 45', score: 74, status: 'UNDER_REVIEW', submittedAt: '2024-04-11', itemCount: 7,
  },
  {
    id: 10, rfqNumber: 'RFQ-2024-013', vendorName: 'InstruPrecision', vendorEmail: 'info@instruprecision.in', vendorInitials: 'IP', avatarMod: '5',
    totalPrice: '₹10,20,000', totalPriceNum: 1020000, leadTimeDays: 7, paymentTerms: 'Net 30', score: 68, status: 'SUBMITTED', submittedAt: '2024-04-10', itemCount: 7,
  },
];

const STATUS_LABELS: Record<QuotStatus, string> = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  SHORTLISTED: 'Shortlisted',
};

function getScoreClass(score: number) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'mid';
  return 'low';
}

// ─── Component ──────────────────────────────────────────────

export default function QuotationsPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'card'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  // ── Compare feature state ──
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareSearch, setCompareSearch] = useState('');
  const [selectedRFQ, setSelectedRFQ] = useState<string | null>(null);
  const [compareDropdownOpen, setCompareDropdownOpen] = useState(false);
  const compareDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (compareDropdownRef.current && !compareDropdownRef.current.contains(e.target as Node)) {
        setCompareDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Unique RFQ numbers
  const uniqueRFQs = useMemo(() => {
    const rfqSet = new Set(MOCK_QUOTATIONS.map(q => q.rfqNumber));
    return Array.from(rfqSet).sort();
  }, []);

  // Filtered RFQ list for compare search
  const filteredRFQs = useMemo(() => {
    if (!compareSearch.trim()) return uniqueRFQs;
    return uniqueRFQs.filter(r => r.toLowerCase().includes(compareSearch.toLowerCase()));
  }, [compareSearch, uniqueRFQs]);

  // Suppliers for selected RFQ
  const compareSuppliers = useMemo(() => {
    if (!selectedRFQ) return [];
    return MOCK_QUOTATIONS.filter(q => q.rfqNumber === selectedRFQ);
  }, [selectedRFQ]);

  // Best values for highlighting
  const bestValues = useMemo(() => {
    if (compareSuppliers.length === 0) return { price: 0, lead: 0, score: 0 };
    return {
      price: Math.min(...compareSuppliers.map(s => s.totalPriceNum)),
      lead: Math.min(...compareSuppliers.map(s => s.leadTimeDays)),
      score: Math.max(...compareSuppliers.map(s => s.score)),
    };
  }, [compareSuppliers]);

  // Summary counts
  const summary = useMemo(() => {
    const total = MOCK_QUOTATIONS.length;
    const pending = MOCK_QUOTATIONS.filter((q) => q.status === 'SUBMITTED' || q.status === 'UNDER_REVIEW').length;
    const accepted = MOCK_QUOTATIONS.filter((q) => q.status === 'ACCEPTED').length;
    const rejected = MOCK_QUOTATIONS.filter((q) => q.status === 'REJECTED').length;
    return { total, pending, accepted, rejected };
  }, []);

  // Filter
  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_QUOTATIONS;
    const q = search.toLowerCase();
    return MOCK_QUOTATIONS.filter(
      (qt) =>
        qt.rfqNumber.toLowerCase().includes(q) ||
        qt.vendorName.toLowerCase().includes(q) ||
        qt.vendorEmail.toLowerCase().includes(q)
    );
  }, [search]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="quot-page">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="quot-page__header">
        <div className="quot-page__header-left">
          <h1>Quotations</h1>
          <p>Review and compare vendor quotations across your RFQs</p>
        </div>
        <button
          className={`quot-compare-toggle ${compareOpen ? 'quot-compare-toggle--active' : ''}`}
          onClick={() => setCompareOpen(prev => !prev)}
        >
          <GitCompareArrows size={16} />
          Compare Suppliers
        </button>
      </div>

      {/* ── Supplier Comparison Panel ─────────────────────── */}
      {compareOpen && (
        <div className="quot-compare">
          <div className="quot-compare__header">
            <div className="quot-compare__title">
              <GitCompareArrows size={20} />
              <div>
                <h2>Supplier Comparison</h2>
                <p>Select an RFQ to compare all supplier quotations side-by-side</p>
              </div>
            </div>
            <button className="quot-compare__close" onClick={() => setCompareOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* RFQ Search Dropdown */}
          <div className="quot-compare__search-area">
            <div className="quot-compare__dropdown" ref={compareDropdownRef}>
              <button
                className="quot-compare__dropdown-trigger"
                onClick={() => setCompareDropdownOpen(prev => !prev)}
              >
                <Search size={14} />
                <span className={selectedRFQ ? '' : 'quot-compare__placeholder'}>
                  {selectedRFQ || 'Search & select RFQ number...'}
                </span>
                <ChevronDown size={14} className={`quot-compare__chevron ${compareDropdownOpen ? 'quot-compare__chevron--open' : ''}`} />
              </button>

              {compareDropdownOpen && (
                <div className="quot-compare__dropdown-menu">
                  <div className="quot-compare__dropdown-search">
                    <Search size={13} />
                    <input
                      type="text"
                      placeholder="Type to search RFQ..."
                      value={compareSearch}
                      onChange={e => setCompareSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="quot-compare__dropdown-list">
                    {filteredRFQs.length > 0 ? (
                      filteredRFQs.map(rfq => {
                        const count = MOCK_QUOTATIONS.filter(q => q.rfqNumber === rfq).length;
                        return (
                          <button
                            key={rfq}
                            className={`quot-compare__dropdown-item ${selectedRFQ === rfq ? 'quot-compare__dropdown-item--active' : ''}`}
                            onClick={() => {
                              setSelectedRFQ(rfq);
                              setCompareDropdownOpen(false);
                              setCompareSearch('');
                            }}
                          >
                            <span className="quot-compare__dropdown-rfq">{rfq}</span>
                            <span className="quot-compare__dropdown-count">{count} supplier{count > 1 ? 's' : ''}</span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="quot-compare__dropdown-empty">No RFQs found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {selectedRFQ && (
              <div className="quot-compare__rfq-badge">
                <span>{selectedRFQ}</span>
                <span className="quot-compare__rfq-count">{compareSuppliers.length} suppliers</span>
              </div>
            )}
          </div>

          {/* Comparison Matrix */}
          {selectedRFQ && compareSuppliers.length > 0 ? (
            <div className="quot-compare__matrix-wrap">
              <table className="quot-compare__matrix">
                <thead>
                  <tr>
                    <th className="quot-compare__param-header">
                      <div className="quot-compare__param-inner">
                        <ArrowDownNarrowWide size={13} />
                        Parameter
                      </div>
                    </th>
                    {compareSuppliers.map(s => (
                      <th key={s.id} className="quot-compare__supplier-header">
                        <div className="quot-compare__supplier-card">
                          <span className={`quot-compare__avatar quot-table__vendor-avatar--${s.avatarMod}`}>
                            {s.vendorInitials}
                          </span>
                          <div className="quot-compare__supplier-info">
                            <span className="quot-compare__supplier-name">{s.vendorName}</span>
                            <span className="quot-compare__supplier-email">{s.vendorEmail}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Total Price */}
                  <tr>
                    <td className="quot-compare__param-label">
                      <div className="quot-compare__param-inner">
                        <span className="quot-compare__param-icon quot-compare__param-icon--price"><TrendingDown size={14} /></span>
                        Total Price
                      </div>
                    </td>
                    {compareSuppliers.map(s => (
                      <td key={s.id} className={`quot-compare__value ${s.totalPriceNum === bestValues.price ? 'quot-compare__value--best' : ''}`}>
                        <div className="quot-compare__value-wrap">
                          <span className="quot-compare__value-main">{s.totalPrice}</span>
                          {s.totalPriceNum === bestValues.price && (
                            <span className="quot-compare__best-chip"><Crown size={11} /> Best</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  {/* Lead Time */}
                  <tr>
                    <td className="quot-compare__param-label">
                      <div className="quot-compare__param-inner">
                        <span className="quot-compare__param-icon quot-compare__param-icon--lead"><Clock size={14} /></span>
                        Lead Time
                      </div>
                    </td>
                    {compareSuppliers.map(s => (
                      <td key={s.id} className={`quot-compare__value ${s.leadTimeDays === bestValues.lead ? 'quot-compare__value--best' : ''}`}>
                        <div className="quot-compare__value-wrap">
                          <span className="quot-compare__value-main">{s.leadTimeDays} days</span>
                          {s.leadTimeDays === bestValues.lead && (
                            <span className="quot-compare__best-chip"><Crown size={11} /> Best</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  {/* Payment Terms */}
                  <tr>
                    <td className="quot-compare__param-label">
                      <div className="quot-compare__param-inner">
                        <span className="quot-compare__param-icon quot-compare__param-icon--terms"><FileText size={14} /></span>
                        Payment Terms
                      </div>
                    </td>
                    {compareSuppliers.map(s => (
                      <td key={s.id} className="quot-compare__value">
                        <div className="quot-compare__value-wrap">
                          <span className="quot-compare__value-main">{s.paymentTerms}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  {/* Vendor Score */}
                  <tr>
                    <td className="quot-compare__param-label">
                      <div className="quot-compare__param-inner">
                        <span className="quot-compare__param-icon quot-compare__param-icon--score"><TrendingUp size={14} /></span>
                        Vendor Score
                      </div>
                    </td>
                    {compareSuppliers.map(s => (
                      <td key={s.id} className={`quot-compare__value ${s.score === bestValues.score ? 'quot-compare__value--best' : ''}`}>
                        <div className="quot-compare__score-cell">
                          <div className="quot-score">
                            <div className="quot-score__bar">
                              <div
                                className={`quot-score__fill quot-score__fill--${getScoreClass(s.score)}`}
                                style={{ width: `${s.score}%` }}
                              />
                            </div>
                            <span className="quot-score__value">{s.score}</span>
                          </div>
                          {s.score === bestValues.score && (
                            <span className="quot-compare__best-chip"><Crown size={11} /> Best</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  {/* Items Count */}
                  <tr>
                    <td className="quot-compare__param-label">
                      <div className="quot-compare__param-inner">
                        <span className="quot-compare__param-icon quot-compare__param-icon--items"><ClipboardList size={14} /></span>
                        Items Quoted
                      </div>
                    </td>
                    {compareSuppliers.map(s => (
                      <td key={s.id} className="quot-compare__value">
                        <div className="quot-compare__value-wrap">
                          <span className="quot-compare__value-main">{s.itemCount} items</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  {/* Status */}
                  <tr>
                    <td className="quot-compare__param-label">
                      <div className="quot-compare__param-inner">
                        <span className="quot-compare__param-icon quot-compare__param-icon--status"><CheckCircle2 size={14} /></span>
                        Status
                      </div>
                    </td>
                    {compareSuppliers.map(s => (
                      <td key={s.id} className="quot-compare__value">
                        <div className="quot-compare__value-wrap">
                          <span className={`quot-badge quot-badge--${s.status}`}>
                            {STATUS_LABELS[s.status]}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  {/* Submitted Date */}
                  <tr>
                    <td className="quot-compare__param-label">
                      <div className="quot-compare__param-inner">
                        <span className="quot-compare__param-icon quot-compare__param-icon--date"><Clock size={14} /></span>
                        Submitted
                      </div>
                    </td>
                    {compareSuppliers.map(s => (
                      <td key={s.id} className="quot-compare__value">
                        <div className="quot-compare__value-wrap">
                          <span className="quot-compare__value-main">{formatDate(s.submittedAt)}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : selectedRFQ ? (
            <div className="quot-compare__empty">
              <div className="quot-compare__empty-icon"><FileText size={40} /></div>
              <h3>No suppliers found</h3>
              <p>No supplier quotations found for this RFQ</p>
            </div>
          ) : (
            <div className="quot-compare__empty">
              <div className="quot-compare__empty-icon"><Search size={40} /></div>
              <h3>Select an RFQ</h3>
              <p>Search and select an RFQ number above to compare suppliers</p>
            </div>
          )}
        </div>
      )}

      {/* ── Summary Cards ──────────────────────────────────── */}
      <div className="quot-summary">
        <div className="quot-summary-card">
          <div className="quot-summary-card__icon quot-summary-card__icon--total">
            <ClipboardList size={22} />
          </div>
          <div className="quot-summary-card__info">
            <span className="quot-summary-card__value">{summary.total}</span>
            <span className="quot-summary-card__label">Total Quotations</span>
          </div>
        </div>
        <div className="quot-summary-card">
          <div className="quot-summary-card__icon quot-summary-card__icon--pending">
            <Clock size={22} />
          </div>
          <div className="quot-summary-card__info">
            <span className="quot-summary-card__value">{summary.pending}</span>
            <span className="quot-summary-card__label">Pending Review</span>
          </div>
        </div>
        <div className="quot-summary-card">
          <div className="quot-summary-card__icon quot-summary-card__icon--accepted">
            <CheckCircle2 size={22} />
          </div>
          <div className="quot-summary-card__info">
            <span className="quot-summary-card__value">{summary.accepted}</span>
            <span className="quot-summary-card__label">Accepted</span>
          </div>
        </div>
        <div className="quot-summary-card">
          <div className="quot-summary-card__icon quot-summary-card__icon--rejected">
            <XCircle size={22} />
          </div>
          <div className="quot-summary-card__info">
            <span className="quot-summary-card__value">{summary.rejected}</span>
            <span className="quot-summary-card__label">Rejected</span>
          </div>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="quot-toolbar">
        <div className="quot-toolbar__search">
          <Search size={16} className="quot-toolbar__search-icon" />
          <input
            type="text"
            placeholder="Search by RFQ number, vendor name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="quot-toolbar__filter-group">
          <button className="quot-toolbar__filter">
            <Filter size={14} />
            Status
          </button>
          <div className="quot-toolbar__view-toggle">
            <button
              className={`quot-toolbar__view-btn ${view === 'table' ? 'quot-toolbar__view-btn--active' : ''}`}
              onClick={() => setView('table')}
              title="Table view"
            >
              <LayoutList size={16} />
            </button>
            <button
              className={`quot-toolbar__view-btn ${view === 'card' ? 'quot-toolbar__view-btn--active' : ''}`}
              onClick={() => setView('card')}
              title="Card view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      {paginated.length > 0 ? (
        view === 'table' ? (
          /* ── TABLE VIEW ─── */
          <div className="quot-table-card">
            <div className="quot-table-wrap">
              <table className="quot-table">
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>RFQ #</th>
                    <th>Total Price</th>
                    <th>Lead Time</th>
                    <th>Payment Terms</th>
                    <th><Star size={12} /> Score</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((qt) => (
                    <tr key={qt.id}>
                      <td>
                        <div className="quot-table__vendor">
                          <span className={`quot-table__vendor-avatar quot-table__vendor-avatar--${qt.avatarMod}`}>
                            {qt.vendorInitials}
                          </span>
                          <div className="quot-table__vendor-info">
                            <span className="quot-table__vendor-name">{qt.vendorName}</span>
                            <span className="quot-table__vendor-email">{qt.vendorEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="quot-table__rfq-link">{qt.rfqNumber}</td>
                      <td className="quot-table__price">{qt.totalPrice}</td>
                      <td className="quot-table__lead">{qt.leadTimeDays} days</td>
                      <td>{qt.paymentTerms}</td>
                      <td>
                        <div className="quot-score">
                          <div className="quot-score__bar">
                            <div
                              className={`quot-score__fill quot-score__fill--${getScoreClass(qt.score)}`}
                              style={{ width: `${qt.score}%` }}
                            />
                          </div>
                          <span className="quot-score__value">{qt.score}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`quot-badge quot-badge--${qt.status}`}>
                          {STATUS_LABELS[qt.status]}
                        </span>
                      </td>
                      <td className="quot-table__date">{formatDate(qt.submittedAt)}</td>
                      <td>
                        <div className="quot-table__actions">
                          <button className="quot-table__action-btn" title="View Details">
                            <Eye size={15} />
                          </button>
                          {(qt.status === 'SUBMITTED' || qt.status === 'UNDER_REVIEW' || qt.status === 'SHORTLISTED') && (
                            <>
                              <button className="quot-table__action-btn quot-table__action-btn--accept" title="Accept">
                                <ThumbsUp size={15} />
                              </button>
                              <button className="quot-table__action-btn quot-table__action-btn--reject" title="Reject">
                                <ThumbsDown size={15} />
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
            <div className="quot-pagination">
              <span className="quot-pagination__info">
                Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
              </span>
              <div className="quot-pagination__btns">
                <button className="quot-pagination__btn" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`quot-pagination__btn ${currentPage === p ? 'quot-pagination__btn--active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button className="quot-pagination__btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── CARD VIEW ─── */
          <div className="quot-cards">
            {paginated.map((qt) => (
              <div key={qt.id} className="quot-card">
                <div className="quot-card__top">
                  <div className="quot-card__vendor">
                    <div className={`quot-card__avatar quot-table__vendor-avatar--${qt.avatarMod}`}>
                      {qt.vendorInitials}
                    </div>
                    <div>
                      <div className="quot-card__vendor-name">{qt.vendorName}</div>
                      <div className="quot-card__vendor-email">{qt.vendorEmail}</div>
                    </div>
                  </div>
                  <span className="quot-card__rfq">{qt.rfqNumber}</span>
                </div>

                <div className="quot-card__details">
                  <div className="quot-card__detail">
                    <span className="quot-card__detail-label">Total Price</span>
                    <span className="quot-card__detail-value">{qt.totalPrice}</span>
                  </div>
                  <div className="quot-card__detail">
                    <span className="quot-card__detail-label">Lead Time</span>
                    <span className="quot-card__detail-value">{qt.leadTimeDays} days</span>
                  </div>
                  <div className="quot-card__detail">
                    <span className="quot-card__detail-label">Terms</span>
                    <span className="quot-card__detail-value">{qt.paymentTerms}</span>
                  </div>
                </div>

                <div className="quot-card__footer">
                  <div className="quot-card__score">
                    <div className={`quot-card__score-ring quot-card__score-ring--${getScoreClass(qt.score)}`}>
                      {qt.score}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {getScoreClass(qt.score) === 'high' ? 'Excellent' : getScoreClass(qt.score) === 'mid' ? 'Good' : 'Fair'}
                      </div>
                      <div className="quot-card__score-text">Vendor Score</div>
                    </div>
                  </div>
                  <div>
                    <span className={`quot-badge quot-badge--${qt.status}`}>
                      {STATUS_LABELS[qt.status]}
                    </span>
                    <div className="quot-card__date">{formatDate(qt.submittedAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="quot-table-card">
          <div className="quot-empty">
            <div className="quot-empty__icon">
              <FileText size={48} />
            </div>
            <div className="quot-empty__title">No quotations found</div>
            <div className="quot-empty__desc">
              {search ? 'Try adjusting your search.' : 'Quotations will appear here once vendors respond to your RFQs.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
