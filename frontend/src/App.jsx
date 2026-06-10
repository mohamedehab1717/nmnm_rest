import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartPanel from './components/CartPanel';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Admin from './pages/Admin';

const AppContent = () => {
  const [activePage, setActivePage] = useState('home'); // home | menu | checkout | orders | admin
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} />;
      case 'menu':
        return <Menu />;
      case 'checkout':
        return <Checkout setActivePage={setActivePage} onAuthOpen={() => setIsAuthOpen(true)} />;
      case 'orders':
        return <Orders />;
      case 'admin':
        return <Admin />;
      default:
        return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-dark-base)' }}>
      
      {/* Navbar header */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onCartOpen={() => setIsCartOpen(true)}
        onAuthOpen={() => setIsAuthOpen(true)}
      />

      {/* Main Page Area */}
      <main style={{ flex: '1 0 auto' }}>
        {renderActivePage()}
      </main>

      {/* Footer copyright and info */}
      <Footer />

      {/* Sliders and Modal overlays */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setActivePage('checkout')}
      />

    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
