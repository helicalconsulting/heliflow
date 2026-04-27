import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  ShoppingCart,
  Users,
  CheckSquare,
  FolderOpen,
  Bell,
  History,
  UserCog,
  Shield,
  PanelLeftClose,
} from 'lucide-react';
import heliflowLogo from '../../assets/heliflow.png';
import { useNavigationMenu } from '../../hooks/useRoleAccess';
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

// Icon mapping for menu items
const ICON_MAP: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard size={19} />,
  'RFQ Management': <FileText size={19} />,
  Quotations: <ClipboardList size={19} />,
  'Purchase Orders': <ShoppingCart size={19} />,
  Vendors: <Users size={19} />,
  Approvals: <CheckSquare size={19} />,
  Documents: <FolderOpen size={19} />,
  Notifications: <Bell size={19} />,
  'Audit Trail': <History size={19} />,
  Administration: <Shield size={19} />,
  'My RFQs': <FileText size={19} />,
  'My Quotations': <ClipboardList size={19} />,
};

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
  const menuItems = useNavigationMenu();

  // Convert menu items to nav sections
  const NAV_SECTIONS: NavSection[] = [
    {
      title: 'Main',
      items: menuItems
        .filter((item) => item.id === 'dashboard' || item.id === 'vendor-dashboard')
        .map((item) => ({
          label: item.label,
          icon: ICON_MAP[item.label] || <LayoutDashboard size={19} />,
          path: item.path,
        })),
    },
    {
      title: 'Procurement',
      items: menuItems
        .filter((item) => ['rfq', 'quotations', 'vendor-rfqs', 'vendor-quotations'].includes(item.id))
        .map((item) => ({
          label: item.label,
          icon: ICON_MAP[item.label] || <FileText size={19} />,
          path: item.path,
        })),
    },
    {
      title: 'Orders',
      items: menuItems
        .filter((item) => item.id === 'purchase-orders')
        .map((item) => ({
          label: item.label,
          icon: ICON_MAP[item.label] || <ShoppingCart size={19} />,
          path: item.path,
        })),
    },
    {
      title: 'Suppliers',
      items: menuItems
        .filter((item) => item.id === 'vendors')
        .map((item) => ({
          label: item.label,
          icon: ICON_MAP[item.label] || <Users size={19} />,
          path: item.path,
        })),
    },
    {
      title: 'Workflow',
      items: menuItems
        .filter((item) => item.id === 'approvals')
        .map((item) => ({
          label: item.label,
          icon: ICON_MAP[item.label] || <CheckSquare size={19} />,
          path: item.path,
        })),
    },
    {
      title: 'Admin',
      items: menuItems
        .filter((item) => item.id === 'admin')
        .flatMap((item) =>
          item.children?.map((child) => ({
            label: child.label,
            icon: ICON_MAP[child.label] || <UserCog size={19} />,
            path: child.path,
          })) || []
        ),
    },
  ].filter((section) => section.items.length > 0);

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
                  item.path === '/dashboard' || item.path === '/vendor/dashboard'
                    ? location.pathname === item.path
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
