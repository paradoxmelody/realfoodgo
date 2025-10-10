import { AiFillStar } from "react-icons/ai";
import ProfilePic from "../../assets/images/dacarter (3).jpg";

const Testimonial = () => {
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Reviews</p>
        <h1 className="primary-heading">What They Are Saying</h1>
        <p className="primary-text">
         Melody is the coolest person I know plus she's my cousin😭😂😂😂
         "cousin? who is you bruuh? you weird asl"
        </p>
      </div>
      <div className="testimonial-section-bottom">
        <img src={ProfilePic} alt="" />
        <p>
          "I had a great experience with FoodGo. The food was delicious and the
          pickup was prompt. I will definitely be ordering from them again!"
        </p>
        <div className="testimonials-stars-container">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
        </div>
        <h2>Melody Ugochukwu</h2>
      </div>
    </div>
  );
};

export default Testimonial;