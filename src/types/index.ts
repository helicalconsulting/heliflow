// ─── Status Enums ───────────────────────────────────────────

export type RFQStatus = 'DRAFT' | 'SENT' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// ─── User & Auth ────────────────────────────────────────────

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  companyCode: string;
  department?: string;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  role?: Role;
}

export interface Role {
  id: number;
  roleName: string;
}

export interface Permission {
  id: number;
  roleId: number;
  module: string;
  canView: boolean;
  canApprove: boolean;
  canCreate: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  roles: string[];
}

export interface LoginPayload {
  username: string;
  password: string;
}

// ─── RFQ ────────────────────────────────────────────────────

export interface RFQ {
  id: number;
  rfqNumber: string;
  title: string;
  description?: string;
  createdBy: number;
  status: RFQStatus;
  createdAt: string;
  creator?: User;
  items?: RFQItem[];
  vendors?: RFQVendor[];
  quotations?: Quotation[];
}

export interface RFQItem {
  id: number;
  rfqId: number;
  itemName: string;
  description?: string;
  quantity: number;
  unit?: string;
  expectedDate?: string;
}

export interface RFQVendor {
  id: number;
  rfqId: number;
  vendorId: number;
  status: string;
  vendor?: Vendor;
}

// ─── Quotation ──────────────────────────────────────────────

export interface Quotation {
  id: number;
  rfqId: number;
  vendorId: number;
  totalPrice: number;
  leadTimeDays?: number;
  paymentTerms?: string;
  score?: number;
  status: string;
  submittedAt: string;
  vendor?: Vendor;
  items?: QuotationItem[];
}

export interface QuotationItem {
  id: number;
  quotationId: number;
  rfqItemId: number;
  unitPrice: number;
  totalPrice: number;
}

// ─── Vendor ─────────────────────────────────────────────────

export interface Vendor {
  id: number;
  name: string;
  email: string;
  createdBy: number;
  isActive: boolean;
  performance?: VendorPerformance;
}

export interface VendorPerformance {
  id: number;
  vendorId: number;
  avgQuality: number;
  avgDelivery: number;
  avgPriceScore: number;
  overallScore: number;
}

// ─── Purchase Order ─────────────────────────────────────────

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  rfqId: number;
  vendorId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  rfq?: RFQ;
  vendor?: Vendor;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: number;
  poId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ─── Approval ───────────────────────────────────────────────

export interface ApprovalLevel {
  id: number;
  module: string;
  levelNumber: number;
  requiredRole: string;
}

export interface RequestApproval {
  id: number;
  module: string;
  referenceId: number;
  levelId: number;
  status: ApprovalStatus;
  approverId?: number;
  level?: ApprovalLevel;
  approver?: User;
}

export interface ApprovalLog {
  id: number;
  requestId: number;
  levelId: number;
  approverId: number;
  action: string;
  comments?: string;
  createdAt: string;
}

// ─── Supporting ─────────────────────────────────────────────

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message?: string;
  isRead: boolean;
}

export interface AuditTrail {
  id: number;
  userId?: number;
  action: string;
  module?: string;
  createdAt: string;
  user?: User;
}

export interface Attachment {
  id: number;
  module: string;
  referenceId: string;
  fileType: string;
  filePath: string;
}
