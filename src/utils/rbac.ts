/**
 * Role-Based Access Control (RBAC) Utilities
 * Handles permission checking and role-based visibility
 */

// ─── Role Definitions ───────────────────────────────────────

export const RoleName = {
  SUPER_ADMIN: 'Super Admin',
  PROCUREMENT_MANAGER: 'Procurement Manager',
  FINANCE_MANAGER: 'Finance Manager',
  FINANCE_APPROVER: 'Finance Approver',
  VENDOR: 'Vendor',
} as const;

// ─── Module Permissions ─────────────────────────────────────

export interface ModulePermission {
  canView: boolean;
  canCreate: boolean;
  canApprove: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// ─── Module Access Configuration by Role ────────────────────
const MODULE_PERMISSIONS: Record<string, Record<string, ModulePermission>> = {
  [RoleName.SUPER_ADMIN]: {
    RFQ: { canView: true, canCreate: true, canApprove: true, canEdit: true, canDelete: true },
    Quotation: { canView: true, canCreate: true, canApprove: true, canEdit: true, canDelete: true },
    PurchaseOrder: { canView: true, canCreate: true, canApprove: true, canEdit: true, canDelete: true },
    Vendor: { canView: true, canCreate: true, canApprove: true, canEdit: true, canDelete: true },
    ApprovalManagement: { canView: true, canCreate: true, canApprove: true, canEdit: true, canDelete: true },
    UserManagement: { canView: true, canCreate: true, canApprove: true, canEdit: true, canDelete: true },
    Reports: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    AuditTrail: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
  },
  [RoleName.PROCUREMENT_MANAGER]: {
    RFQ: { canView: true, canCreate: true, canApprove: true, canEdit: true, canDelete: false },
    Quotation: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    PurchaseOrder: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    Vendor: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    ApprovalManagement: { canView: false, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    UserManagement: { canView: false, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    Reports: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    AuditTrail: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
  },
  [RoleName.FINANCE_MANAGER]: {
    RFQ: { canView: true, canCreate: false, canApprove: true, canEdit: false, canDelete: false },
    Quotation: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    PurchaseOrder: { canView: true, canCreate: true, canApprove: true, canEdit: true, canDelete: false },
    Vendor: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    ApprovalManagement: { canView: false, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    UserManagement: { canView: false, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    Reports: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    AuditTrail: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
  },
  [RoleName.FINANCE_APPROVER]: {
    RFQ: { canView: true, canCreate: false, canApprove: true, canEdit: false, canDelete: false },
    Quotation: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    PurchaseOrder: { canView: true, canCreate: false, canApprove: true, canEdit: false, canDelete: false },
    Vendor: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    ApprovalManagement: { canView: false, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    UserManagement: { canView: false, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    Reports: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    AuditTrail: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
  },
  [RoleName.VENDOR]: {
    RFQ: { canView: true, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    Quotation: { canView: true, canCreate: true, canApprove: false, canEdit: true, canDelete: false },
    PurchaseOrder: { canView: false, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    Vendor: { canView: false, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    ApprovalManagement: { canView: false, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    UserManagement: { canView: false, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    Reports: { canView: false, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
    AuditTrail: { canView: false, canCreate: false, canApprove: false, canEdit: false, canDelete: false },
  },
};

// ─── Navigation Menu Config by Role ─────────────────────────

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
  roles: (typeof RoleName)[keyof typeof RoleName][];
}

export const NAVIGATION_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    roles: [RoleName.SUPER_ADMIN, RoleName.PROCUREMENT_MANAGER, RoleName.FINANCE_MANAGER, RoleName.FINANCE_APPROVER],
  },
  {
    id: 'rfq',
    label: 'RFQ Management',
    path: '/rfq',
    roles: [RoleName.SUPER_ADMIN, RoleName.PROCUREMENT_MANAGER, RoleName.FINANCE_MANAGER, RoleName.FINANCE_APPROVER],
    children: [
      { id: 'rfq-list', label: 'RFQ List', path: '/rfq', roles: [RoleName.SUPER_ADMIN, RoleName.PROCUREMENT_MANAGER, RoleName.FINANCE_MANAGER, RoleName.FINANCE_APPROVER] },
      { id: 'rfq-create', label: 'Create RFQ', path: '/rfq/create', roles: [RoleName.SUPER_ADMIN, RoleName.PROCUREMENT_MANAGER] },
    ],
  },
  {
    id: 'quotations',
    label: 'Quotations',
    path: '/quotations',
    roles: [RoleName.SUPER_ADMIN, RoleName.PROCUREMENT_MANAGER, RoleName.FINANCE_MANAGER],
  },
  {
    id: 'purchase-orders',
    label: 'Purchase Orders',
    path: '/purchase-orders',
    roles: [RoleName.SUPER_ADMIN, RoleName.FINANCE_MANAGER, RoleName.FINANCE_APPROVER],
  },
  {
    id: 'approvals',
    label: 'Approvals',
    path: '/approvals',
    roles: [RoleName.SUPER_ADMIN, RoleName.PROCUREMENT_MANAGER, RoleName.FINANCE_MANAGER, RoleName.FINANCE_APPROVER],
  },
  {
    id: 'vendors',
    label: 'Vendors',
    path: '/vendors',
    roles: [RoleName.SUPER_ADMIN, RoleName.PROCUREMENT_MANAGER],
  },
  {
    id: 'admin',
    label: 'Administration',
    path: '/admin',
    roles: [RoleName.SUPER_ADMIN],
    children: [
      { id: 'users', label: 'Users', path: '/admin/users', roles: [RoleName.SUPER_ADMIN] },
      { id: 'roles', label: 'Roles & Permissions', path: '/admin/roles-permissions', roles: [RoleName.SUPER_ADMIN] },
      { id: 'approval-levels', label: 'Approval Levels', path: '/admin/approval-levels', roles: [RoleName.SUPER_ADMIN] },
    ],
  },
];

export const VENDOR_NAVIGATION_MENU: MenuItem[] = [
  {
    id: 'vendor-dashboard',
    label: 'Dashboard',
    path: '/vendor/dashboard',
    roles: [RoleName.VENDOR],
  },
  {
    id: 'vendor-rfqs',
    label: 'My RFQs',
    path: '/vendor/rfqs',
    roles: [RoleName.VENDOR],
  },
  {
    id: 'vendor-quotations',
    label: 'My Quotations',
    path: '/vendor/quotations',
    roles: [RoleName.VENDOR],
  },
];

// ─── Permission Check Functions ─────────────────────────────

export function getModulePermission(role: string, module: string): ModulePermission {
  return (
    MODULE_PERMISSIONS[role]?.[module] || {
      canView: false,
      canCreate: false,
      canApprove: false,
      canEdit: false,
      canDelete: false,
    }
  );
}

export function canAccess(roles: string[], module: string, action: keyof Omit<ModulePermission, 'canView'>): boolean {
  return roles.some((role) => {
    const permission = getModulePermission(role, module);
    return permission[action] === true;
  });
}

export function canView(roles: string[], module: string): boolean {
  return roles.some((role) => {
    const permission = getModulePermission(role, module);
    return permission.canView === true;
  });
}

export function canCreate(roles: string[], module: string): boolean {
  return canAccess(roles, module, 'canCreate');
}

export function canApprove(roles: string[], module: string): boolean {
  return canAccess(roles, module, 'canApprove');
}

export function getAccessibleMenuItems(roles: string[]): MenuItem[] {
  return NAVIGATION_MENU.filter((item) => item.roles.some((r) => roles.includes(r))).map((item) => ({
    ...item,
    children: item.children?.filter((child) => child.roles.some((r) => roles.includes(r))),
  }));
}

export function getVendorAccessibleMenuItems(roles: string[]): MenuItem[] {
  return VENDOR_NAVIGATION_MENU.filter((item) => item.roles.some((r) => roles.includes(r))).map((item) => ({
    ...item,
    children: item.children?.filter((child) => child.roles.some((r) => roles.includes(r))),
  }));
}

// ─── Helper: Check if user is vendor ────────────────────────

export function isVendor(roles: string[]): boolean {
  return roles.includes(RoleName.VENDOR);
}

export function isAdmin(roles: string[]): boolean {
  return roles.includes(RoleName.SUPER_ADMIN);
}

export function hasApprovalRole(roles: string[]): boolean {
  return roles.includes(RoleName.PROCUREMENT_MANAGER) || roles.includes(RoleName.FINANCE_MANAGER) || roles.includes(RoleName.FINANCE_APPROVER);
}
