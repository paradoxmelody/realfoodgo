import { BsFillPlayCircleFill } from "react-icons/bs";
import AboutBackgroundImage from "../../assets/images/onlinefoodordering.png";
//import AboutBackground from "./onlinefoodordering.png";

const About = () => {
  return (
    <div className="about-section-container">
      {/*<div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>*/}
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">About</p>
        <h1 className="primary-heading">
          Food Is An Important Part Of A Balanced Diet
        </h1>
        <p className="primary-text">
          FoodGo is an online food ordering platform that connects students and udubs employees with available campus stalls
          and restaurants. It provides a convenient way to browse menus, place
          orders, and make payments online.
        </p>
        <p className="primary-text">
          Place your order now and get your food as soon as you arrive for pickup at the restaurant.
        </p>
        <div className="about-buttons-container">
          <button className="secondary-button">Learn More</button>
          <button className="watch-video-button">
            <BsFillPlayCircleFill /> Watch Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;