import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, error, setError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loginMode, setLoginMode] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffPin, setStaffPin] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setStaffPin('');
    setLoginMode('customer');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let result;
    if (isLogin) {
      result = await login(email, password, {
        staffLogin: loginMode === 'staff',
        staffPin: loginMode === 'staff' ? staffPin : undefined,
      });
    } else {
      result = await register(name, email, password);
    }

    setLoading(false);
    if (result.success) {
      resetForm();
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '28px', marginBottom: '0.5rem', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin
            ? loginMode === 'staff'
              ? 'Staff portal access — requires your staff credentials and access code'
              : 'Sign in to access your culinary requests'
            : 'Join nmnm for the ultimate dining experience'}
        </p>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {isLogin && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              background: 'rgba(255,255,255,0.03)',
              padding: '0.35rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
            }}
          >
            <button
              type="button"
              onClick={() => { setLoginMode('customer'); setStaffPin(''); setError(''); }}
              style={{
                padding: '0.65rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                background: loginMode === 'customer' ? 'linear-gradient(135deg, var(--primary-purple-dark), var(--primary-purple))' : 'transparent',
                color: loginMode === 'customer' ? '#fff' : 'var(--text-muted)',
              }}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('staff'); setError(''); }}
              style={{
                padding: '0.65rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: loginMode === 'staff' ? 'linear-gradient(135deg, #7f1d1d, #ef4444)' : 'transparent',
                color: loginMode === 'staff' ? '#fff' : 'var(--text-muted)',
              }}
            >
              <ShieldCheck size={14} /> Staff Portal
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {isLogin && loginMode === 'staff' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Staff Access Code *
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#f87171' }} />
                <input
                  type="password"
                  required
                  placeholder="Enter staff-only access code"
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', borderColor: 'rgba(239, 68, 68, 0.35)' }}
                />
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Only authorized nmnm staff may sign in here. You must use an admin account and the correct staff access code.
              </p>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem' }}>
            {loading ? 'Please wait...' : isLogin ? (loginMode === 'staff' ? 'Staff Sign In' : 'Sign In') : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              resetForm();
            }}
            style={{ color: 'var(--text-accent)', cursor: 'pointer', fontWeight: '600' }}
          >
            {isLogin ? 'Sign Up Now' : 'Sign In Now'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
