import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  FileText,
  Eye,
  Trash2,
  Copy,
  Users,
  Package,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import type { RFQStatus } from '../../types';
import './RFQPage.css';

// ─── Mock Data ──────────────────────────────────────────────

interface MockRFQ {
  id: number;
  rfqNumber: string;
  title: string;
  description: string;
  status: RFQStatus;
  createdAt: string;
  creator: string;
  creatorInitials: string;
  vendorCount: number;
  itemCount: number;
  totalEstimate: string;
}

const MOCK_RFQS: MockRFQ[] = [
  {
    id: 1, rfqNumber: 'RFQ-2024-020', title: 'Office Furniture Procurement', description: 'Desks, chairs, and storage cabinets for new wing',
    status: 'DRAFT', createdAt: '2024-04-25', creator: 'Rahul Sharma', creatorInitials: 'RS', vendorCount: 0, itemCount: 8, totalEstimate: '₹4,50,000',
  },
  {
    id: 2, rfqNumber: 'RFQ-2024-019', title: 'IT Hardware — Q2 Refresh', description: 'Laptops, monitors, and peripherals',
    status: 'SENT', createdAt: '2024-04-24', creator: 'Priya Patel', creatorInitials: 'PP', vendorCount: 5, itemCount: 12, totalEstimate: '₹18,75,000',
  },
  {
    id: 3, rfqNumber: 'RFQ-2024-018', title: 'Electrical Panel Components', description: 'MCBs, switchgear, and panel accessories',
    status: 'IN_PROGRESS', createdAt: '2024-04-22', creator: 'Amit Kumar', creatorInitials: 'AK', vendorCount: 3, itemCount: 15, totalEstimate: '₹7,20,000',
  },
  {
    id: 4, rfqNumber: 'RFQ-2024-017', title: 'Safety Equipment Annual', description: 'PPE kits, helmets, gloves, and safety shoes',
    status: 'CLOSED', createdAt: '2024-04-20', creator: 'Sneha Gupta', creatorInitials: 'SG', vendorCount: 4, itemCount: 20, totalEstimate: '₹3,85,000',
  },
  {
    id: 5, rfqNumber: 'RFQ-2024-016', title: 'Raw Material — Steel Plates', description: 'MS and SS plates for manufacturing',
    status: 'CANCELLED', createdAt: '2024-04-18', creator: 'Rahul Sharma', creatorInitials: 'RS', vendorCount: 2, itemCount: 4, totalEstimate: '₹12,00,000',
  },
  {
    id: 6, rfqNumber: 'RFQ-2024-015', title: 'Packaging Material Supply', description: 'Corrugated boxes, tape, and shrink wrap',
    status: 'CLOSED', createdAt: '2024-04-15', creator: 'Priya Patel', creatorInitials: 'PP', vendorCount: 6, itemCount: 9, totalEstimate: '₹2,10,000',
  },
  {
    id: 7, rfqNumber: 'RFQ-2024-014', title: 'HVAC Maintenance Service', description: 'Annual maintenance contract for AC units',
    status: 'IN_PROGRESS', createdAt: '2024-04-12', creator: 'Amit Kumar', creatorInitials: 'AK', vendorCount: 2, itemCount: 3, totalEstimate: '₹5,40,000',
  },
  {
    id: 8, rfqNumber: 'RFQ-2024-013', title: 'Lab Equipment Purchase', description: 'Testing instruments and calibration tools',
    status: 'SENT', createdAt: '2024-04-10', creator: 'Sneha Gupta', creatorInitials: 'SG', vendorCount: 4, itemCount: 7, totalEstimate: '₹9,60,000',
  },
  {
    id: 9, rfqNumber: 'RFQ-2024-012', title: 'Transport Fleet Tyre Replacement', description: 'Tyres for delivery trucks and forklifts',
    status: 'DRAFT', createdAt: '2024-04-08', creator: 'Rahul Sharma', creatorInitials: 'RS', vendorCount: 0, itemCount: 6, totalEstimate: '₹1,80,000',
  },
  {
    id: 10, rfqNumber: 'RFQ-2024-011', title: 'Cleaning Supplies Quarterly', description: 'Detergents, mops, and janitorial supplies',
    status: 'CLOSED', createdAt: '2024-04-05', creator: 'Priya Patel', creatorInitials: 'PP', vendorCount: 3, itemCount: 14, totalEstimate: '₹95,000',
  },
];

type StatusFilter = 'ALL' | RFQStatus;

const STATUS_LABELS: Record<RFQStatus, string> = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  IN_PROGRESS: 'In Progress',
  CLOSED: 'Closed',
  CANCELLED: 'Cancelled',
};

// ─── Component ──────────────────────────────────────────────

