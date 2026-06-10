import React, { useState } from 'react';
import { ShoppingBag, Truck, MapPin, CreditCard, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth, API_BASE } from '../context/AuthContext';
import { formatPrice, DELIVERY_FEE_EGP } from '../utils/currency';

const Checkout = ({ setActivePage, onAuthOpen }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();

  // Checkout states
  const [deliveryType, setDeliveryType] = useState('Delivery');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  if (cartItems.length === 0 && !orderConfirmed) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem', minHeight: '60vh' }}>
        <ShoppingBag size={64} style={{ color: 'var(--primary-purple)', opacity: 0.3, marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '28px', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please select some delectable items from our menu first.</p>
        <button onClick={() => setActivePage('menu')} className="btn-primary">
          Explore Menu
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      onAuthOpen();
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const formattedItems = cartItems.map(item => ({
      menuItem: item._id,
      name: item.name,
      price: item.unitPrice,
      quantity: item.quantity,
      customizations: item.customizations
    }));

    const deliveryAddress = deliveryType === 'Delivery' ? { street, city, phone } : { phone };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: formattedItems,
          totalAmount: cartTotal,
          deliveryType,
          deliveryAddress,
          paymentMethod: 'Card',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setLastOrderDetails(data.data);
        clearCart();
        setOrderConfirmed(true);
      } else {
        setErrorMessage(data.message || 'Failed to place the order. Please review your details.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If order was successfully completed
  if (orderConfirmed) {
    return (
      <div className="animate-fade-in page-container" style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '2rem 1.5rem' }}>
          <CheckCircle2 size={64} style={{ color: '#10b981', filter: 'drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.4))', marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '32px', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Order Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '2rem' }}>
            Thank you for dining with nmnm. Your order is now being prepared by our executive chefs.
          </p>

          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(139,92,246,0.1)',
              borderRadius: '8px',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '2rem',
              fontSize: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
              <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{lastOrderDetails?._id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
              <span style={{ color: 'var(--text-accent)', fontWeight: '700' }}>{formatPrice(lastOrderDetails?.totalAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Service Type:</span>
              <span style={{ color: 'var(--text-main)' }}>{lastOrderDetails?.deliveryType}</span>
            </div>
          </div>

          <div className="checkout-actions">
            <button onClick={() => setActivePage('orders')} className="btn-primary">
              Track Order <ChevronRight size={16} />
            </button>
            <button onClick={() => setActivePage('menu')} className="btn-secondary">
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in page-container" style={{ minHeight: '80vh' }}>
      <h1 className="page-title">Complete Your Order</h1>

      <div className="responsive-double-grid">
        
        {/* Left Form Column */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          
          {/* Sign In prompt if guest */}
          {!user && (
            <div
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontSize: '14px',
              }}
            >
              <p style={{ color: 'var(--text-main)', marginBottom: '8px' }}>You are checking out as guest.</p>
              <button
                type="button"
                onClick={onAuthOpen}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-accent)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Sign In or Sign Up to save order history & track details
              </button>
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '1.5rem',
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Delivery vs Pickup Selector */}
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                Delivery Choice
              </span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setDeliveryType('Delivery')}
                  className={deliveryType === 'Delivery' ? 'btn-primary' : 'btn-secondary'}
                  style={{ flex: 1, gap: '8px' }}
                >
                  <Truck size={16} /> Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('Pickup')}
                  className={deliveryType === 'Pickup' ? 'btn-primary' : 'btn-secondary'}
                  style={{ flex: 1, gap: '8px' }}
                >
                  <MapPin size={16} /> Hand Pickup
                </button>
              </div>
            </div>

            {/* Address fields (if delivery) */}
            {deliveryType === 'Delivery' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Luxury Apt, Purple Avenue"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>City / Region</label>
                  <input
                    type="text"
                    required
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            )}

            {/* Phone Number */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Contact Mobile Number</label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 777-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Payment Options mock card */}
            <div style={{ borderTop: '1px solid rgba(139,92,246,0.1)', paddingTop: '1.5rem' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '12px' }}>
                <CreditCard size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Payment Details (Mock Setup)
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength="19"
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CVV</label>
                    <input
                      type="password"
                      required
                      maxLength="3"
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '1rem' }}>
              {loading ? 'Securing Transaction...' : `Pay & Submit Order (${formatPrice(deliveryType === 'Delivery' ? cartTotal + DELIVERY_FEE_EGP : cartTotal)})`}
            </button>

          </form>
        </div>

        {/* Right Summary Column */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '1.5rem', borderBottom: '1px solid rgba(139,92,246,0.1)', paddingBottom: '0.75rem' }}>
              Summary of Order
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              {cartItems.map((item) => (
                <div key={item.uniqueId} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '14px' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: 'var(--text-accent)' }}>{item.quantity}x</span> {item.name}
                    {item.customizations && item.customizations.length > 0 && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {item.customizations.map(c => `${c.name}: ${c.choice}`).join(', ')}
                      </div>
                    )}
                  </div>
                  <span style={{ fontWeight: '600' }}>{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(139,92,246,0.1)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}>
                <span>Delivery Charge</span>
                <span>{deliveryType === 'Delivery' ? formatPrice(DELIVERY_FEE_EGP) : 'FREE'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: '#ffffff', marginTop: '10px' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--text-accent)' }}>
                  {formatPrice(deliveryType === 'Delivery' ? cartTotal + DELIVERY_FEE_EGP : cartTotal)}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Checkout;
