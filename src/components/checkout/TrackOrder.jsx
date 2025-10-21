import { useState, useEffect } from "react";
import { ChefHat, Timer, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../pages/Checkout.css";

const stages = [
  { id: 1, label: "Preparing your order", icon: <ChefHat size={40} /> },
  { id: 2, label: "Almost Ready", icon: <Timer size={40} /> },
  { id: 3, label: "Ready for Pickup", icon: <CheckCircle2 size={40} /> },
];

const TrackOrder = () => {
  const [stage, setStage] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;
  const pickupTime = order?.pickup?.pickupTime;

  useEffect(() => {
    if (stage < stages.length - 1) {
      const timer = setTimeout(() => setStage(stage + 1), 7000); // 7s per stage
      return () => clearTimeout(timer);
    }
  }, [stage]);

  if (!order) return <p>No order found. Please place an order first.</p>;

  return (
    <div className="order-success">
      <div className="success-card">
        <div className="success-icon">{stages[stage].icon}</div>
        <h1>{stages[stage].label}</h1>

        <p>
          Pickup Time: <strong>{pickupTime || "N/A"}</strong>
        </p>

        <div className="track-progress">
          {stages.map((s, i) => (
            <div key={s.id} className={`track-step ${i <= stage ? "active" : ""}`}>
              <div className="track-icon">{s.icon}</div>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        {stage === stages.length - 1 && (
          <button onClick={() => navigate("/")} className="view-orders-btn">
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