export default function RFQPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  // Counts per status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: MOCK_RFQS.length };
    for (const rfq of MOCK_RFQS) {
      counts[rfq.status] = (counts[rfq.status] || 0) + 1;
    }
    return counts;
  }, []);

  // Filter
  const filtered = useMemo(() => {
    let list = MOCK_RFQS;
    if (statusFilter !== 'ALL') {
      list = list.filter((r) => r.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.rfqNumber.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.creator.toLowerCase().includes(q)
      );
    }
    return list;
  }, [statusFilter, search]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="rfq-page">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="rfq-page__header">
        <div className="rfq-page__header-left">
          <h1>Request for Quotations</h1>
          <p>Manage and track all your procurement requests</p>
        </div>
        <button className="rfq-page__create-btn" onClick={() => navigate('/rfq/create')}>
          <Plus size={18} />
          New RFQ
        </button>
      </div>

      {/* ── Status Filter Pills ────────────────────────────── */}
      <div className="rfq-stats">
        {(['ALL', 'DRAFT', 'SENT', 'IN_PROGRESS', 'CLOSED', 'CANCELLED'] as StatusFilter[]).map(
          (s) => {
            const modMap: Record<string, string> = {
              ALL: 'all', DRAFT: 'draft', SENT: 'sent',
              IN_PROGRESS: 'progress', CLOSED: 'closed', CANCELLED: 'cancelled',
            };
            return (
              <button
                key={s}
                className={`rfq-stat rfq-stat--${modMap[s]} ${statusFilter === s ? 'rfq-stat--active' : ''}`}
                onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
              >
                {s === 'ALL' ? 'All' : STATUS_LABELS[s as RFQStatus]}
                <span className="rfq-stat__count">{statusCounts[s] || 0}</span>
              </button>
            );
          }
        )}
      </div>

      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="rfq-toolbar">
        <div className="rfq-toolbar__search">
          <Search size={16} className="rfq-toolbar__search-icon" />
          <input
            type="text"
            placeholder="Search by RFQ number, title, or creator..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <button className="rfq-toolbar__filter">
          <Filter size={14} />
          Filters
        </button>
        <button className="rfq-toolbar__filter">
          <ArrowUpDown size={14} />
          Sort
        </button>
      </div>

      {/* ── Table ──────────────────────────────────────────── */}
      <div className="rfq-table-card">
        {paginated.length > 0 ? (
          <>
            <div className="rfq-table-wrap">
              <table className="rfq-table">
                <thead>
                  <tr>
                    <th>RFQ # <ArrowUpDown size={12} /></th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Date</th>
                    <th><Package size={12} /> Items</th>
                    <th><Users size={12} /> Vendors</th>
                    <th>Estimate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((rfq) => (
                    <tr key={rfq.id}>
                      <td className="rfq-table__num">{rfq.rfqNumber}</td>
                      <td className="rfq-table__title-cell">
                        <span className="rfq-table__title">{rfq.title}</span>
                        <span className="rfq-table__desc">{rfq.description}</span>
                      </td>
                      <td>
                        <span className={`rfq-badge rfq-badge--${rfq.status}`}>
                          <span className="rfq-badge__dot" />
                          {STATUS_LABELS[rfq.status]}
                        </span>
                      </td>
                      <td>
                        <div className="rfq-table__creator">
                          <span className="rfq-table__avatar">{rfq.creatorInitials}</span>
                          {rfq.creator}
                        </div>
                      </td>
                      <td className="rfq-table__date">{formatDate(rfq.createdAt)}</td>
                      <td className="rfq-table__items-count">{rfq.itemCount}</td>
                      <td>
                        <div className="rfq-table__vendors">
                          <Users size={14} />
                          {rfq.vendorCount}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{rfq.totalEstimate}</td>
                      <td>
                        <div className="rfq-table__actions">
                          <button className="rfq-table__action-btn" title="View">
                            <Eye size={15} />
                          </button>
                          <button className="rfq-table__action-btn" title="Duplicate">
                            <Copy size={15} />
                          </button>
                          {rfq.status === 'DRAFT' && (
                            <button className="rfq-table__action-btn" title="Delete">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="rfq-pagination">
              <span className="rfq-pagination__info">
                Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
              </span>
              <div className="rfq-pagination__btns">
                <button
                  className="rfq-pagination__btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`rfq-pagination__btn ${currentPage === p ? 'rfq-pagination__btn--active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="rfq-pagination__btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="rfq-empty">
            <div className="rfq-empty__icon">
              <FileText size={48} />
            </div>
            <div className="rfq-empty__title">No RFQs found</div>
            <div className="rfq-empty__desc">
              {search ? 'Try adjusting your search or filters.' : 'Create your first RFQ to get started.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
