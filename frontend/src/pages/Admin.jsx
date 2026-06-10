import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Pencil, Trash, ClipboardList, Calendar, PlusCircle, Check, X, RefreshCw } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

const Admin = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // orders | menu | reservations

  // Shared status state loaders
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Live Orders Panel States
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('All');

  // 2. Menu Management States
  const [menuItems, setMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  
  // Menu Item Form States
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('Burgers');
  const [formImage, setFormImage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // 3. Reservations Panel States
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token, activeTab]);

  const loadAllData = () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (activeTab === 'orders') fetchAllOrders();
    if (activeTab === 'menu') fetchAllMenuItems();
    if (activeTab === 'reservations') fetchAllReservations();
  };

  // --- ORDER SERVICES ---
  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setErrorMsg(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setErrorMsg('Failed connecting to API server');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, nextStatus) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Order status updated to ${nextStatus}`);
        fetchAllOrders();
      } else {
        setErrorMsg(data.message || 'Failed to update order status');
      }
    } catch (err) {
      setErrorMsg('Error sending status update');
    }
  };

  // --- MENU CRUD SERVICES ---
  const fetchAllMenuItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/menu`);
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.data);
      } else {
        setErrorMsg('Failed fetching menu items');
      }
    } catch (err) {
      setErrorMsg('Error connecting to menu service');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      name: formName,
      description: formDesc,
      price: parseFloat(formPrice),
      category: formCategory,
      image: formImage || undefined,
      isAvailable
    };

    try {
      let res;
      if (editingItem) {
        res = await fetch(`${API_BASE}/menu/${editingItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE}/menu`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(editingItem ? 'Menu item updated successfully!' : 'New Menu item created!');
        clearForm();
        fetchAllMenuItems();
      } else {
        setErrorMsg(data.message || 'Error processing menu action');
      }
    } catch (err) {
      setErrorMsg('Server validation failure');
    }
  };

  const startEditMenuItem = (item) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(item.price.toString());
    setFormCategory(item.category);
    setFormImage(item.image);
    setIsAvailable(item.isAvailable);
  };

  const deleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this exquisite dish?')) return;
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${API_BASE}/menu/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Menu item removed successfully');
        fetchAllMenuItems();
      } else {
        setErrorMsg(data.message || 'Failed deleting item');
      }
    } catch (err) {
      setErrorMsg('Error contacting menu database');
    }
  };

  const clearForm = () => {
    setEditingItem(null);
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormCategory('Burgers');
    setFormImage('');
    setIsAvailable(true);
  };

  // --- RESERVATIONS SERVICES ---
  const fetchAllReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reservations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReservations(data.data);
      } else {
        setErrorMsg('Failed fetching reservations');
      }
    } catch (err) {
      setErrorMsg('Connection error fetching reservations');
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (resId, nextStatus) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_BASE}/reservations/${resId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Reservation marked as ${nextStatus}`);
        fetchAllReservations();
      } else {
        setErrorMsg(data.message || 'Failed updating status');
      }
    } catch (err) {
      setErrorMsg('Error updating reservation');
    }
  };

  // Orders logic filters
  const filteredOrders = orderFilter === 'All' 
    ? orders 
    : orders.filter(o => o.status === orderFilter);

  return (
    <div className="animate-fade-in page-container" style={{ maxWidth: '1200px', minHeight: '80vh' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <ShieldCheck size={36} style={{ color: 'var(--text-accent)' }} />
        <div>
          <h1 style={{ fontSize: '32px', fontFamily: 'var(--font-serif)' }}>nmnm Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Administrative control console for restaurant staff</p>
        </div>
      </div>

      {/* Tabs Menu navigation */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('orders')}
          className={activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', fontSize: '14px' }}
        >
          <ClipboardList size={16} /> Live Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={activeTab === 'menu' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', fontSize: '14px' }}
        >
          <PlusCircle size={16} /> Menu Manager ({menuItems.length})
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={activeTab === 'reservations' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', fontSize: '14px' }}
        >
          <Calendar size={16} /> Table Bookings ({reservations.length})
        </button>
      </div>

      {/* Global Alerts feedback */}
      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '14px', marginBottom: '1.5rem' }}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#a7f3d0', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '14px', marginBottom: '1.5rem' }}>
          {successMsg}
        </div>
      )}

      {/* Main Panels dynamic toggle */}
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '6rem' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(139, 92, 246, 0.1)', borderTopColor: 'var(--primary-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <>
          {/* TAB 1: ORDERS DASHBOARD */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['All', 'Pending', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setOrderFilter(filter)}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '20px',
                        fontSize: '12px',
                        background: orderFilter === filter ? 'var(--primary-purple)' : 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <button onClick={fetchAllOrders} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '12px' }}>
                  <RefreshCw size={12} /> Sync Orders
                </button>
              </div>

              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No orders in this category.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {filteredOrders.map((ord) => (
                    <div key={ord._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(139,92,246,0.1)', paddingBottom: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ORDER REFERENCE</span>
                          <p style={{ fontSize: '14px', fontWeight: '700' }}>{ord._id}</p>
                          <span style={{ fontSize: '12px', color: 'var(--text-accent)' }}>
                            Customer: {ord.user?.name} ({ord.user?.email})
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>CHANGE ORDER STATE</span>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord._id, e.target.value)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              background: '#0d0b14',
                              border: '1px solid var(--primary-purple)',
                              borderRadius: '4px',
                              color: 'white',
                              cursor: 'pointer',
                              outline: 'none',
                              fontSize: '13px'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Details row */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>ITEMS ORDERED</span>
                          {ord.items.map((it, idx) => (
                            <div key={idx} style={{ fontSize: '13px', marginBottom: '4px' }}>
                              <strong>{it.quantity}x</strong> {it.name} 
                              {it.customizations && it.customizations.length > 0 && (
                                <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: '4px' }}>
                                  ({it.customizations.map(c => `${c.name}: ${c.choice}`).join(', ')})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>DELIVERY ADDRESS / CONTACT</span>
                          {ord.deliveryType === 'Delivery' && ord.deliveryAddress ? (
                            <p style={{ fontSize: '13px' }}>{ord.deliveryAddress.street}, {ord.deliveryAddress.city}</p>
                          ) : (
                            <p style={{ fontSize: '13px', color: 'var(--text-accent)' }}>Hand Pickup Arrangement</p>
                          )}
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Contact No: {ord.deliveryAddress?.phone}</p>
                          <div style={{ marginTop: '1rem', fontWeight: '700', fontSize: '16px', color: '#ffffff' }}>
                            Subtotal Paid: <span style={{ color: 'var(--text-accent)' }}>{formatPrice(ord.totalAmount)}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MENU CRUD MANAGER */}
          {activeTab === 'menu' && (
            <div className="admin-menu-grid">
              {/* Left Side: Create / Edit Form */}
              <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '1.5rem' }}>
                  {editingItem ? 'Edit Culinary Masterpiece' : 'Add New Menu Item'}
                </h3>
                <form onSubmit={handleMenuSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Dish Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lavender Lamb chops"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      style={{ padding: '0.7rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Price (EGP)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="18.50"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        style={{ padding: '0.7rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Category</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        style={{ padding: '0.7rem', background: '#0e0a15', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
                      >
                        {['Burgers', 'Pasta', 'Sandwiches', 'Sweets', 'Beverages', 'Juices', 'Pizza'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Description</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="Ingredients, flavors, details..."
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      style={{ padding: '0.7rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', outline: 'none', resize: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Image Link URL</label>
                    <input
                      type="text"
                      placeholder="Paste Unsplash image URL"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      style={{ padding: '0.7rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'white', outline: 'none' }}
                    />
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', margin: '0.5rem 0' }}>
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      style={{ accentColor: 'var(--primary-purple)' }}
                    />
                    Mark Available / In-Stock
                  </label>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                      {editingItem ? 'Save Updates' : 'Publish Dish'}
                    </button>
                    {editingItem && (
                      <button type="button" onClick={clearForm} className="btn-secondary">
                        Cancel
                      </button>
                    )}
                  </div>

                </form>
              </div>

              {/* Right Side: Menu Items Grid List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '75vh', overflowY: 'auto', paddingRight: '6px' }}>
                {menuItems.map((item) => (
                  <div key={item._id} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{item.name}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.category} | {formatPrice(item.price)}</p>
                      <span style={{ fontSize: '11px', color: item.isAvailable ? '#10b981' : '#f87171' }}>
                        {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => startEditMenuItem(item)}
                        className="btn-secondary"
                        style={{ padding: '0.4rem', border: 'none', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}
                        title="Edit Item"
                      >
                        <Pencil size={14} style={{ color: 'var(--text-accent)' }} />
                      </button>
                      <button
                        onClick={() => deleteMenuItem(item._id)}
                        className="btn-secondary"
                        style={{ padding: '0.4rem', border: 'none', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}
                        title="Delete Item"
                      >
                        <Trash size={14} style={{ color: '#f87171' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: RESERVATIONS BOOKINGS */}
          {activeTab === 'reservations' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button onClick={fetchAllReservations} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '12px' }}>
                  <RefreshCw size={12} /> Sync Reservations
                </button>
              </div>

              {reservations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No reservations booked.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {reservations.map((res) => (
                    <div key={res._id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: res.status === 'Confirmed' ? '4px solid #10b981' : res.status === 'Cancelled' ? '4px solid #ef4444' : '4px solid #fbbf24' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RESERVATION BOOKING</span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: res.status === 'Confirmed' ? '#10b981' : res.status === 'Cancelled' ? '#ef4444' : '#fbbf24',
                            textTransform: 'uppercase'
                          }}
                        >
                          {res.status}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>{res.name}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Email: {res.email}</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Phone: {res.phone}</p>
                      
                      <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '4px', fontSize: '13px' }}>
                        <div><strong>Date:</strong> {res.date}</div>
                        <div><strong>Time:</strong> {res.time}</div>
                        <div><strong>Guests count:</strong> {res.guestsCount}</div>
                        {res.specialRequests && <div><strong>Note:</strong> {res.specialRequests}</div>}
                      </div>

                      {/* Status selectors */}
                      {res.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem' }}>
                          <button
                            onClick={() => updateReservationStatus(res._id, 'Confirmed')}
                            className="btn-primary"
                            style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', fontSize: '12px', gap: '4px' }}
                          >
                            <Check size={12} /> Confirm
                          </button>
                          <button
                            onClick={() => updateReservationStatus(res._id, 'Cancelled')}
                            className="btn-secondary"
                            style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', fontSize: '12px', gap: '4px', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}
                          >
                            <X size={12} /> Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Admin;
