/**
 * Custom Hooks for RBAC and Approval Workflow
 */

import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  canView,
  canCreate,
  canApprove,
  getModulePermission,
  isVendor,
  isAdmin,
  hasApprovalRole,
  getAccessibleMenuItems,
  getVendorAccessibleMenuItems,
  type ModulePermission,
} from '../utils/rbac';
import { MOCK_REQUEST_APPROVALS, MOCK_APPROVAL_LEVELS } from '../config/mockData';
import type { ApprovalLevel, RequestApproval } from '../types';

// ─── Hook: useRoleAccess ────────────────────────────────────

export function useRoleAccess() {
  const { roles } = useAuth();

  return useCallback(
    (module: string) => ({
      canView: canView(roles, module),
      canCreate: canCreate(roles, module),
      canApprove: canApprove(roles, module),
      canEdit: canEdit(roles, module),
    }),
    [roles]
  );
}

// ─── Hook: useModulePermission ──────────────────────────────

export function useModulePermission(module: string): ModulePermission {
  const { roles } = useAuth();

  if (!roles || roles.length === 0) {
    return {
      canView: false,
      canCreate: false,
      canApprove: false,
      canEdit: false,
      canDelete: false,
    };
  }

  const permissions = roles.map((role) => getModulePermission(role, module));
  return {
    canView: permissions.some((p) => p.canView),
    canCreate: permissions.some((p) => p.canCreate),
    canApprove: permissions.some((p) => p.canApprove),
    canEdit: permissions.some((p) => p.canEdit),
    canDelete: permissions.some((p) => p.canDelete),
  };
}

// ─── Hook: useRoleCheck ─────────────────────────────────────

export function useRoleCheck() {
  const { roles } = useAuth();

  return {
    isVendor: () => isVendor(roles),
    isAdmin: () => isAdmin(roles),
    hasApprovalRole: () => hasApprovalRole(roles),
    hasRole: (role: string) => roles.includes(role),
    hasAnyRole: (requiredRoles: string[]) => requiredRoles.some((r) => roles.includes(r)),
  };
}

// ─── Hook: useNavigationMenu ────────────────────────────────

export function useNavigationMenu() {
  const { roles } = useAuth();
  const roleCheck = useRoleCheck();

  const menu = roleCheck.isVendor() ? getVendorAccessibleMenuItems(roles) : getAccessibleMenuItems(roles);

  return menu;
}

// ─── Hook: useApprovalWorkflow ─────────────────────────────

export interface ApprovalWorkflowState {
  pendingApprovals: RequestApproval[];
  completedApprovals: RequestApproval[];
  approvalLevels: ApprovalLevel[];
  canApprove: boolean;
  getPendingApprovalsForUser: () => RequestApproval[];
  getApprovalStatus: (module: string, referenceId: number) => RequestApproval[];
  approveRequest: (requestId: number, comment?: string) => void;
  rejectRequest: (requestId: number, comment?: string) => void;
}

export function useApprovalWorkflow(): ApprovalWorkflowState {
  const { roles } = useAuth();
  const roleCheck = useRoleCheck();

  const pendingApprovals = MOCK_REQUEST_APPROVALS.filter((a) => a.status === 'PENDING');
  const completedApprovals = MOCK_REQUEST_APPROVALS.filter((a) => a.status !== 'PENDING');

  const getPendingApprovalsForUser = useCallback(() => {
    // Filter approvals where the required role matches user's role
    return pendingApprovals.filter((approval) => {
      const level = approval.level;
      if (!level) return false;
      return roles.includes(level.requiredRole);
    });
  }, [pendingApprovals, roles]);

  const getApprovalStatus = useCallback(
    (module: string, referenceId: number) => {
      return MOCK_REQUEST_APPROVALS.filter((a) => a.module === module && a.referenceId === referenceId);
    },
    []
  );

  const approveRequest = useCallback((requestId: number, comment?: string) => {
    console.log(`Approved request ${requestId} with comment: ${comment || 'No comment'}`);
  }, []);

  const rejectRequest = useCallback((requestId: number, comment?: string) => {
    console.log(`Rejected request ${requestId} with comment: ${comment || 'No comment'}`);
  }, []);

  return {
    pendingApprovals,
    completedApprovals,
    approvalLevels: MOCK_APPROVAL_LEVELS,
    canApprove: roleCheck.hasApprovalRole(),
    getPendingApprovalsForUser,
    getApprovalStatus,
    approveRequest,
    rejectRequest,
  };
}

// ─── Helper: canEdit function ──────────────────────────────

export function canEdit(roles: string[], module: string): boolean {
  return roles.some((role) => {
    const permission = getModulePermission(role, module);
    return permission.canEdit === true;
  });
}
