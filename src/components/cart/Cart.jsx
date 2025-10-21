import { useState } from 'react';
import {
  Trash2, ShoppingBag, Plus, Minus, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    user,
    loading,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    getCartItemsArray
  } = useCart();

  // Totals
  const subtotal = getTotalPrice();
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;
  const itemsArray = getCartItemsArray();

  // Show loading while waiting for Firebase
  if (loading) {
    return (
      <p style={{ textAlign: 'center', marginTop: '5rem' }}>
        Loading your cart...
      </p>
    );
  }

  return (
    <div className="cart-page" style={{ overflowX: 'hidden' }}>
      {/* --- Cart Content --- */}
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
            {itemsArray.length} {itemsArray.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {itemsArray.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag className="cart-empty-icon" />
            <h2 className="cart-empty-title">Your cart is empty</h2>
            <p className="cart-empty-text">Add some delicious items to get started!</p>
            <button className="cart-empty-button" onClick={() => navigate('/vendor')}>
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-items-card">
                <div className="cart-items-header">
                  <h2>Order Items</h2>
                </div>

                <div className="cart-items-list">
                  {itemsArray.map((item) => {
                    const quantity = item.quantity || 0;
                    const itemTotal = (item.price || 0) * quantity;
                    const itemId = item.id || item._id;
                    
                    return (
                      <div key={itemId} className="cart-item">
                        <div className="cart-item-content">
                          <div className="cart-item-image-wrapper">
                            <img 
                              src={item.image || 'https://via.placeholder.com/200'} 
                              alt={item.name} 
                              className="cart-item-image" 
                            />
                          </div>
                          <div className="cart-item-details">
                            <div className="cart-item-header">
                              <div>
                                <h3 className="cart-item-name">{item.name}</h3>
                                <p className="cart-item-price">
                                  R{(item.price || 0).toFixed(2)} each
                                </p>
                              </div>
                              <button 
                                onClick={() => removeFromCart(itemId)} 
                                className="cart-item-remove"
                              >
                                <Trash2 className="icon-size" />
                              </button>
                            </div>
                            <div className="cart-item-footer">
                              <div className="cart-item-quantity">
                                <button 
                                  onClick={() => updateQuantity(itemId, -1)} 
                                  className="quantity-btn"
                                >
                                  <Minus className="icon-size-sm" />
                                </button>
                                <span className="quantity-display">{quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(itemId, 1)} 
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
                <button 
                  className="checkout-button"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                  <ArrowRight className="checkout-arrow" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;