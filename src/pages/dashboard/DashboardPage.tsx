import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  ShoppingCart,
  Users,
  IndianRupee,
  Timer,
  TrendingUp,
  TrendingDown,
  Minus,
  CalendarDays,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Send,
  XCircle,
  AlertCircle,
  ShieldCheck,
  History,
} from 'lucide-react';
import './DashboardPage.css';

// ─── Mock Data ──────────────────────────────────────────────

const KPI_DATA = [
  {
    id: 'rfq',
    label: 'Open RFQs',
    value: '12',
    trend: '+3 from last week',
    direction: 'up' as const,
    icon: FileText,
    modifier: 'rfq',
  },
  {
    id: 'approvals',
    label: 'Pending Approvals',
    value: '8',
    trend: '-2 from last week',
    direction: 'down' as const,
    icon: Clock,
    modifier: 'approvals',
  },
  {
    id: 'pos',
    label: 'Active POs',
    value: '24',
    trend: '+5 from last month',
    direction: 'up' as const,
    icon: ShoppingCart,
    modifier: 'pos',
  },
  {
    id: 'vendors',
    label: 'Total Vendors',
    value: '47',
    trend: '+3 new this month',
    direction: 'up' as const,
    icon: Users,
    modifier: 'vendors',
  },
  {
    id: 'spend',
    label: 'Total Spend (MTD)',
    value: '₹18.4L',
    trend: '↑ 12% vs last month',
    direction: 'up' as const,
    icon: IndianRupee,
    modifier: 'spend',
  },
  {
    id: 'lead',
    label: 'Avg Lead Time',
    value: '6.2 days',
    trend: '↓ 0.8 days improved',
    direction: 'down' as const,
    icon: Timer,
    modifier: 'lead',
  },
];

const PIPELINE_DATA = [
  { label: 'Draft', count: 5, percent: 25, modifier: 'draft' },
  { label: 'Sent', count: 8, percent: 40, modifier: 'sent' },
  { label: 'In Progress', count: 6, percent: 30, modifier: 'progress' },
  { label: 'Closed', count: 14, percent: 70, modifier: 'closed' },
  { label: 'Cancelled', count: 2, percent: 10, modifier: 'cancelled' },
];

const PENDING_APPROVALS = [
  {
    module: 'RFQ',
    ref: 'RFQ-2024-018',
    requester: 'Rahul Sharma',
    amount: '₹3,45,000',
    dotMod: 'rfq',
  },
  {
    module: 'PO',
    ref: 'PO-2024-042',
    requester: 'Priya Patel',
    amount: '₹12,80,000',
    dotMod: 'po',
  },
  {
    module: 'Quotation',
    ref: 'QT-2024-031',
    requester: 'Amit Kumar',
    amount: '₹5,60,000',
    dotMod: 'quotation',
  },
  {
    module: 'PO',
    ref: 'PO-2024-043',
    requester: 'Sneha Gupta',
    amount: '₹8,20,000',
    dotMod: 'po',
  },
];

const RECENT_RFQS = [
  { num: 'RFQ-2024-020', title: 'Office Furniture Procurement', status: 'draft', date: '25 Apr 2024', vendors: 0 },
  { num: 'RFQ-2024-019', title: 'IT Hardware — Q2 Refresh', status: 'sent', date: '24 Apr 2024', vendors: 5 },
  { num: 'RFQ-2024-018', title: 'Electrical Panel Components', status: 'progress', date: '22 Apr 2024', vendors: 3 },
  { num: 'RFQ-2024-017', title: 'Safety Equipment Annual', status: 'closed', date: '20 Apr 2024', vendors: 4 },
  { num: 'RFQ-2024-016', title: 'Raw Material — Steel Plates', status: 'cancelled', date: '18 Apr 2024', vendors: 2 },
];

const ACTIVITY = [
  { icon: Send, text: '<strong>RFQ-2024-019</strong> sent to 5 vendors', time: '2 hours ago' },
  { icon: ShieldCheck, text: '<strong>PO-2024-041</strong> approved by Finance Manager', time: '4 hours ago' },
  { icon: CheckCircle2, text: 'Vendor <strong>TechSupply Co.</strong> submitted quotation for RFQ-2024-018', time: '6 hours ago' },
  { icon: FileText, text: '<strong>RFQ-2024-020</strong> created by Rahul Sharma', time: 'Yesterday, 5:30 PM' },
  { icon: XCircle, text: '<strong>RFQ-2024-016</strong> cancelled — duplicate request', time: 'Yesterday, 2:15 PM' },
  { icon: AlertCircle, text: 'Approval reminder sent for <strong>PO-2024-042</strong>', time: '2 days ago' },
];

const TOP_VENDORS = [
  { name: 'TechSupply Co.', initials: 'TS', pos: 8, score: 92, quality: 94, delivery: 90, avatarMod: '1' },
  { name: 'IndoSteel Ltd.', initials: 'IS', pos: 6, score: 87, quality: 85, delivery: 89, avatarMod: '2' },
  { name: 'GreenParts Inc.', initials: 'GP', pos: 5, score: 81, quality: 83, delivery: 78, avatarMod: '3' },
  { name: 'Precision Eng.', initials: 'PE', pos: 4, score: 76, quality: 79, delivery: 73, avatarMod: '4' },
];

// ─── Helper ─────────────────────────────────────────────────

function TrendIcon({ direction }: { direction: 'up' | 'down' | 'neutral' }) {
  if (direction === 'up') return <TrendingUp size={14} />;
  if (direction === 'down') return <TrendingDown size={14} />;
  return <Minus size={14} />;
}

