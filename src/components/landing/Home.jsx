import { FiArrowRight } from "react-icons/fi";
import { GiChickenLeg, GiDonut, GiFrenchFries, GiHamburger, GiNoodles, GiPizzaSlice, GiSodaCan, GiTacos } from "react-icons/gi";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
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
        <GiPizzaSlice style={{
          position: 'absolute',
          fontSize: '20px',
          top: '12%',
          right: '8%',
          color: 'rgba(5, 2, 31, 0)',
          animation: 'float2 7s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        <GiHamburger style={{
          position: 'absolute',
          fontSize: '65px',
          top: '70%',
          left: '12%',
          color: 'rgba(255, 140, 0, 0.12)',
          animation: 'float3 11s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        <GiTacos style={{
          position: 'absolute',
          fontSize: '55px',
          top: '45%',
          right: '25%',
          color: 'rgba(255, 165, 0, 0.1)',
          animation: 'float4 13s ease-in-out infinite',
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
          <button className="secondary-button">
            Order Now <FiArrowRight />{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
 