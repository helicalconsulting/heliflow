import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import './TopBar.css';

// ─── Page title mapping ─────────────────────────────────────

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/rfq': 'Request for Quotations',
  '/quotations': 'Quotations',
  '/purchase-orders': 'Purchase Orders',
  '/vendors': 'Vendors',
  '/vendor-portal': 'Vendor Portal',
  '/approvals': 'Approvals',
  '/documents': 'Documents',
  '/notifications': 'Notifications',
  '/audit': 'Audit Trail',
  '/admin/users': 'User Management',
  '/admin/roles-permissions': 'Roles & Permissions',
  '/admin/approval-levels': 'Approval Levels',
};

function getPageTitle(pathname: string): string {
  // Exact match
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  // Prefix match (for nested routes like /rfq/123)
  const match = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(key));

  return match ? PAGE_TITLES[match] : 'Heliflow';
}

// ─── Component ──────────────────────────────────────────────

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user, roles, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(location.pathname);

  // Get user initials for avatar
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    }

    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
    <header className="topbar">
      {/* Left */}
      <div className="topbar__left">
        <button
          className="topbar__hamburger"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="topbar__page-title">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="topbar__right">
        {/* Theme toggle */}
        <button
          className="topbar__icon-btn"
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button className="topbar__icon-btn" title="Notifications">
          <Bell size={16} />
          <span className="topbar__notif-badge" />
        </button>

        <span className="topbar__divider" />

        {/* User */}
        <div
          className="topbar__user"
          ref={dropdownRef}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="topbar__avatar">{initials}</span>
          <div className="topbar__user-info">
            <span className="topbar__user-name">{user?.fullName}</span>
            <span className="topbar__user-role">{roles.join(', ')}</span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="topbar__dropdown">
              <button className="topbar__dropdown-item">
                <User size={16} />
                Profile
              </button>
              <div className="topbar__dropdown-divider" />
              <button
                className="topbar__dropdown-item topbar__dropdown-item--danger"
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
