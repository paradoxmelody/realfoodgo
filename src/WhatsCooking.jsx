//import { AwesomeButton } from "react-awesome-button";
//import 'react-awesome-button/dist/styles.css';
import BrowseVendors from "./niontay.jpg";
import SeeOffers from "./rakai.jpg";

const Work = () => {
  const WhatsInfoData = [
    {
      image: BrowseVendors,
      title: "Restaurants",
      text: "Find your next meal from a diverse selection of campus restaurant.",
      buttonText: "View Restaurants",
      buttonType: "primary",
      buttonAction: () => console.log("Navigate to restaurants")
    },
    {
      image: SeeOffers,
      title: "Hot Deals and Offers",
      text: "Don't miss out on exclusive discounts and daily specials.",
      buttonText: "See Offers",
      buttonType: "primary"
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <h1 className="primary-heading">What's Cooking</h1>
      </div>
      <div className="work-section-bottom">
        {WhatsInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
            <button className="primary-button">{data.buttonText}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
