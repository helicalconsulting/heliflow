import { useState, useMemo, useCallback } from 'react';
import {
  Shield,
  Search,
  Eye,
  Edit3,
  Plus,
  X,
  Check,
  Lock,
  Unlock,
  Users,
  Crown,
  Settings,
  FileCheck,
  UserCog,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
  Info,
  ShieldPlus,
  Type,
  AlignLeft,
} from 'lucide-react';
import './RolesPermissionsPage.css';

// ─── Types ──────────────────────────────────────────────────

type RoleName = 'Super Admin' | 'Administrator' | 'Manager' | 'Finance Approver' | 'Staff';

interface ModulePermission {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canApprove: boolean;
}

interface RoleData {
  id: number;
  roleName: RoleName;
  description: string;
  userCount: number;
  isSystem: boolean;
  permissions: ModulePermission[];
  createdAt: string;
}

// ─── Mock Data ──────────────────────────────────────────────

const MODULES = [
  'Dashboard',
  'RFQ',
  'Quotations',
  'Purchase Orders',
  'Vendors',
  'Approvals',
  'Documents',
  'Notifications',
  'Audit Trail',
  'User Management',
  'Roles & Permissions',
  'Approval Levels',
];

const MOCK_ROLES: RoleData[] = [
  {
    id: 1,
    roleName: 'Super Admin',
    description: 'Full system access with all permissions enabled. Cannot be modified or deleted.',
    userCount: 1,
    isSystem: true,
    createdAt: '2024-01-01',
    permissions: MODULES.map((m) => ({ module: m, canView: true, canCreate: true, canApprove: true })),
  },
  {
    id: 2,
    roleName: 'Administrator',
    description: 'System administration with user and configuration management capabilities.',
    userCount: 2,
    isSystem: true,
    createdAt: '2024-01-01',
    permissions: MODULES.map((m) => ({
      module: m,
      canView: true,
      canCreate: !['Audit Trail'].includes(m),
      canApprove: !['Audit Trail', 'Notifications'].includes(m),
    })),
  },
  {
    id: 3,
    roleName: 'Manager',
    description: 'Department management with procurement and approval workflows.',
    userCount: 3,
    isSystem: false,
    createdAt: '2024-01-15',
    permissions: MODULES.map((m) => ({
      module: m,
      canView: !['User Management', 'Roles & Permissions', 'Approval Levels'].includes(m),
      canCreate: ['Dashboard', 'RFQ', 'Quotations', 'Purchase Orders', 'Vendors', 'Documents'].includes(m),
      canApprove: ['RFQ', 'Quotations', 'Purchase Orders', 'Approvals'].includes(m),
    })),
  },
  {
    id: 4,
    roleName: 'Finance Approver',
    description: 'Financial review and approval authority for procurement transactions.',
    userCount: 2,
    isSystem: false,
    createdAt: '2024-02-10',
    permissions: MODULES.map((m) => ({
      module: m,
      canView: ['Dashboard', 'RFQ', 'Quotations', 'Purchase Orders', 'Approvals', 'Audit Trail', 'Notifications'].includes(m),
      canCreate: false,
      canApprove: ['Purchase Orders', 'Approvals'].includes(m),
    })),
  },
  {
    id: 5,
    roleName: 'Staff',
    description: 'Basic access for day-to-day procurement activities and request creation.',
    userCount: 4,
    isSystem: false,
    createdAt: '2024-03-01',
    permissions: MODULES.map((m) => ({
      module: m,
      canView: ['Dashboard', 'RFQ', 'Quotations', 'Vendors', 'Documents', 'Notifications'].includes(m),
      canCreate: ['RFQ', 'Documents'].includes(m),
      canApprove: false,
    })),
  },
];

const ROLE_ICON_MAP: Record<RoleName, React.ReactNode> = {
  'Super Admin': <Crown size={20} />,
  Administrator: <Settings size={20} />,
  Manager: <UserCog size={20} />,
  'Finance Approver': <FileCheck size={20} />,
  Staff: <Users size={20} />,
};

const ROLE_CLASS_MAP: Record<RoleName, string> = {
  'Super Admin': 'super-admin',
  Administrator: 'administrator',
  Manager: 'manager',
  'Finance Approver': 'finance-approver',
  Staff: 'staff',
};

// ─── Component ──────────────────────────────────────────────

