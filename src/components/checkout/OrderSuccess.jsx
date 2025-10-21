import { CheckCircle2, Clock, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = ({ itemCount }) => {
  const navigate = useNavigate();

  // Get the latest order from localStorage
  const latestOrder = JSON.parse(localStorage.getItem('orders'))?.slice(-1)[0];

  return (
    <div className="order-success">
      <div className="success-card">
        <CheckCircle2 size={80} className="success-icon" />
        <h1>Order Placed Successfully!</h1>
        <p>Your order has been confirmed and will be delivered soon.</p>
        <div className="order-details">
          <div className="detail-row">
            <Clock size={20} />
            <span>Estimated wait: 30-45 minutes</span>
          </div>
          <div className="detail-row">
            <ShoppingBag size={20} />
            <span>{itemCount} items</span>
          </div>
        </div>
        <button
          onClick={() => {
            if (latestOrder) {
              navigate('/TrackOrder', { state: { order: latestOrder } });
            } else {
              alert('No order found. Please place an order first.');
            }
          }}
          className="view-orders-btn"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