function getScoreClass(score: number) {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  return 'avg';
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent',
  progress: 'In Progress',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

// ─── Component ──────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="dashboard">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="dash-header">
        <div className="dash-header__text">
          <h1>Welcome back, {user?.fullName?.split(' ')[0]} 👋</h1>
          <p>Here's what's happening in your procurement workflow today.</p>
        </div>
        <div className="dash-header__date">
          <CalendarDays size={15} />
          {today}
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div className="dash-kpis">
        {KPI_DATA.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.id} className={`dash-kpi dash-kpi--${kpi.modifier}`}>
              <div className="dash-kpi__icon">
                <Icon size={20} />
              </div>
              <div className="dash-kpi__body">
                <span className="dash-kpi__label">{kpi.label}</span>
                <span className="dash-kpi__value">{kpi.value}</span>
                <span className={`dash-kpi__trend dash-kpi__trend--${kpi.direction}`}>
                  <TrendIcon direction={kpi.direction} />
                  {kpi.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Row 2: Pipeline + Approvals ────────────────────── */}
      <div className="dash-row">
        {/* Pipeline */}
        <div className="dash-card">
          <div className="dash-card__header">
            <span className="dash-card__title">
              <BarChart3 size={16} />
              Procurement Pipeline
            </span>
            <Link to="/rfq" className="dash-card__action">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dash-card__body">
            <div className="dash-pipeline">
              {PIPELINE_DATA.map((item) => (
                <div key={item.modifier} className="dash-pipeline__bar">
                  <span className="dash-pipeline__label">{item.label}</span>
                  <div className="dash-pipeline__track">
                    <div
                      className={`dash-pipeline__fill dash-pipeline__fill--${item.modifier}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <span className="dash-pipeline__count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="dash-card">
          <div className="dash-card__header">
            <span className="dash-card__title">
              <Clock size={16} />
              Pending Approvals
            </span>
            <Link to="/approvals" className="dash-card__action">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dash-card__body">
            <div className="dash-approvals">
              {PENDING_APPROVALS.map((item) => (
                <div key={item.ref} className="dash-approval-item">
                  <span className={`dash-approval__dot dash-approval__dot--${item.dotMod}`} />
                  <div className="dash-approval__info">
                    <div className="dash-approval__ref">
                      {item.ref}
                      <span className="dash-approval__badge">{item.module}</span>
                    </div>
                    <div className="dash-approval__meta">
                      Requested by {item.requester}
                    </div>
                  </div>
                  <span className="dash-approval__amount">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Recent RFQs + Activity ──────────────────── */}
      <div className="dash-row">
        {/* Recent RFQs */}
        <div className="dash-card">
          <div className="dash-card__header">
            <span className="dash-card__title">
              <FileText size={16} />
              Recent RFQs
            </span>
            <Link to="/rfq" className="dash-card__action">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dash-card__body dash-card__body--table">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>RFQ #</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Vendors</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_RFQS.map((rfq) => (
                  <tr key={rfq.num}>
                    <td className="dash-table__rfq-num">{rfq.num}</td>
                    <td className="dash-table__title">{rfq.title}</td>
                    <td>
                      <span className={`dash-badge dash-badge--${rfq.status}`}>
                        {STATUS_LABELS[rfq.status]}
                      </span>
                    </td>
                    <td>{rfq.date}</td>
                    <td>{rfq.vendors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="dash-card">
          <div className="dash-card__header">
            <span className="dash-card__title">
              <History size={16} />
              Recent Activity
            </span>
            <Link to="/audit" className="dash-card__action">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="dash-card__body">
            <div className="dash-timeline">
              {ACTIVITY.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="dash-tl-item">
                    <div className="dash-tl__dot">
                      <Icon size={14} />
                    </div>
                    <div className="dash-tl__content">
                      <div
                        className="dash-tl__text"
                        dangerouslySetInnerHTML={{ __html: item.text }}
                      />
                      <div className="dash-tl__time">{item.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Top Vendors ─────────────────────────────── */}
      <div className="dash-card">
        <div className="dash-card__header">
          <span className="dash-card__title">
            <Users size={16} />
            Top Performing Vendors
          </span>
          <Link to="/vendors" className="dash-card__action">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="dash-card__body">
          <div className="dash-vendors">
            {TOP_VENDORS.map((v) => (
              <div key={v.name} className="dash-vendor">
                <div className="dash-vendor__header">
                  <div className={`dash-vendor__avatar dash-vendor__avatar--${v.avatarMod}`}>
                    {v.initials}
                  </div>
                  <div>
                    <div className="dash-vendor__name">{v.name}</div>
                    <div className="dash-vendor__pos">{v.pos} Purchase Orders</div>
                  </div>
                </div>
                <div className="dash-vendor__score-section">
                  <div className="dash-vendor__score-header">
                    <span className="dash-vendor__score-label">Overall Score</span>
                    <span className="dash-vendor__score-value">{v.score}%</span>
                  </div>
                  <div className="dash-vendor__score-bar">
                    <div
                      className={`dash-vendor__score-fill dash-vendor__score-fill--${getScoreClass(v.score)}`}
                      style={{ width: `${v.score}%` }}
                    />
                  </div>
                </div>
                <div className="dash-vendor__metrics">
                  <div className="dash-vendor__metric">
                    <span className="dash-vendor__metric-val">{v.quality}%</span>
                    <span className="dash-vendor__metric-lbl">Quality</span>
                  </div>
                  <div className="dash-vendor__metric">
                    <span className="dash-vendor__metric-val">{v.delivery}%</span>
                    <span className="dash-vendor__metric-lbl">Delivery</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
