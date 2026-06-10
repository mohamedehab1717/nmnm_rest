import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const local = localStorage.getItem('nmnm_cart');
    return local ? JSON.parse(local) : [];
  });

  useEffect(() => {
    localStorage.setItem('nmnm_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, quantity, selectedCustomizations = []) => {
    setCartItems((prevItems) => {
      // Find if item with exact same customizations already exists
      const existingItemIndex = prevItems.findIndex((cartItem) => {
        if (cartItem._id !== item._id) return false;
        if (cartItem.customizations.length !== selectedCustomizations.length) return false;
        
        // Match each customization
        return selectedCustomizations.every((c1) => 
          cartItem.customizations.some((c2) => 
            c2.name === c1.name && c2.choice === c1.choice
          )
        );
      });

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Calculate price with customizations
        const basePrice = item.price;
        const customizationsPrice = selectedCustomizations.reduce((acc, curr) => acc + (curr.priceModifier || 0), 0);
        const finalPrice = basePrice + customizationsPrice;

        return [
          ...prevItems,
          {
            ...item,
            uniqueId: Date.now() + Math.random().toString(36).substr(2, 9), // to easily track unique cart rows
            customizations: selectedCustomizations,
            unitPrice: finalPrice,
            quantity: quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (uniqueId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.uniqueId !== uniqueId));
  };

  const updateQuantity = (uniqueId, newQty) => {
    if (newQty < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.uniqueId === uniqueId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
