import React, { useState } from 'react';
import { ShoppingCart, User, LogOut, ShieldAlert, Menu as MenuIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

const Navbar = ({ activePage, setActivePage, onCartOpen, onAuthOpen }) => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLinkClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="nav-header">
      <div className="nav-container">
        
        {/* Logo */}
        <div style={{ cursor: 'pointer' }} onClick={() => handleLinkClick('home')}>
          <Logo />
        </div>

        {/* Navigation links */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <span
            style={{
              cursor: 'pointer',
              color: activePage === 'home' ? 'var(--text-accent)' : 'var(--text-main)',
              fontFamily: 'var(--font-serif)',
              fontSize: '15px',
              letterSpacing: '1px',
              transition: 'var(--transition-fast)',
              borderBottom: activePage === 'home' ? '2px solid var(--primary-purple)' : '2px solid transparent',
              paddingBottom: '4px'
            }}
            onClick={() => handleLinkClick('home')}
          >
            Home
          </span>
          <span
            style={{
              cursor: 'pointer',
              color: activePage === 'menu' ? 'var(--text-accent)' : 'var(--text-main)',
              fontFamily: 'var(--font-serif)',
              fontSize: '15px',
              letterSpacing: '1px',
              transition: 'var(--transition-fast)',
              borderBottom: activePage === 'menu' ? '2px solid var(--primary-purple)' : '2px solid transparent',
              paddingBottom: '4px'
            }}
            onClick={() => handleLinkClick('menu')}
          >
            Menu
          </span>
          {user && (
            <span
              style={{
                cursor: 'pointer',
                color: activePage === 'orders' ? 'var(--text-accent)' : 'var(--text-main)',
                fontFamily: 'var(--font-serif)',
                fontSize: '15px',
                letterSpacing: '1px',
                transition: 'var(--transition-fast)',
                borderBottom: activePage === 'orders' ? '2px solid var(--primary-purple)' : '2px solid transparent',
                paddingBottom: '4px'
              }}
              onClick={() => handleLinkClick('orders')}
            >
              My Orders
            </span>
          )}
          {user && user.role === 'admin' && (
            <span
              style={{
                cursor: 'pointer',
                color: activePage === 'admin' ? '#f87171' : 'var(--text-main)',
                fontFamily: 'var(--font-serif)',
                fontSize: '15px',
                letterSpacing: '1px',
                transition: 'var(--transition-fast)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                borderBottom: activePage === 'admin' ? '2px solid #ef4444' : '2px solid transparent',
                paddingBottom: '4px'
              }}
              onClick={() => handleLinkClick('admin')}
            >
              <ShieldAlert size={16} /> Admin Portal
            </span>
          )}
        </nav>

        {/* Utility Actions */}
        <div className="nav-actions">
          {/* Cart Icon */}
          <button
            onClick={onCartOpen}
            className="btn-secondary"
            style={{
              padding: '0.5rem 1rem',
              position: 'relative',
              borderRadius: '20px',
              borderColor: 'rgba(255, 94, 54, 0.4)'
            }}
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--primary-purple)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '700',
                  boxShadow: '0 0 8px var(--primary-purple)'
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* User Profile */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="nav-user-name" style={{ fontSize: '13px', color: 'var(--text-accent)', fontWeight: '500' }}>
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                className="btn-secondary"
                style={{
                  padding: '0.4rem',
                  borderRadius: '50%',
                  borderColor: 'rgba(239, 68, 68, 0.4)'
                }}
                title="Logout"
              >
                <LogOut size={14} color="#ef4444" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthOpen}
              className="btn-primary"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '13px'
              }}
            >
              Sign In
            </button>
          )}

          {/* Hamburger Menu Toggle Button */}
          <button
            className="menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