export default function RolesPermissionsPage() {
  const [search, setSearch] = useState('');
  const [roles, setRoles] = useState(MOCK_ROLES);
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [editPermissions, setEditPermissions] = useState<ModulePermission[]>([]);

  // Create Role modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRolePerms, setNewRolePerms] = useState<ModulePermission[]>(
    MODULES.map((m) => ({ module: m, canView: false, canCreate: false, canApprove: false }))
  );

  // Summary
  const summary = useMemo(
    () => ({
      totalRoles: roles.length,
      totalPermissions: roles.reduce((sum, r) => sum + r.permissions.filter((p) => p.canView || p.canCreate || p.canApprove).length * 3, 0),
      systemRoles: roles.filter((r) => r.isSystem).length,
      customRoles: roles.filter((r) => !r.isSystem).length,
    }),
    [roles]
  );

  // Filter
  const filtered = useMemo(() => {
    if (!search.trim()) return roles;
    const q = search.toLowerCase();
    return roles.filter(
      (r) =>
        r.roleName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [roles, search]);

  // Toggle expand
  const toggleExpand = useCallback((roleId: number) => {
    setExpandedRole((prev) => (prev === roleId ? null : roleId));
  }, []);

  // Open edit modal
  const openEditModal = useCallback((role: RoleData) => {
    setEditingRole(role);
    setEditPermissions(role.permissions.map((p) => ({ ...p })));
  }, []);

  // Toggle a permission in the edit modal
  const togglePermission = useCallback(
    (moduleIndex: number, field: 'canView' | 'canCreate' | 'canApprove') => {
      setEditPermissions((prev) =>
        prev.map((p, i) => {
          if (i !== moduleIndex) return p;
          const updated = { ...p, [field]: !p[field] };
          // If removing view, also remove create and approve
          if (field === 'canView' && !updated.canView) {
            updated.canCreate = false;
            updated.canApprove = false;
          }
          // If enabling create or approve, also enable view
          if ((field === 'canCreate' || field === 'canApprove') && updated[field]) {
            updated.canView = true;
          }
          return updated;
        })
      );
    },
    []
  );

  // Save permissions
  const savePermissions = useCallback(() => {
    if (!editingRole) return;
    setRoles((prev) =>
      prev.map((r) => (r.id === editingRole.id ? { ...r, permissions: editPermissions } : r))
    );
    setEditingRole(null);
  }, [editingRole, editPermissions]);

  // Toggle a permission in the create modal
  const toggleNewPerm = useCallback(
    (moduleIndex: number, field: 'canView' | 'canCreate' | 'canApprove') => {
      setNewRolePerms((prev) =>
        prev.map((p, i) => {
          if (i !== moduleIndex) return p;
          const updated = { ...p, [field]: !p[field] };
          if (field === 'canView' && !updated.canView) {
            updated.canCreate = false;
            updated.canApprove = false;
          }
          if ((field === 'canCreate' || field === 'canApprove') && updated[field]) {
            updated.canView = true;
          }
          return updated;
        })
      );
    },
    []
  );

  // Open create modal
  const openCreateModal = useCallback(() => {
    setNewRoleName('');
    setNewRoleDesc('');
    setNewRolePerms(MODULES.map((m) => ({ module: m, canView: false, canCreate: false, canApprove: false })));
    setShowCreateModal(true);
  }, []);

  // Create new role
  const handleCreateRole = useCallback(() => {
    if (!newRoleName.trim()) return;
    const newRole: RoleData = {
      id: Date.now(),
      roleName: newRoleName.trim() as RoleName,
      description: newRoleDesc.trim() || `Custom role: ${newRoleName.trim()}`,
      userCount: 0,
      isSystem: false,
      permissions: newRolePerms,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRoles((prev) => [...prev, newRole]);
    setShowCreateModal(false);
  }, [newRoleName, newRoleDesc, newRolePerms]);

  // Permission count helpers
  const getPermCount = (perms: ModulePermission[]) => {
    let count = 0;
    for (const p of perms) {
      if (p.canView) count++;
      if (p.canCreate) count++;
      if (p.canApprove) count++;
    }
    return count;
  };

  const totalPossible = MODULES.length * 3;

  return (
    <div className="roles-page">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="roles-page__header">
        <div className="roles-page__header-left">
          <h1>Roles & Permissions</h1>
          <p>Manage roles, define access levels, and configure module permissions</p>
        </div>
        <button className="roles-page__add-btn" onClick={openCreateModal}>
          <Plus size={18} />
          Create Role
        </button>
      </div>

      {/* ── Summary Cards ──────────────────────────────────── */}
      <div className="roles-summary">
        <div className="roles-summary-card">
          <div className="roles-summary-card__icon roles-summary-card__icon--total">
            <Shield size={22} />
          </div>
          <div className="roles-summary-card__info">
            <span className="roles-summary-card__value">{summary.totalRoles}</span>
            <span className="roles-summary-card__label">Total Roles</span>
          </div>
        </div>
        <div className="roles-summary-card">
          <div className="roles-summary-card__icon roles-summary-card__icon--perms">
            <Lock size={22} />
          </div>
          <div className="roles-summary-card__info">
            <span className="roles-summary-card__value">{MODULES.length}</span>
            <span className="roles-summary-card__label">Modules</span>
          </div>
        </div>
        <div className="roles-summary-card">
          <div className="roles-summary-card__icon roles-summary-card__icon--system">
            <ShieldCheck size={22} />
          </div>
          <div className="roles-summary-card__info">
            <span className="roles-summary-card__value">{summary.systemRoles}</span>
            <span className="roles-summary-card__label">System Roles</span>
          </div>
        </div>
        <div className="roles-summary-card">
          <div className="roles-summary-card__icon roles-summary-card__icon--custom">
            <ShieldAlert size={22} />
          </div>
          <div className="roles-summary-card__info">
            <span className="roles-summary-card__value">{summary.customRoles}</span>
            <span className="roles-summary-card__label">Custom Roles</span>
          </div>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="roles-toolbar">
        <div className="roles-toolbar__search">
          <Search size={16} className="roles-toolbar__search-icon" />
          <input
            type="text"
            placeholder="Search roles by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Role Cards ─────────────────────────────────────── */}
      <div className="roles-cards">
        {filtered.map((role) => {
          const isExpanded = expandedRole === role.id;
          const permCount = getPermCount(role.permissions);
          const permPercent = Math.round((permCount / totalPossible) * 100);

          return (
            <div
              key={role.id}
              className={`roles-card ${isExpanded ? 'roles-card--expanded' : ''}`}
            >
              {/* Card Header */}
              <div className="roles-card__header" onClick={() => toggleExpand(role.id)}>
                <div className="roles-card__header-left">
                  <div className={`roles-card__icon roles-card__icon--${ROLE_CLASS_MAP[role.roleName]}`}>
                    {ROLE_ICON_MAP[role.roleName]}
                  </div>
                  <div className="roles-card__meta">
                    <div className="roles-card__name-row">
                      <span className="roles-card__name">{role.roleName}</span>
                      {role.isSystem && (
                        <span className="roles-card__system-badge">
                          <Lock size={10} />
                          System
                        </span>
                      )}
                    </div>
                    <span className="roles-card__desc">{role.description}</span>
                  </div>
                </div>
                <div className="roles-card__header-right">
                  <div className="roles-card__stats">
                    <div className="roles-card__stat">
                      <Users size={14} />
                      <span>{role.userCount} user{role.userCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="roles-card__perm-bar-wrap">
                      <div className="roles-card__perm-bar">
                        <div
                          className={`roles-card__perm-fill roles-card__perm-fill--${ROLE_CLASS_MAP[role.roleName]}`}
                          style={{ width: `${permPercent}%` }}
                        />
                      </div>
                      <span className="roles-card__perm-label">{permCount}/{totalPossible} perms</span>
                    </div>
                  </div>
                  <div className="roles-card__actions">
                    {!role.isSystem && (
                      <button
                        className="roles-card__action-btn"
                        title="Edit Permissions"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(role);
                        }}
                      >
                        <Edit3 size={15} />
                      </button>
                    )}
                    <button
                      className="roles-card__action-btn"
                      title="View Permissions"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(role.id);
                      }}
                    >
                      <Eye size={15} />
                    </button>
                    <div className="roles-card__chevron">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Permission Matrix */}
              {isExpanded && (
                <div className="roles-card__body">
                  <div className="roles-perm-matrix">
                    <div className="roles-perm-matrix__header">
                      <div className="roles-perm-matrix__module-col">Module</div>
                      <div className="roles-perm-matrix__perm-col">
                        <Eye size={13} />
                        <span>View</span>
                      </div>
                      <div className="roles-perm-matrix__perm-col">
                        <Plus size={13} />
                        <span>Create</span>
                      </div>
                      <div className="roles-perm-matrix__perm-col">
                        <Check size={13} />
                        <span>Approve</span>
                      </div>
                    </div>
                    {role.permissions.map((perm, idx) => (
                      <div
                        key={perm.module}
                        className={`roles-perm-matrix__row ${idx % 2 === 0 ? 'roles-perm-matrix__row--striped' : ''}`}
                      >
                        <div className="roles-perm-matrix__module-col">
                          <span className="roles-perm-matrix__module-name">{perm.module}</span>
                        </div>
                        <div className="roles-perm-matrix__perm-col">
                          <span className={`roles-perm-chip ${perm.canView ? 'roles-perm-chip--granted' : 'roles-perm-chip--denied'}`}>
                            {perm.canView ? <Unlock size={12} /> : <Lock size={12} />}
                            {perm.canView ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="roles-perm-matrix__perm-col">
                          <span className={`roles-perm-chip ${perm.canCreate ? 'roles-perm-chip--granted' : 'roles-perm-chip--denied'}`}>
                            {perm.canCreate ? <Unlock size={12} /> : <Lock size={12} />}
                            {perm.canCreate ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="roles-perm-matrix__perm-col">
                          <span className={`roles-perm-chip ${perm.canApprove ? 'roles-perm-chip--granted' : 'roles-perm-chip--denied'}`}>
                            {perm.canApprove ? <Unlock size={12} /> : <Lock size={12} />}
                            {perm.canApprove ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {!role.isSystem && (
                    <div className="roles-card__body-actions">
                      <button
                        className="roles-card__edit-btn"
                        onClick={() => openEditModal(role)}
                      >
                        <Edit3 size={15} />
                        Edit Permissions
                      </button>
                    </div>
                  )}
                  {role.isSystem && (
                    <div className="roles-card__system-notice">
                      <Info size={14} />
                      <span>System roles cannot be modified. All permissions are locked.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="roles-empty">
          <div className="roles-empty__icon">
            <Shield size={48} />
          </div>
          <div className="roles-empty__title">No roles found</div>
          <div className="roles-empty__desc">
            {search ? 'Try adjusting your search.' : 'Create a new role to get started.'}
          </div>
        </div>
      )}

      {/* ── Edit Permissions Modal ──────────────────────────── */}
      {editingRole && (
        <div className="roles-modal-backdrop" onClick={() => setEditingRole(null)}>
          <div className="roles-modal" onClick={(e) => e.stopPropagation()}>
            <div className="roles-modal__header">
              <div className="roles-modal__title">
                <Shield size={20} />
                <span>Edit Permissions — {editingRole.roleName}</span>
              </div>
              <button className="roles-modal__close" onClick={() => setEditingRole(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="roles-modal__info-bar">
              <Info size={14} />
              <span>Toggle permissions for each module. Disabling "View" will automatically disable "Create" and "Approve" for that module.</span>
            </div>

            <div className="roles-modal__body">
              <div className="roles-modal-matrix">
                <div className="roles-modal-matrix__header">
                  <div className="roles-modal-matrix__module-col">Module</div>
                  <div className="roles-modal-matrix__perm-col">View</div>
                  <div className="roles-modal-matrix__perm-col">Create</div>
                  <div className="roles-modal-matrix__perm-col">Approve</div>
                </div>
                {editPermissions.map((perm, idx) => (
                  <div
                    key={perm.module}
                    className={`roles-modal-matrix__row ${idx % 2 === 0 ? 'roles-modal-matrix__row--striped' : ''}`}
                  >
                    <div className="roles-modal-matrix__module-col">
                      <span className="roles-modal-matrix__module-name">{perm.module}</span>
                    </div>
                    <div className="roles-modal-matrix__perm-col">
                      <div
                        className="roles-modal-toggle"
                        onClick={() => togglePermission(idx, 'canView')}
                      >
                        <div className={`roles-modal-toggle__track ${perm.canView ? 'roles-modal-toggle__track--active' : ''}`}>
                          <div className="roles-modal-toggle__knob" />
                        </div>
                      </div>
                    </div>
                    <div className="roles-modal-matrix__perm-col">
                      <div
                        className="roles-modal-toggle"
                        onClick={() => togglePermission(idx, 'canCreate')}
                      >
                        <div className={`roles-modal-toggle__track ${perm.canCreate ? 'roles-modal-toggle__track--active' : ''}`}>
                          <div className="roles-modal-toggle__knob" />
                        </div>
                      </div>
                    </div>
                    <div className="roles-modal-matrix__perm-col">
                      <div
                        className="roles-modal-toggle"
                        onClick={() => togglePermission(idx, 'canApprove')}
                      >
                        <div className={`roles-modal-toggle__track ${perm.canApprove ? 'roles-modal-toggle__track--active' : ''}`}>
                          <div className="roles-modal-toggle__knob" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="roles-modal__footer">
              <button
                className="roles-modal__btn roles-modal__btn--secondary"
                onClick={() => setEditingRole(null)}
              >
                Cancel
              </button>
              <button
                className="roles-modal__btn roles-modal__btn--primary"
                onClick={savePermissions}
              >
                <Check size={16} />
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Role Modal ───────────────────────────────── */}
      {showCreateModal && (
        <div className="roles-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="roles-modal roles-modal--create" onClick={(e) => e.stopPropagation()}>
            <div className="roles-modal__header">
              <div className="roles-modal__title">
                <ShieldPlus size={20} />
                <span>Create New Role</span>
              </div>
              <button className="roles-modal__close" onClick={() => setShowCreateModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="roles-modal__body">
              {/* Role details section */}
              <div className="roles-create-fields">
                <div className="roles-create-field">
                  <label className="roles-create-field__label">
                    <Type size={13} style={{ marginRight: 4 }} />
                    Role Name <span>*</span>
                  </label>
                  <input
                    className="roles-create-field__input"
                    type="text"
                    placeholder="e.g. Procurement Lead"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                  />
                </div>
                <div className="roles-create-field">
                  <label className="roles-create-field__label">
                    <AlignLeft size={13} style={{ marginRight: 4 }} />
                    Description
                  </label>
                  <textarea
                    className="roles-create-field__textarea"
                    placeholder="Brief description of this role's responsibilities..."
                    rows={3}
                    value={newRoleDesc}
                    onChange={(e) => setNewRoleDesc(e.target.value)}
                  />
                </div>
              </div>

              {/* Permissions section */}
              <div className="roles-create-perms-section">
                <div className="roles-create-perms-section__title">
                  <Shield size={15} />
                  <span>Module Permissions</span>
                </div>
                <div className="roles-modal-matrix">
                  <div className="roles-modal-matrix__header">
                    <div className="roles-modal-matrix__module-col">Module</div>
                    <div className="roles-modal-matrix__perm-col">View</div>
                    <div className="roles-modal-matrix__perm-col">Create</div>
                    <div className="roles-modal-matrix__perm-col">Approve</div>
                  </div>
                  {newRolePerms.map((perm, idx) => (
                    <div
                      key={perm.module}
                      className={`roles-modal-matrix__row ${idx % 2 === 0 ? 'roles-modal-matrix__row--striped' : ''}`}
                    >
                      <div className="roles-modal-matrix__module-col">
                        <span className="roles-modal-matrix__module-name">{perm.module}</span>
                      </div>
                      <div className="roles-modal-matrix__perm-col">
                        <div
                          className="roles-modal-toggle"
                          onClick={() => toggleNewPerm(idx, 'canView')}
                        >
                          <div className={`roles-modal-toggle__track ${perm.canView ? 'roles-modal-toggle__track--active' : ''}`}>
                            <div className="roles-modal-toggle__knob" />
                          </div>
                        </div>
                      </div>
                      <div className="roles-modal-matrix__perm-col">
                        <div
                          className="roles-modal-toggle"
                          onClick={() => toggleNewPerm(idx, 'canCreate')}
                        >
                          <div className={`roles-modal-toggle__track ${perm.canCreate ? 'roles-modal-toggle__track--active' : ''}`}>
                            <div className="roles-modal-toggle__knob" />
                          </div>
                        </div>
                      </div>
                      <div className="roles-modal-matrix__perm-col">
                        <div
                          className="roles-modal-toggle"
                          onClick={() => toggleNewPerm(idx, 'canApprove')}
                        >
                          <div className={`roles-modal-toggle__track ${perm.canApprove ? 'roles-modal-toggle__track--active' : ''}`}>
                            <div className="roles-modal-toggle__knob" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="roles-modal__footer">
              <button
                className="roles-modal__btn roles-modal__btn--secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="roles-modal__btn roles-modal__btn--primary"
                disabled={!newRoleName.trim()}
                onClick={handleCreateRole}
              >
                <ShieldPlus size={16} />
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
