import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Initialize with Dummy Data for Demo
  // Initialize cart with empty array
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
       const existing = prev.find(item => item.id === product.id);
       if (existing) {
          toast.success("Item quantity updated in cart");
          return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
       }
       toast.success("Item added to cart");
       return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (id, change) => {
     setCartItems(prev => prev.map(item => {
        if (item.id === id) {
           const newQty = item.quantity + change;
           return { ...item, quantity: newQty >= 1 ? newQty : 1 };
        }
        return item;
     }));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
