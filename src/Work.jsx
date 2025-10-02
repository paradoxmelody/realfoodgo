import PickMeals from "./dacarter (1).jpg";
import ChooseMeals from "./fastfoodie.jpeg";
import DeliveryMeals from "./student.jpg";

const Work = () => {
  const workInfoData = [
    {
      image: PickMeals,
      title: "Browse Vendors/Restaurants",
      text: "Discover a wide array of campus food stalls, from quick bites to hearty meals.",
    },
    {
      image: ChooseMeals,
      title: "Easy to Order",
      text: "Add your favorite items to cart with a few taps and customize your order.",
    },
    {
      image: DeliveryMeals,
      title: "Track your Food",
      text: "Get real-time updates on your order from preparation to your pickup.",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Work</p>
        <h1 className="primary-heading">How It Works</h1>
        <p className="primary-text">
          Experience the easiest way to order from your favorite campus eateries without waiting in line. Fresh, fast, and always delicious!
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;