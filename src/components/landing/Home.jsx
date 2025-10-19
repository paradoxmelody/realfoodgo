
import { FiArrowRight } from "react-icons/fi";
<<<<<<< HEAD
import { GiChickenLeg, GiDonut, GiFrenchFries, GiHamburger, GiNoodles, GiPizzaSlice, GiSodaCan, GiTacos } from "react-icons/gi";
=======
import { Pizza, Sandwich, Salad, Coffee, IceCream, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BannerBackground from "../../assets/images/jbadASS.jpg";
>>>>>>> b7b83dd (Save all local changes before pulling)
import Navbar from "./Navbar";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    { icon: <Pizza />, name: "Pizza", color: "#ff6b35" },
    { icon: <Sandwich />, name: "Burgers", color: "#f7931e" },
    { icon: <Salad />, name: "Healthy", color: "#22c55e" },
    { icon: <Coffee />, name: "Drinks", color: "#fb923c" },
    { icon: <IceCream />, name: "Desserts", color: "#ec4899" },
    { icon: <UtensilsCrossed />, name: "More", color: "#16a34a" }
  ];

  return (
    <div className="home-container">
      <Navbar />

      {/* Hero Banner */}
      <div className="home-banner-container">
        {/* Floating food icons in the hero section */}
        <GiPizzaSlice style={{
          position: 'absolute',
          fontSize: '80px',
          top: '15%',
          right: '8%',
          color: 'rgba(255, 107, 0, 0.15)',
          animation: 'float1 9s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        <GiHamburger style={{
          position: 'absolute',
          fontSize: '65px',
          top: '70%',
          left: '12%',
          color: 'rgba(255, 140, 0, 0.12)',
          animation: 'float2 11s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        <GiTacos style={{
          position: 'absolute',
          fontSize: '55px',
          top: '45%',
          right: '25%',
          color: 'rgba(255, 165, 0, 0.1)',
          animation: 'float3 13s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <GiFrenchFries style={{
          position: 'absolute',
          fontSize: '70px',
          top: '25%',
          left: '20%',
          color: 'rgba(255, 180, 0, 0.13)',
          animation: 'float1 10s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <GiDonut style={{
          position: 'absolute',
          fontSize: '60px',
          top: '55%',
          right: '15%',
          color: 'rgba(255, 100, 150, 0.11)',
          animation: 'float2 12s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <GiNoodles style={{
          position: 'absolute',
          fontSize: '58px',
          top: '80%',
          left: '30%',
          color: 'rgba(255, 200, 100, 0.12)',
          animation: 'float3 14s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <GiChickenLeg style={{
          position: 'absolute',
          fontSize: '75px',
          top: '35%',
          left: '5%',
          color: 'rgba(255, 150, 80, 0.14)',
          animation: 'float1 11s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <GiSodaCan style={{
          position: 'absolute',
          fontSize: '50px',
          top: '65%',
          right: '30%',
          color: 'rgba(255, 0, 100, 0.1)',
          animation: 'float3 15s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="home-text-section">
          <h1 className="primary-heading">
            Order from foodGo to avoid the long lines
          </h1>
          <p className="primary-text">
            Order online and have your food ready when you arrive!
          </p>
          <button className="secondary-button" onClick={() => navigate('/vendor')}>
            Order Now <FiArrowRight />
          </button>
        </div>
<<<<<<< HEAD
=======
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <div className="categories-header">
          <h2 className="categories-title">Browse by Category</h2>
          <p className="categories-subtext">What are you craving today?</p>
        </div>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <div
              key={index}
              className="category-card"
              onClick={() => navigate('/vendor')}
            >
              <div
                className="category-icon"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              <span className="category-name">{category.name}</span>
            </div>
          ))}
        </div>
>>>>>>> b7b83dd (Save all local changes before pulling)
      </div>
    </div>
  );
};

export default Home;