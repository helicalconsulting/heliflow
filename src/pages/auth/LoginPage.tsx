import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Eye, EyeOff, AlertCircle, Sun, Moon } from 'lucide-react';
import { isVendor } from '../../utils/rbac';
import heliflowLogo from '../../assets/heliflow.png';
import './LoginPage.css';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, roles } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVendorMode, setIsVendorMode] = useState(false);

  if (!isLoading && isAuthenticated) {
    return isVendor(roles) ? <Navigate to="/vendor/dashboard" replace /> : <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ username: username.trim(), password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredentials = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="sap-login">
      {/* ── Left Panel: Branding ── */}
      <div className="sap-login__brand-panel">
        <div className="sap-login__brand-content">
          {/* Heliflow brand logo */}
          <div className="sap-login__logo">
            <img src={heliflowLogo} alt="Heliflow" className="sap-login__logo-icon" />
          </div>

          <h1 className="sap-login__brand-title">Heliflow</h1>
          <p className="sap-login__brand-tagline">
            Digital Procurement & RFQ Workflow Platform
          </p>

          <div className="sap-login__brand-divider" />

          <ul className="sap-login__features">
            <li>
              <span className="sap-login__feature-icon">◆</span>
              End-to-end RFQ lifecycle management
            </li>
            <li>
              <span className="sap-login__feature-icon">◆</span>
              Automated quotation comparison & scoring
            </li>
            <li>
              <span className="sap-login__feature-icon">◆</span>
              Multi-level approval workflows
            </li>
            <li>
              <span className="sap-login__feature-icon">◆</span>
              Vendor portal & performance tracking
            </li>
          </ul>
        </div>

        <div className="sap-login__brand-footer">
          <span>© 2025 Heliflow Technologies</span>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="sap-login__form-panel">
        {/* Theme toggle */}
        <button
          className="sap-login__theme-toggle"
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="sap-login__form-container">
          {/* Mobile logo (hidden on desktop) */}
          <div className="sap-login__mobile-logo">
            <img src={heliflowLogo} alt="Heliflow" className="sap-login__mobile-logo-icon" />
            <span className="sap-login__mobile-title">Heliflow</span>
          </div>

          {/* Tab Toggle */}
          <div className="sap-login__tab-toggle">
            <button
              type="button"
              className={`sap-login__tab ${!isVendorMode ? 'sap-login__tab--active' : ''}`}
              onClick={() => {
                setIsVendorMode(false);
                setError('');
              }}
            >
              Employee
            </button>
            <button
              type="button"
              className={`sap-login__tab ${isVendorMode ? 'sap-login__tab--active' : ''}`}
              onClick={() => {
                setIsVendorMode(true);
                setError('');
              }}
            >
              Vendor
            </button>
          </div>

          <div className="sap-login__form-header">
            <h2 className="sap-login__form-title">
              {isVendorMode ? 'Vendor Portal' : 'Sign In'}
            </h2>
            <p className="sap-login__form-subtitle">
              {isVendorMode
                ? 'Enter your vendor credentials to access the portal'
                : 'Enter your credentials to access the platform'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="sap-login__error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="sap-login__form" onSubmit={handleSubmit}>
            <div className="sap-field">
              <label className="sap-field__label" htmlFor="login-username">
                Username <span className="sap-field__required">*</span>
              </label>
              <input
                id="login-username"
                className="sap-field__input"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                disabled={isSubmitting}
              />
            </div>

            <div className="sap-field">
              <label className="sap-field__label" htmlFor="login-password">
                Password <span className="sap-field__required">*</span>
              </label>
              <div className="sap-field__input-wrap">
                <input
                  id="login-password"
                  className="sap-field__input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="sap-field__eye"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="sap-login__submit"
              disabled={isSubmitting}
              id="login-submit-btn"
            >
              {isSubmitting ? (
                <span className="sap-login__spinner" />
              ) : (
                'Log On'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="sap-login__demo">
            <div className="sap-login__demo-header">
              <span className="sap-login__demo-line" />
              <span className="sap-login__demo-label">
                {isVendorMode ? 'Vendor Accounts' : 'Demo Users'}
              </span>
              <span className="sap-login__demo-line" />
            </div>

            <div className="sap-login__demo-list">
              {isVendorMode ? (
                <>
                  <button
                    type="button"
                    className="sap-login__demo-btn"
                    onClick={() => fillCredentials('vendor1', 'vendor123')}
                  >
                    <span className="sap-login__demo-badge sap-login__demo-badge--vendor">V1</span>
                    <div className="sap-login__demo-info">
                      <span className="sap-login__demo-name">Acme Tech Solutions</span>
                      <span className="sap-login__demo-hint">vendor1 / vendor123</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="sap-login__demo-btn"
                    onClick={() => fillCredentials('vendor2', 'vendor123')}
                  >
                    <span className="sap-login__demo-badge sap-login__demo-badge--vendor">V2</span>
                    <div className="sap-login__demo-info">
                      <span className="sap-login__demo-name">Global Supply Corp</span>
                      <span className="sap-login__demo-hint">vendor2 / vendor123</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="sap-login__demo-btn"
                    onClick={() => fillCredentials('vendor3', 'vendor123')}
                  >
                    <span className="sap-login__demo-badge sap-login__demo-badge--vendor">V3</span>
                    <div className="sap-login__demo-info">
                      <span className="sap-login__demo-name">Quality Parts Ltd</span>
                      <span className="sap-login__demo-hint">vendor3 / vendor123</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="sap-login__demo-btn"
                    onClick={() => fillCredentials('admin', 'admin123')}
                  >
                    <span className="sap-login__demo-badge sap-login__demo-badge--admin">SA</span>
                    <div className="sap-login__demo-info">
                      <span className="sap-login__demo-name">System Administrator</span>
                      <span className="sap-login__demo-hint">admin / admin123</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="sap-login__demo-btn"
                    onClick={() => fillCredentials('procurement', 'proc123')}
                  >
                    <span className="sap-login__demo-badge sap-login__demo-badge--proc">PM</span>
                    <div className="sap-login__demo-info">
                      <span className="sap-login__demo-name">Procurement Manager</span>
                      <span className="sap-login__demo-hint">procurement / proc123</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="sap-login__demo-btn"
                    onClick={() => fillCredentials('finance', 'fin123')}
                  >
                    <span className="sap-login__demo-badge sap-login__demo-badge--fin">FA</span>
                    <div className="sap-login__demo-info">
                      <span className="sap-login__demo-name">Finance Approver</span>
                      <span className="sap-login__demo-hint">finance / fin123</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
