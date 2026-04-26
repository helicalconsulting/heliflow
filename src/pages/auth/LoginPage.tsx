import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already logged in → go to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
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

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-page__bg">
        <div className="login-page__orb login-page__orb--1" />
        <div className="login-page__orb login-page__orb--2" />
        <div className="login-page__orb login-page__orb--3" />
      </div>

      <div className="login-card">
        {/* Logo / Brand */}
        <div className="login-card__header">
          <div className="login-card__logo">
            <Shield size={32} />
          </div>
          <h1 className="login-card__title">Heliflow</h1>
          <p className="login-card__subtitle">Digital RFQ Workflow Platform</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-card__error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="login-card__form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-field__label" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              className="login-field__input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div className="login-field">
            <label className="login-field__label" htmlFor="login-password">
              Password
            </label>
            <div className="login-field__password-wrap">
              <input
                id="login-password"
                className="login-field__input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="login-field__toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-card__submit"
            disabled={isSubmitting}
            id="login-submit-btn"
          >
            {isSubmitting ? (
              <span className="login-card__submit-loader" />
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="login-card__demo">
          <p className="login-card__demo-title">Demo Credentials</p>
          <div className="login-card__demo-grid">
            <button
              type="button"
              className="login-card__demo-chip"
              onClick={() => { setUsername('admin'); setPassword('admin123'); setError(''); }}
            >
              <span className="login-card__demo-role">Admin</span>
              <span className="login-card__demo-creds">admin / admin123</span>
            </button>
            <button
              type="button"
              className="login-card__demo-chip"
              onClick={() => { setUsername('procurement'); setPassword('proc123'); setError(''); }}
            >
              <span className="login-card__demo-role">Procurement</span>
              <span className="login-card__demo-creds">procurement / proc123</span>
            </button>
            <button
              type="button"
              className="login-card__demo-chip"
              onClick={() => { setUsername('finance'); setPassword('fin123'); setError(''); }}
            >
              <span className="login-card__demo-role">Finance</span>
              <span className="login-card__demo-creds">finance / fin123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
