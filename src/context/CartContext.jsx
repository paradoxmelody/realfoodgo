import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase_data/firebase';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (loggedUser) => {
      if (loggedUser) {
        setUser(loggedUser);
        await fetchCartData(loggedUser.uid);
      } else {
        setUser(null);
        setCartItems({});
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch cart from Firestore
  async function fetchCartData(uid) {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setCartItems(data.cart || {});
      } else {
        // Create user document if it doesn't exist
        await setDoc(userRef, { cart: {} });
        setCartItems({});
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems({});
    }
  }

  // Save cart to Firestore
  async function saveCartToFirestore(updatedCart) {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { cart: updatedCart });
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  // Add item to cart (or increase quantity)
  const addToCart = async (item) => {
    if (!user) {
      alert('Please log in to add items to cart');
      return;
    }

    setCartItems(prev => {
      const newCart = { ...prev };
      const itemId = item.id || item._id;
      
      if (newCart[itemId]) {
        newCart[itemId] = {
          ...newCart[itemId],
          quantity: newCart[itemId].quantity + 1
        };
      } else {
        newCart[itemId] = {
          ...item,
          quantity: 1
        };
      }
      
      saveCartToFirestore(newCart);
      return newCart;
    });
  };

  // Update quantity by delta (+1 or -1)
  const updateQuantity = async (itemId, delta) => {
    setCartItems(prev => {
      const newQty = (prev[itemId]?.quantity || 0) + delta;
      const updated = { ...prev };
      
      if (newQty <= 0) {
        delete updated[itemId];
      } else {
        updated[itemId] = {
          ...prev[itemId],
          quantity: newQty
        };
      }
      
      saveCartToFirestore(updated);
      return updated;
    });
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setCartItems(prev => {
      const updated = { ...prev };
      delete updated[itemId];
      saveCartToFirestore(updated);
      return updated;
    });
  };

  // Clear entire cart
  const clearCart = async () => {
    setCartItems({});
    if (user) {
      saveCartToFirestore({});
    }
  };

  // Get total items count
  const getTotalItems = () => {
    return Object.values(cartItems).reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
  };

  // Get total price
  const getTotalPrice = () => {
    return Object.values(cartItems).reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
  };

  // Convert cart object to array
  const getCartItemsArray = () => {
    return Object.entries(cartItems).map(([id, item]) => ({
      ...item,
      id
    }));
  };

  const value = {
    cartItems,
    cart: getCartItemsArray(),  // ✅ CheckoutPage expects this
    user,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartItemsArray
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
