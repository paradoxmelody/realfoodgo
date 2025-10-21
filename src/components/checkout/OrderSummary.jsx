const OrderSummary = ({ 
  cartItems, 
  subtotal, 
  serviceFee, 
  total, 
  processing, 
  onPlaceOrder 
}) => {
  return (
    <div className="checkout-summary">
      <div className="summary-card">
        <h2>Order Summary</h2>
        
        <div className="summary-items">
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <img src={item.image} alt={item.name} />
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>Qty: {item.quantity}</p>
              </div>
              <span className="item-price">R{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="summary-divider"></div>

        <div className="summary-breakdown">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>R{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Service Fee (10%)</span>
            <span>R{serviceFee.toFixed(2)}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>R{total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          className="place-order-btn"
          onClick={onPlaceOrder}
          disabled={processing}
        >
          {processing ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            <>
              Place Order • R{total.toFixed(2)}
            </>
          )}
        </button>

        <p className="secure-note">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
