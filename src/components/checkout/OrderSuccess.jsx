// src/components/checkout/OrderSuccess.jsx
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="order-success">
      <div className="success-card">
        <CheckCircle2 size={80} className="success-icon" />
        <h1>Order Placed Successfully!</h1>
        <p>Your order has been confirmed and will be delivered soon.</p>

        <button
          onClick={() => navigate("/ProfilePage")} // simply go to profile
          className="view-orders-btn"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
