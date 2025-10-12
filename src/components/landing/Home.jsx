import { FiArrowRight } from "react-icons/fi";
import BannerBackground from "../../assets/images/jbadASS.jpg";
//import BannerImage from "../../assets/images/omshantiom.jpg";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Why wait in line when you can order online and get your food fast?
          </h1>
          <p className="primary-text">
            Order online and have your food ready when you arrive!
          </p>
          <button className="secondary-button">
            Order Now <FiArrowRight />{" "}
          </button>
        </div>
        {/*<div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>*/}
      </div>
    </div>
  );
};

export default Home;