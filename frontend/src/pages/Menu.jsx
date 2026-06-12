import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_BASE } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import { handleImageError } from '../utils/foodImage';

const CATEGORY_ORDER = ['Burgers', 'Pasta', 'Sandwiches', 'Pizza', 'Sweets', 'Beverages', 'Juices'];

const MenuCard = ({ item, onAdd }) => (
  <div className="glass-panel menu-card">
    <div className="menu-card-image">
      <img src={item.image} alt={item.name} loading="lazy" onError={handleImageError} />
      <span className="menu-card-badge">{item.category}</span>
    </div>
    <div className="menu-card-body">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <div className="menu-card-footer">
        <span className="menu-card-price">{formatPrice(item.price)}</span>
        {item.isAvailable ? (
          <button onClick={() => onAdd(item)} className="btn-primary menu-card-add">
            <Plus size={14} /> Add
          </button>
        ) : (
          <span style={{ fontSize: '12px', color: '#f87171', fontWeight: '600' }}>Out of Stock</span>
        )}
      </div>
    </div>
  </div>
);

const Menu = () => {
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCustomizeItem, setActiveCustomizeItem] = useState(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const [customizerQuantity, setCustomizerQuantity] = useState(1);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/menu`);
      const resJson = await res.json();
      if (resJson.success) {
        setItems(resJson.data);
      } else {
        setError('Failed to fetch menu items');
      }
    } catch {
      setError('Connection error fetching menu items');
    } finally {
      setLoading(false);
    }
  };

  const categoryCounts = useMemo(() => {
    const counts = { All: items.length };
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  const categories = useMemo(
    () => ['All', ...CATEGORY_ORDER.filter((cat) => categoryCounts[cat])],
    [categoryCounts]
  );

  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, searchQuery, items]);

  const groupedItems = useMemo(() => {
    if (selectedCategory !== 'All' || searchQuery.trim()) return null;
    return CATEGORY_ORDER.filter((cat) => filteredItems.some((i) => i.category === cat)).map(
      (cat) => ({
        category: cat,
        items: filteredItems.filter((i) => i.category === cat),
      })
    );
  }, [selectedCategory, searchQuery, filteredItems]);

  const openCustomizer = (item) => {
    window.scrollTo({
  top: 0,
  behavior: "smooth",
});
    setActiveCustomizeItem(item);
    setCustomizerQuantity(1);
    const initialSelections = [];
    if (item.customizations) {
      item.customizations.forEach((cust) => {
        if (cust.required && cust.options.length > 0) {
          initialSelections.push({
            name: cust.name,
            choice: cust.options[0].name,
            priceModifier: cust.options[0].priceModifier,
          });
        }
      });
    }
    setSelectedCustomizations(initialSelections);
  };

  const closeCustomizer = () => {
    setActiveCustomizeItem(null);
    setSelectedCustomizations([]);
  };

  const handleCustomizationOptionChange = (custName, option, isMulti = false) => {
    setSelectedCustomizations((prev) => {
      if (!isMulti) {
        return [...prev.filter((c) => c.name !== custName), { name: custName, choice: option.name, priceModifier: option.priceModifier }];
      }
      const exists = prev.some((c) => c.name === custName && c.choice === option.name);
      return exists
        ? prev.filter((c) => !(c.name === custName && c.choice === option.name))
        : [...prev, { name: custName, choice: option.name, priceModifier: option.priceModifier }];
    });
  };

  const handleAddFromCustomizer = () => {
    if (activeCustomizeItem) {
      addToCart(activeCustomizeItem, customizerQuantity, selectedCustomizations);
      closeCustomizer();
    }
  };

  const calculateLivePrice = () => {
    if (!activeCustomizeItem) return 0;
    const modifiers = selectedCustomizations.reduce((acc, curr) => acc + curr.priceModifier, 0);
    return (activeCustomizeItem.price + modifiers) * customizerQuantity;
  };

  const renderGrid = (list) => (
    <div className="grid-menu">
      {list.map((item) => (
        <MenuCard key={item._id} item={item} onAdd={openCustomizer} />
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: '80vh' }}>
      <div className="menu-page-header">
        <span className="eyebrow">nmnm Culinary Portfolio</span>
        <h1>The Menu</h1>
        <p>
          Explore our full collection of premium burgers, artisan pastas, wood-fired pizzas,
          handcrafted sweets, and signature beverages — curated for the discerning palate.
        </p>
      </div>

      <div className="menu-layout">
        <aside className="menu-sidebar">
          <div className="menu-sidebar-inner">
            <span className="menu-sidebar-title">Categories</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`menu-category-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
                <span className="count">{categoryCounts[cat] || 0}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="menu-main">
          <div className="menu-toolbar">
            <div className="menu-search">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                placeholder="Search dishes, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {!loading && (
              <span className="menu-results-count">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <div className="loading-spinner" />
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Curating menu items...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: '#ef4444', marginTop: '4rem' }}>{error}</div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
              No items found matching your search.
            </div>
          ) : groupedItems ? (
            groupedItems.map(({ category, items: sectionItems }) => (
              <section key={category} className="menu-section">
                <div className="menu-section-header">
                  <h2>{category}</h2>
                  <div className="line" />
                  <span className="count">{sectionItems.length} items</span>
                </div>
                {renderGrid(sectionItems)}
              </section>
            ))
          ) : (
            renderGrid(filteredItems)
          )}
        </div>
      </div>

      {activeCustomizeItem && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <button
              onClick={closeCustomizer}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <Minus size={20} />
            </button>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 94, 54, 0.1)', paddingBottom: '1rem' }}>
              <img
                src={activeCustomizeItem.image}
                alt={activeCustomizeItem.name}
                style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '20px' }}>{activeCustomizeItem.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Base: {formatPrice(activeCustomizeItem.price)}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              {activeCustomizeItem.customizations?.map((cust) => {
                const isMulti = cust.maxSelections > 1;
                return (
                  <div key={cust.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {cust.name} {cust.required && <span style={{ color: 'var(--text-accent)' }}>* Required</span>}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {cust.options.map((opt) => {
                        const isSelected = selectedCustomizations.some((c) => c.name === cust.name && c.choice === opt.name);
                        return (
                          <label
                            key={opt.name}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.5rem 0.75rem',
                              background: isSelected ? 'rgba(255, 94, 54, 0.1)' : 'rgba(255,255,255,0.02)',
                              border: isSelected ? '1px solid var(--primary-purple)' : '1px solid rgba(255,255,255,0.05)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '13px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input
                                type={isMulti ? 'checkbox' : 'radio'}
                                name={cust.name}
                                checked={isSelected}
                                onChange={() => handleCustomizationOptionChange(cust.name, opt, isMulti)}
                                style={{ accentColor: 'var(--primary-purple)', cursor: 'pointer' }}
                              />
                              <span>{opt.name}</span>
                            </div>
                            {opt.priceModifier > 0 && (
                              <span style={{ color: 'var(--text-accent)' }}>+{formatPrice(opt.priceModifier)}</span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255, 94, 54, 0.1)' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Quantity</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', border: '1px solid rgba(255, 94, 54, 0.1)' }}>
                  <button onClick={() => setCustomizerQuantity((p) => Math.max(1, p - 1))} style={{ background: 'none', border: 'none', color: 'white', padding: '6px 12px', cursor: 'pointer' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>{customizerQuantity}</span>
                  <button onClick={() => setCustomizerQuantity((p) => p + 1)} style={{ background: 'none', border: 'none', color: 'white', padding: '6px 12px', cursor: 'pointer' }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="customize-modal-footer">
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Price</span>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-accent)' }}>
                  {formatPrice(calculateLivePrice())}
                </div>
              </div>
              <button onClick={handleAddFromCustomizer} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
