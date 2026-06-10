import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

const CartPanel = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose} aria-hidden="true" />
      <div className="cart-panel">
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--text-accent)' }} /> Your Selection
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.25, marginBottom: '1rem' }} />
              <p>Your cart is empty.</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Add some luxury delicacies to start.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.uniqueId}
                style={{
                  display: 'flex',
                  gap: '12px',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                  alignItems: 'flex-start',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', lineHeight: 1.35 }}>{item.name}</h4>
                  {item.customizations && item.customizations.length > 0 && (
                    <p style={{ fontSize: '11px', color: 'var(--text-accent)', margin: '4px 0', lineHeight: 1.4 }}>
                      {item.customizations.map((c) => `${c.name}: ${c.choice}`).join(' | ')}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', border: '1px solid rgba(139,92,246,0.1)' }}>
                      <button
                        onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', color: 'white', padding: '8px 12px', cursor: 'pointer' }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: '600', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', color: 'white', padding: '8px 12px', cursor: 'pointer' }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-accent)' }}>
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.uniqueId)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                          padding: '8px',
                        }}
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              background: 'rgba(6, 3, 9, 0.95)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                {formatPrice(cartTotal)}
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPanel;
