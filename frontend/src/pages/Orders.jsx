import React, { useState, useEffect } from 'react';
import { RefreshCw, Package, Truck, CheckCircle2, AlertTriangle, Coffee } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchUserOrders();
    }
  }, [token]);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.message || 'Failed to fetch order history');
      }
    } catch (err) {
      setError('Connection failure. Unable to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine active step in the status tracker
  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Preparing': return 1;
      case 'Out for Delivery': return 2;
      case 'Completed': return 3;
      default: return -1; // e.g. Cancelled
    }
  };

  const statusList = ['Pending', 'Preparing', 'Out for Delivery', 'Completed'];

  return (
    <div className="animate-fade-in page-container" style={{ maxWidth: '1000px', minHeight: '80vh' }}>
      <div className="page-header-row">
        <h1>Order History & Tracker</h1>
        <button
          onClick={fetchUserOrders}
          className="btn-secondary"
          style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} /> Refresh Tracker
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '6rem' }}>
          <div style={{
            display: 'inline-block',
            width: '32px',
            height: '32px',
            border: '3px solid rgba(139, 92, 246, 0.1)',
            borderTopColor: 'var(--primary-purple)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Updating statuses...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: '#ef4444' }}>{error}</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <Package size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No orders recorded.</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Place an order to begin tracking live.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((order) => {
            const currentStep = getStatusStep(order.status);
            const isCancelled = order.status === 'Cancelled';

            return (
              <div key={order._id} className="glass-panel" style={{ padding: '2rem' }}>
                
                {/* Header info */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(139,92,246,0.1)',
                    paddingBottom: '1rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ORDER ID</span>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'var(--font-sans)', color: '#ffffff' }}>
                      {order._id}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>DATE PLACED</span>
                    <p style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Status Tracking Progress Bar */}
                {isCancelled ? (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#fca5a5',
                      fontSize: '14px',
                      marginBottom: '2rem',
                    }}
                  >
                    <AlertTriangle size={18} />
                    <span>This order was cancelled by the restaurant staff.</span>
                  </div>
                ) : (
                  <div className="order-status-tracker">
                    {/* Background line connector */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '18px',
                        left: '4%',
                        right: '4%',
                        height: '3px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        zIndex: 1,
                      }}
                    />
                    
                    {/* Active progress connector */}
                    {currentStep > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '18px',
                          left: '4%',
                          width: `${(currentStep / 3) * 92}%`,
                          height: '3px',
                          background: 'linear-gradient(90deg, var(--primary-purple-dark), var(--primary-purple))',
                          boxShadow: '0 0 10px var(--primary-purple)',
                          zIndex: 2,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    )}

                    {statusList.map((status, index) => {
                      const isActive = index <= currentStep;
                      const isCurrent = index === currentStep;

                      return (
                        <div
                          key={status}
                          className="order-status-step"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 3,
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: isCurrent
                                ? 'var(--bg-dark-base)'
                                : isActive
                                ? 'var(--primary-purple)'
                                : 'var(--bg-dark-surface)',
                              border: isCurrent
                                ? '3px solid var(--primary-purple)'
                                : isActive
                                ? '3px solid var(--primary-purple)'
                                : '3px solid rgba(255, 255, 255, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isActive ? '#ffffff' : 'var(--text-muted)',
                              boxShadow: isCurrent ? '0 0 15px var(--primary-purple)' : 'none',
                              transition: 'var(--transition-smooth)',
                            }}
                          >
                            {index === 0 && <Package size={14} />}
                            {index === 1 && <Coffee size={14} />}
                            {index === 2 && <Truck size={14} />}
                            {index === 3 && <CheckCircle2 size={14} />}
                          </div>
                          <span
                            className="step-label"
                            style={{
                              fontWeight: isCurrent ? '700' : '500',
                              color: isCurrent ? 'var(--text-accent)' : isActive ? 'var(--text-main)' : 'var(--text-muted)',
                            }}
                          >
                            {status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Items & Total amount details */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                  }}
                >
                  {/* Items List */}
                  <div>
                    <h4 style={{ fontSize: '14px', color: 'var(--text-accent)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      Items Selected
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.items.map((it, idx) => (
                        <div key={idx} style={{ fontSize: '14px' }}>
                          <span style={{ fontWeight: '700' }}>{it.quantity}x</span> {it.name}
                          {it.customizations && it.customizations.length > 0 && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                              ({it.customizations.map(c => `${c.name}: ${c.choice}`).join(', ')})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Location Info & Total */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', color: 'var(--text-accent)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        Delivery Option ({order.deliveryType})
                      </h4>
                      {order.deliveryType === 'Delivery' && order.deliveryAddress ? (
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}
                        </p>
                      ) : (
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Pick up from Amethyst District lounge</p>
                      )}
                      {order.deliveryAddress?.phone && (
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Contact: {order.deliveryAddress.phone}
                        </p>
                      )}
                    </div>
                    
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total Amount Paid</span>
                      <span style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Orders;
