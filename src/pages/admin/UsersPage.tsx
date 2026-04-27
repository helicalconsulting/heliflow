import { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  Search,
  Users,
  UserCheck,
  UserX,
  Shield,
  Eye,
  Edit3,
  Trash2,
  X,
  UserPlus,
  Mail,
  Phone,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './UsersPage.css';

// ─── Types ──────────────────────────────────────────────────

type RoleName = 'Super Admin' | 'Administrator' | 'Manager' | 'Finance Approver' | 'Staff';

interface MockUser {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  department: string;
  companyCode: string;
  role: RoleName;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  avatarMod: string;
  initials: string;
}

// ─── Mock Data ──────────────────────────────────────────────

const MOCK_USERS: MockUser[] = [
  {
    id: 1, fullName: 'System Administrator', username: 'system_admin', email: 'admin@heliflow.in', phone: '+91 98765 43210',
    department: 'IT', companyCode: 'HELI', role: 'Super Admin', isActive: true, lastLoginAt: '2024-04-26T10:30:00', createdAt: '2024-01-01', avatarMod: '1', initials: 'SA',
  },
  {
    id: 2, fullName: 'Rahul Sharma', username: 'rahul.sharma', email: 'rahul.sharma@heliflow.in', phone: '+91 98765 11111',
    department: 'Engineering', companyCode: 'HELI', role: 'Manager', isActive: true, lastLoginAt: '2024-04-26T09:15:00', createdAt: '2024-01-15', avatarMod: '2', initials: 'RS',
  },
  {
    id: 3, fullName: 'Priya Patel', username: 'priya.patel', email: 'priya.patel@heliflow.in', phone: '+91 98765 22222',
    department: 'Operations', companyCode: 'HELI', role: 'Administrator', isActive: true, lastLoginAt: '2024-04-25T16:45:00', createdAt: '2024-01-20', avatarMod: '3', initials: 'PP',
  },
  {
    id: 4, fullName: 'Amit Kumar', username: 'amit.kumar', email: 'amit.kumar@heliflow.in', phone: '+91 98765 33333',
    department: 'Engineering', companyCode: 'HELI', role: 'Staff', isActive: true, lastLoginAt: '2024-04-26T08:00:00', createdAt: '2024-02-01', avatarMod: '4', initials: 'AK',
  },
  {
    id: 5, fullName: 'Sneha Gupta', username: 'sneha.gupta', email: 'sneha.gupta@heliflow.in', phone: '+91 98765 44444',
    department: 'Finance', companyCode: 'HELI', role: 'Finance Approver', isActive: true, lastLoginAt: '2024-04-24T14:20:00', createdAt: '2024-02-10', avatarMod: '5', initials: 'SG',
  },
  {
    id: 6, fullName: 'Vikram Singh', username: 'vikram.singh', email: 'vikram.singh@heliflow.in', phone: '+91 98765 55555',
    department: 'Manufacturing', companyCode: 'HELI', role: 'Manager', isActive: true, lastLoginAt: '2024-04-23T11:30:00', createdAt: '2024-02-15', avatarMod: '6', initials: 'VS',
  },
  {
    id: 7, fullName: 'Neha Verma', username: 'neha.verma', email: 'neha.verma@heliflow.in', phone: '+91 98765 66666',
    department: 'Admin', companyCode: 'HELI', role: 'Staff', isActive: false, lastLoginAt: '2024-03-10T09:00:00', createdAt: '2024-03-01', avatarMod: '1', initials: 'NV',
  },
  {
    id: 8, fullName: 'Deepak Joshi', username: 'deepak.joshi', email: 'deepak.joshi@heliflow.in', phone: '+91 98765 77777',
    department: 'IT', companyCode: 'HELI', role: 'Administrator', isActive: true, lastLoginAt: '2024-04-26T07:45:00', createdAt: '2024-03-05', avatarMod: '2', initials: 'DJ',
  },
  {
    id: 9, fullName: 'Kavita Reddy', username: 'kavita.reddy', email: 'kavita.reddy@heliflow.in', phone: '+91 98765 88888',
    department: 'Finance', companyCode: 'HELI', role: 'Finance Approver', isActive: true, lastLoginAt: '2024-04-25T13:10:00', createdAt: '2024-03-10', avatarMod: '3', initials: 'KR',
  },
  {
    id: 10, fullName: 'Ravi Tiwari', username: 'ravi.tiwari', email: 'ravi.tiwari@heliflow.in', phone: '+91 98765 99999',
    department: 'Operations', companyCode: 'HELI', role: 'Staff', isActive: false, lastLoginAt: null, createdAt: '2024-04-01', avatarMod: '4', initials: 'RT',
  },
  {
    id: 11, fullName: 'Anjali Mehta', username: 'anjali.mehta', email: 'anjali.mehta@heliflow.in', phone: '+91 98765 10101',
    department: 'Engineering', companyCode: 'HELI', role: 'Staff', isActive: true, lastLoginAt: '2024-04-26T06:30:00', createdAt: '2024-04-05', avatarMod: '5', initials: 'AM',
  },
  {
    id: 12, fullName: 'Suresh Nair', username: 'suresh.nair', email: 'suresh.nair@heliflow.in', phone: '+91 98765 12121',
    department: 'Manufacturing', companyCode: 'HELI', role: 'Manager', isActive: true, lastLoginAt: '2024-04-25T17:00:00', createdAt: '2024-04-10', avatarMod: '6', initials: 'SN',
  },
];

const ALL_ROLES: RoleName[] = ['Super Admin', 'Administrator', 'Manager', 'Finance Approver', 'Staff'];

const ROLE_CLASS_MAP: Record<RoleName, string> = {
  'Super Admin': 'super-admin',
  Administrator: 'administrator',
  Manager: 'manager',
  'Finance Approver': 'finance-approver',
  Staff: 'staff',
};

// ─── Component ──────────────────────────────────────────────

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | RoleName>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState(MOCK_USERS);
  const perPage = 8;

  // New user form state
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<RoleName | ''>('');
  const [newDepartment, setNewDepartment] = useState('');

  // Summary
  const summary = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    admins: users.filter((u) => u.role === 'Super Admin' || u.role === 'Administrator').length,
  }), [users]);

  // Role counts
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: users.length };
    for (const u of users) counts[u.role] = (counts[u.role] || 0) + 1;
    return counts;
  }, [users]);

  // Filter
  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter !== 'ALL') list = list.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, roleFilter, search]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleActive = useCallback((id: number) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)));
  }, []);

  // Open modal (reset form)
  const openAddModal = useCallback(() => {
    setNewFullName('');
    setNewUsername('');
    setNewPassword('');
    setNewEmail('');
    setNewPhone('');
    setNewRole('');
    setNewDepartment('');
    setShowModal(true);
  }, []);

  // Create user
  const handleCreateUser = useCallback(() => {
    if (!newFullName.trim() || !newUsername.trim() || !newPassword.trim() || !newEmail.trim() || !newRole) return;
    const nameParts = newFullName.trim().split(' ');
    const initials = nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : newFullName.trim().slice(0, 2).toUpperCase();
    const avatarMod = String((users.length % 6) + 1);
    const newUser: MockUser = {
      id: Date.now(),
      fullName: newFullName.trim(),
      username: newUsername.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '+91 00000 00000',
      department: newDepartment || 'General',
      companyCode: 'HELI',
      role: newRole as RoleName,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date().toISOString().split('T')[0],
      avatarMod,
      initials,
    };
    setUsers((prev) => [...prev, newUser]);
    setShowModal(false);
  }, [newFullName, newUsername, newPassword, newEmail, newPhone, newRole, newDepartment, users.length]);

  const canCreateUser = newFullName.trim() && newUsername.trim() && newPassword.trim() && newEmail.trim() && newRole;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatDateTime = (d: string | null) => {
    if (!d) return 'Never';
    const date = new Date(d);
    return `${date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="users-page">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="users-page__header">
        <div className="users-page__header-left">
          <h1>User Management</h1>
          <p>Manage users, assign roles, and control access</p>
        </div>
        <button className="users-page__add-btn" onClick={openAddModal}>
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* ── Summary Cards ──────────────────────────────────── */}
      <div className="users-summary">
        <div className="users-summary-card">
          <div className="users-summary-card__icon users-summary-card__icon--total">
            <Users size={22} />
          </div>
          <div className="users-summary-card__info">
            <span className="users-summary-card__value">{summary.total}</span>
            <span className="users-summary-card__label">Total Users</span>
          </div>
        </div>
        <div className="users-summary-card">
          <div className="users-summary-card__icon users-summary-card__icon--active">
            <UserCheck size={22} />
          </div>
          <div className="users-summary-card__info">
            <span className="users-summary-card__value">{summary.active}</span>
            <span className="users-summary-card__label">Active</span>
          </div>
        </div>
        <div className="users-summary-card">
          <div className="users-summary-card__icon users-summary-card__icon--inactive">
            <UserX size={22} />
          </div>
          <div className="users-summary-card__info">
            <span className="users-summary-card__value">{summary.inactive}</span>
            <span className="users-summary-card__label">Inactive</span>
          </div>
        </div>
        <div className="users-summary-card">
          <div className="users-summary-card__icon users-summary-card__icon--admins">
            <Shield size={22} />
          </div>
          <div className="users-summary-card__info">
            <span className="users-summary-card__value">{summary.admins}</span>
            <span className="users-summary-card__label">Admins</span>
          </div>
        </div>
      </div>

      {/* ── Role Filter Pills ──────────────────────────────── */}
      <div className="users-role-pills">
        <button
          className={`users-role-pill ${roleFilter === 'ALL' ? 'users-role-pill--active' : ''}`}
          onClick={() => { setRoleFilter('ALL'); setCurrentPage(1); }}
        >
          All <span className="users-role-pill__count">{roleCounts.ALL}</span>
        </button>
        {ALL_ROLES.map((role) => (
          <button
            key={role}
            className={`users-role-pill ${roleFilter === role ? 'users-role-pill--active' : ''}`}
            onClick={() => { setRoleFilter(role); setCurrentPage(1); }}
          >
            {role} <span className="users-role-pill__count">{roleCounts[role] || 0}</span>
          </button>
        ))}
      </div>

      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="users-toolbar">
        <div className="users-toolbar__search">
          <Search size={16} className="users-toolbar__search-icon" />
          <input
            type="text"
            placeholder="Search by name, username, email, or department..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────── */}
      <div className="users-table-card">
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="users-table__user">
                      <div className={`users-table__avatar users-table__avatar--${user.avatarMod}`}>
                        {user.initials}
                        <span className={`users-table__avatar-status users-table__avatar-status--${user.isActive ? 'active' : 'inactive'}`} />
                      </div>
                      <div className="users-table__user-info">
                        <span className="users-table__user-name">{user.fullName}</span>
                        <span className="users-table__user-username">@{user.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="users-table__email">{user.email}</td>
                  <td>
                    <span className={`users-role-badge users-role-badge--${ROLE_CLASS_MAP[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="users-table__dept">{user.department}</td>
                  <td>
                    <div className="users-status-toggle" onClick={() => toggleActive(user.id)}>
                      <div className={`users-status-toggle__track ${user.isActive ? 'users-status-toggle__track--active' : ''}`}>
                        <div className="users-status-toggle__knob" />
                      </div>
                      <span className={`users-status-toggle__label users-status-toggle__label--${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="users-table__date">{formatDateTime(user.lastLoginAt)}</td>
                  <td className="users-table__date">{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="users-table__actions">
                      <button className="users-table__action-btn" title="View">
                        <Eye size={15} />
                      </button>
                      <button className="users-table__action-btn" title="Edit">
                        <Edit3 size={15} />
                      </button>
                      {user.role !== 'Super Admin' && (
                        <button className="users-table__action-btn users-table__action-btn--danger" title="Delete">
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
        {filtered.length > perPage && (
          <div className="users-pagination">
            <span className="users-pagination__info">
              Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
            </span>
            <div className="users-pagination__btns">
              <button className="users-pagination__btn" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`users-pagination__btn ${currentPage === p ? 'users-pagination__btn--active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
              <button className="users-pagination__btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add User Modal ─────────────────────────────────── */}
      {showModal && (
        <div className="users-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="users-modal" onClick={(e) => e.stopPropagation()}>
            <div className="users-modal__header">
              <span className="users-modal__title">
                <UserPlus size={20} />
                Add New User
              </span>
              <button className="users-modal__close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="users-modal__body">
              <div className="users-modal__field">
                <label className="users-modal__label">Full Name <span>*</span></label>
                <input
                  className="users-modal__input"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                />
              </div>

              <div className="users-modal__row">
                <div className="users-modal__field">
                  <label className="users-modal__label">Username <span>*</span></label>
                  <input
                    className="users-modal__input"
                    type="text"
                    placeholder="e.g. rahul.sharma"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>
                <div className="users-modal__field">
                  <label className="users-modal__label">Password <span>*</span></label>
                  <input
                    className="users-modal__input"
                    type="password"
                    placeholder="Min 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="users-modal__row">
                <div className="users-modal__field">
                  <label className="users-modal__label">
                    <Mail size={13} style={{ marginRight: 4 }} />
                    Email <span>*</span>
                  </label>
                  <input
                    className="users-modal__input"
                    type="email"
                    placeholder="user@heliflow.in"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div className="users-modal__field">
                  <label className="users-modal__label">
                    <Phone size={13} style={{ marginRight: 4 }} />
                    Phone
                  </label>
                  <input
                    className="users-modal__input"
                    type="tel"
                    placeholder="+91 98765 XXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="users-modal__row">
                <div className="users-modal__field">
                  <label className="users-modal__label">
                    <Shield size={13} style={{ marginRight: 4 }} />
                    Role <span>*</span>
                  </label>
                  <select
                    className="users-modal__select"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as RoleName | '')}
                  >
                    <option value="">Select role</option>
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="users-modal__field">
                  <label className="users-modal__label">
                    <Building2 size={13} style={{ marginRight: 4 }} />
                    Department
                  </label>
                  <select
                    className="users-modal__select"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                  >
                    <option value="">Select department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="IT">IT</option>
                    <option value="Admin">Admin</option>
                    <option value="Finance">Finance</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="users-modal__footer">
              <button className="users-modal__btn users-modal__btn--secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="users-modal__btn users-modal__btn--primary"
                disabled={!canCreateUser}
                onClick={handleCreateUser}
              >
                <UserPlus size={16} />
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
