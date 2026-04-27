import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './router/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import RFQPage from './pages/rfq/RFQPage';
import CreateRFQPage from './pages/rfq/CreateRFQPage';
import QuotationsPage from './pages/quotations/QuotationsPage';
import UsersPage from './pages/admin/UsersPage';
import RolesPermissionsPage from './pages/admin/RolesPermissionsPage';
import ApprovalsPage from './pages/approvals/ApprovalsPage';
import ApprovalLevelsPage from './pages/admin/ApprovalLevelsPage';
import VendorsPage from './pages/vendors/VendorsPage';
import PurchaseOrdersPage from './pages/purchase-orders/PurchaseOrdersPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import AuditTrailPage from './pages/audit/AuditTrailPage';
import VendorPortalLayout from './components/layout/VendorPortalLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorRFQsPage from './pages/vendor/VendorRFQsPage';
import VendorQuotationsPage from './pages/vendor/VendorQuotationsPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Vendor Portal Routes */}
            <Route element={<ProtectedRoute requireVendor />}>
              <Route element={<AppLayout />}>
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/rfqs" element={<VendorRFQsPage />} />
                <Route path="/vendor/quotations" element={<VendorQuotationsPage />} />
              </Route>
            </Route>

            {/* Protected — wrapped in AppLayout (Sidebar + TopBar) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/rfq" element={<RFQPage />} />
                <Route path="/rfq/create" element={<CreateRFQPage />} />
                <Route path="/quotations" element={<QuotationsPage />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/roles-permissions" element={<RolesPermissionsPage />} />
                <Route path="/approvals" element={<ApprovalsPage />} />
                <Route path="/admin/approval-levels" element={<ApprovalLevelsPage />} />
                <Route path="/vendors" element={<VendorsPage />} />
                <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/audit" element={<AuditTrailPage />} />
              </Route>
            </Route>

            {/* Catch-all → redirect to dashboard (which guards itself) */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
