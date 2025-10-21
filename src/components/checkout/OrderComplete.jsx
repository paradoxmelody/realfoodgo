import { useEffect } from "react";
import { CheckCircle2, Clock, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../pages/Checkout.css";

const OrderComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pickupTime } = location.state || {}; 

  useEffect(() => {
    // Auto-redirect home after 30s
    const timer = setTimeout(() => {
      navigate("/");
    }, 30000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="order-success">
      <div className="success-card">
        <CheckCircle2 size={80} className="success-icon" />
        <h1>Order Placed Successfully!</h1>
        <p>Your pickup order has been confirmed.</p>

        <div className="order-details">
          <div className="detail-row">
            <Clock size={20} />
            <span>
              Pickup Time: <strong>{pickupTime || "N/A"}</strong>
            </span>
          </div>
          <div className="detail-row">
            <MapPin size={20} />
            <span>Pickup Location: At the counter</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/trackorder", { state: { pickupTime } })}
          className="view-orders-btn"
        >
          Track Order
        </button>

        <p className="secure-note">⏳ You’ll be redirected soon</p>
      </div>
    </div>
  );
};

export default OrderComplete;
