import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Star, Compass, Utensils, ArrowRight } from 'lucide-react';
import { API_BASE } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import { handleImageError } from '../utils/foodImage';

const Home = ({ setActivePage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guestsCount, setGuestsCount] = useState('2');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/menu`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const picks = ['The Obsidian Wagyu Burger', 'Truffle & Saffron Fettuccine', 'Black Truffle & Fig Pizza', 'Royal Velvet Lavender Tart'];
          const featured = picks
            .map((n) => data.data.find((item) => item.name === n))
            .filter(Boolean);
          setFeaturedItems(featured.length >= 4 ? featured : data.data.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          date,
          time,
          guestsCount: parseInt(guestsCount, 10),
          specialRequests,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({
          type: 'success',
          text: `Table reserved successfully! We look forward to hosting you on ${date} at ${time}.`,
        });
        setName('');
        setEmail('');
        setPhone('');
        setDate('');
        setTime('');
        setGuestsCount('2');
        setSpecialRequests('');
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Something went wrong. Please check inputs.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Unable to connect to reservations server. Please try later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in page-container">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <span
            style={{
              color: 'var(--text-accent)',
              textTransform: 'uppercase',
              letterSpacing: '5px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '1rem',
              display: 'inline-block',
            }}
          >
            A Symphony of Taste & Luxury
          </span>
          <h1
            className="hero-title purple-gradient-text glow-text"
            style={{ lineHeight: '1.1', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: '700' }}
          >
            Welcome to nmnm
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
              maxWidth: '540px',
              margin: '0 auto 2.5rem',
              lineHeight: '1.8',
            }}
          >
            Savor meticulously curated dishes crafted by master culinary artists, served in a setting designed for complete sensory indulgence.
          </p>
          <div className="hero-actions">
            <button onClick={() => setActivePage('menu')} className="btn-primary" style={{ padding: '0.85rem 2rem', borderRadius: '30px' }}>
              <Utensils size={18} /> View Full Menu
            </button>
            <a href="#reservation" className="btn-secondary" style={{ padding: '0.85rem 2rem', borderRadius: '30px', textDecoration: 'none' }}>
              <Calendar size={18} /> Book Table
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-grid">
            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800" alt="Signature burger" />
            <img src="https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=600" alt="Artisan pasta" />
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600" alt="Wood-fired pizza" />
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      {featuredItems.length > 0 && (
        <section className="featured-section">
          <div className="featured-section-header">
            <span className="eyebrow">Chef&apos;s Selection</span>
            <h2>Signature Dishes</h2>
          </div>
          <div className="featured-grid">
            {featuredItems.map((item) => (
              <div
                key={item._id}
                className="glass-panel featured-card"
                onClick={() => setActivePage('menu')}
              >
                <div className="featured-card-image">
                  <img src={item.image} alt={item.name} loading="lazy" onError={handleImageError} />
                </div>
                <div className="featured-card-body">
                  <div className="category">{item.category}</div>
                  <h3>{item.name}</h3>
                  <div className="price">{formatPrice(item.price)}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button onClick={() => setActivePage('menu')} className="btn-secondary" style={{ padding: '0.75rem 2rem', borderRadius: '30px' }}>
              Explore All 30+ Dishes <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* Features */}
      <section style={{ marginBottom: '6rem' }}>
        <div className="responsive-grid">
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <Compass size={32} style={{ color: 'var(--text-accent)', marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '1rem' }}>Exquisite Sourcing</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Only the finest ingredients make it to our kitchen. From fresh, organic herbs to dry-aged A5 Japanese Wagyu.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <Star size={32} style={{ color: 'var(--text-accent)', marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '1rem' }}>Unparalleled Taste</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Innovative culinary profiles matching sweet, savory, and deep rich flavors to delight every palate.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <Clock size={32} style={{ color: 'var(--text-accent)', marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '1rem' }}>Luxurious Atmosphere</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              An elegant design of deep black and warm glowing amber lighting that creates an intimate, ultra-modern dining setting.
            </p>
          </div>
        </div>
      </section>

      {/* Reservation */}
      <section id="reservation" style={{ marginBottom: '6rem', scrollMarginTop: '120px' }}>
        <div className="responsive-double-grid" style={{ alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--text-accent)', letterSpacing: '2px', fontSize: '12px', fontWeight: '600' }}>
              PREMIUM LOUNGE & DINING
            </span>
            <h2 style={{ fontSize: '32px', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Secure Your Table</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '1.5rem', lineHeight: '1.8' }}>
              Due to high demand and exclusive seating arrangements, we highly recommend booking your table in advance. Experience private booths, ambient glowing orange lounge lighting, and exclusive off-menu recommendations by our head chef.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
              For groups larger than 8 guests, please contact our concierge service directly at +1 (555) 797-8775.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '1.5rem', textAlign: 'center' }}>Online Booking</h3>

            {statusMsg.text && (
              <div
                style={{
                  background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: statusMsg.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                  color: statusMsg.type === 'success' ? '#a7f3d0' : '#fca5a5',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '13px',
                  marginBottom: '1.5rem',
                }}
              >
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleReservationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="form-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone Number</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="form-input" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com" className="form-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time</label>
                  <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="form-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Guests</label>
                  <select value={guestsCount} onChange={(e) => setGuestsCount(e.target.value)} className="form-input" style={{ cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num} style={{ background: 'var(--bg-dark-surface)', color: 'white' }}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Special Note (Optional)</label>
                <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Allergies, birthday celebration, table preferences..." rows="3" className="form-input" style={{ resize: 'none' }} />
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                {loading ? 'Processing...' : 'Submit Reservation'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <span style={{ color: 'var(--text-accent)', letterSpacing: '3px', fontSize: '12px', fontWeight: '600' }}>
          PATRON REVIEWS
        </span>
        <h2 style={{ fontSize: '36px', marginTop: '0.5rem', marginBottom: '3rem' }}>The nmnm Experience</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem', color: '#fbbf24' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p style={{ color: 'var(--text-main)', fontSize: '14px', fontStyle: 'italic', marginBottom: '1.5rem' }}>
              &ldquo;The Obsidian Wagyu Burger is hands-down the most luxurious burger I have ever tasted. The black truffle aioli with charcoal bun is culinary genius.&rdquo;
            </p>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-accent)' }}>- Nour M.</span>
          </div>
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem', color: '#fbbf24' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p style={{ color: 'var(--text-main)', fontSize: '14px', fontStyle: 'italic', marginBottom: '1.5rem' }}>
              &ldquo;We booked the VIP booth for our anniversary. The warm glowing amber ambiance and the Lavender Tart were absolutely stunning. Exceptional service!&rdquo;
            </p>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-accent)' }}>- Mohamed E.</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
