import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  ShoppingCart,
  Users,
  Globe,
  CheckSquare,
  FolderOpen,
  Bell,
  History,
  UserCog,
  Shield,
  Layers,
  PanelLeftClose,
} from 'lucide-react';
import heliflowLogo from '../../assets/heliflow.png';
import './Sidebar.css';

// ─── Navigation config ──────────────────────────────────────

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard size={19} />, path: '/dashboard' },
    ],
  },
  {
    title: 'Procurement',
    items: [
      { label: 'RFQ', icon: <FileText size={19} />, path: '/rfq' },
      { label: 'Quotations', icon: <ClipboardList size={19} />, path: '/quotations' },
    ],
  },
  {
    title: 'Orders',
    items: [
      { label: 'Purchase Orders', icon: <ShoppingCart size={19} />, path: '/purchase-orders' },
    ],
  },
  {
    title: 'Suppliers',
    items: [
      { label: 'Vendors', icon: <Users size={19} />, path: '/vendors' },
      { label: 'Vendor Portal', icon: <Globe size={19} />, path: '/vendor-portal' },
    ],
  },
  {
    title: 'Workflow',
    items: [
      { label: 'Approvals', icon: <CheckSquare size={19} />, path: '/approvals' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Documents', icon: <FolderOpen size={19} />, path: '/documents' },
      { label: 'Notifications', icon: <Bell size={19} />, path: '/notifications' },
      { label: 'Audit Trail', icon: <History size={19} />, path: '/audit' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { label: 'Users', icon: <UserCog size={19} />, path: '/admin/users' },
      { label: 'Roles & Permissions', icon: <Shield size={19} />, path: '/admin/roles-permissions' },
      { label: 'Approval Levels', icon: <Layers size={19} />, path: '/admin/approval-levels' },
    ],
  },
];

// ─── Component ──────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggle,
  onMobileClose,
}: SidebarProps) {
  const location = useLocation();

  const sidebarClasses = [
    'sidebar',
    collapsed ? 'sidebar--collapsed' : '',
    mobileOpen ? 'sidebar--mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar__backdrop ${mobileOpen ? 'sidebar__backdrop--visible' : ''}`}
        onClick={onMobileClose}
      />

      <aside className={sidebarClasses}>
        {/* Logo */}
        <div className="sidebar__logo">
          <img
            src={heliflowLogo}
            alt="Heliflow"
            className="sidebar__logo-img"
          />
          <span className="sidebar__logo-text">Heliflow</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="sidebar__section">
              <span className="sidebar__section-label">{section.title}</span>
              {section.items.map((item) => {
                const isActive =
                  item.path === '/dashboard'
                    ? location.pathname === '/dashboard'
                    : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
                    onClick={onMobileClose}
                  >
                    <span className="sidebar__item-icon">{item.icon}</span>
                    <span className="sidebar__item-label">{item.label}</span>
                    <span className="sidebar__item-tooltip">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Toggle collapse */}
        <button className="sidebar__toggle" onClick={onToggle}>
          <span className="sidebar__toggle-icon">
            <PanelLeftClose size={18} />
          </span>
          <span className="sidebar__toggle-label">Collapse</span>
        </button>
      </aside>
    </>
  );
}
