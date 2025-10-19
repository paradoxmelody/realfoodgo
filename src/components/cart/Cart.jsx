import { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Home, Store, Search, ShoppingCart, User, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase_data/firebase';
import './Cart.css';
import foodgoLogo from '../../assets/images/foodgo.png';

const Cart = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState({
    1: 2,
    3: 1,
    4: 3
  });
  const [user, setUser] = useState({
    name: 'User'
  });

  const food_list = [
    { _id: 1, name: "Margherita Pizza", price: 89.99, image: "https://picsum.photos/200/200?pizza" },
    { _id: 2, name: "Chicken Burger", price: 65.50, image: "https://picsum.photos/200/200?burger" },
    { _id: 3, name: "Caesar Salad", price: 45.00, image: "https://picsum.photos/200/200?salad" },
    { _id: 4, name: "Coke", price: 18.00, image: "https://picsum.photos/200/200?coke" },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const userId = 'MoWabG5a62fsUosBOW2a1UtLJYo1';
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  const updateQuantity = (id, delta) => {
    setCartItems(prev => {
      const newQty = (prev[id] || 0) + delta;
      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const removeItem = (id) => {
    setCartItems(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const subtotal = food_list.reduce((acc, item) => {
    const quantity = cartItems[item._id] || 0;
    return acc + item.price * quantity;
  }, 0);

  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  const itemsInCart = food_list.filter(item => cartItems[item._id] > 0);

  return (
    <div className="cart-page" style={{ overflowX: 'hidden' }}>
      {/* Custom Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '1rem 5%',
        background: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src={foodgoLogo} width={50} height={40} alt="logo" />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1f2937',
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              <Home size={20} />
              Home
            </button>

            <button
              onClick={() => navigate('/vendors')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1f2937',
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              <Store size={20} />
              Vendors
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          flexGrow: 1,
          maxWidth: '500px',
          margin: '0 2rem'
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: '#f9fafb',
            borderRadius: '1.5rem',
            padding: '0.6rem 1rem',
            border: '2px solid transparent',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = '2px solid #16a34a';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = '2px solid transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <Search size={18} style={{ color: '#9ca3af', marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.9rem',
                width: '100%',
                color: '#1f2937'
              }}
              onFocus={(e) => {
                e.target.parentElement.style.border = '2px solid #16a34a';
                e.target.parentElement.style.boxShadow = '0 0 0 4px rgba(22, 163, 74, 0.2)';
                e.target.parentElement.style.background = 'white';
              }}
              onBlur={(e) => {
                e.target.parentElement.style.border = '2px solid transparent';
                e.target.parentElement.style.boxShadow = 'none';
                e.target.parentElement.style.background = '#f9fafb';
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            style={{
              background: '#16a34a',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#15803d'}
            onMouseLeave={(e) => e.target.style.background = '#16a34a'}
          >
            <ShoppingCart size={20} />
            Cart
          </button>

          <button
            onClick={() => alert('Help & Support')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1f2937',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <HelpCircle size={20} />
            Help
          </button>

          <button
            onClick={() => navigate('/ProfilePage')}
            style={{
              background: 'none',
              border: '2px solid #e5e7eb',
              color: '#1f2937',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#16a34a';
              e.target.style.color = '#16a34a';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.color = '#1f2937';
            }}
          >
            <User size={20} />
            {user.name.split(' ')[0]}
          </button>
        </div>
      </nav>

      <div className="cart-container" style={{
        marginTop: '80px',
        paddingTop: '2rem',
        minHeight: 'calc(100vh - 80px)',
        overflowY: 'auto'
      }}>
        <div className="cart-header">
          <ShoppingBag className="cart-header-icon" />
          <h1 className="cart-title">Shopping Cart</h1>
          <span className="cart-badge">
            {itemsInCart.length} {itemsInCart.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {itemsInCart.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag className="cart-empty-icon" />
            <h2 className="cart-empty-title">Your cart is empty</h2>
            <p className="cart-empty-text">Add some delicious items to get started!</p>
            <button className="cart-empty-button" onClick={() => navigate('/vendors')}>Browse Menu</button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-items-card">
                <div className="cart-items-header">
                  <h2>Order Items</h2>
                </div>

                <div className="cart-items-list">
                  {itemsInCart.map((item) => {
                    const quantity = cartItems[item._id];
                    const itemTotal = item.price * quantity;

                    return (
                      <div key={item._id} className="cart-item">
                        <div className="cart-item-content">
                          <div className="cart-item-image-wrapper">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="cart-item-image"
                            />
                          </div>

                          <div className="cart-item-details">
                            <div className="cart-item-header">
                              <div>
                                <h3 className="cart-item-name">{item.name}</h3>
                                <p className="cart-item-price">R{item.price.toFixed(2)} each</p>
                              </div>
                              <button
                                onClick={() => removeItem(item._id)}
                                className="cart-item-remove"
                              >
                                <Trash2 className="icon-size" />
                              </button>
                            </div>

                            <div className="cart-item-footer">
                              <div className="cart-item-quantity">
                                <button
                                  onClick={() => updateQuantity(item._id, -1)}
                                  className="quantity-btn"
                                >
                                  <Minus className="icon-size-sm" />
                                </button>
                                <span className="quantity-display">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item._id, 1)}
                                  className="quantity-btn"
                                >
                                  <Plus className="icon-size-sm" />
                                </button>
                              </div>

                              <div className="cart-item-total">
                                <p>R{itemTotal.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="cart-summary-section">
              <div className="cart-summary-card">
                <h2 className="cart-summary-title">Order Summary</h2>

                <div className="cart-summary-details">
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span>R{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="cart-summary-row">
                    <span>Service Fee (10%)</span>
                    <span>R{serviceFee.toFixed(2)}</span>
                  </div>

                  <div className="cart-summary-divider"></div>

                  <div className="cart-summary-total">
                    <span>Total</span>
                    <span className="total-amount">R{total.toFixed(2)}</span>
                  </div>
                </div>

                <button className="checkout-button">
                  Proceed to Checkout
                  <ArrowRight className="checkout-arrow" />
                </button>

                <div className="cart-promo">
                  <p>✓ Free delivery on orders over R150</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;