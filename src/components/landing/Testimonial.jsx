import { motion } from "framer-motion";
import { AiFillStar } from "react-icons/ai";

const Testimonial = () => {
  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      text: "I had a great experience with FoodGo. The food was delicious and the pickup was prompt. I will definitely be ordering from them again!",
      name: "Melody Ugochukwu",
      stars: 5
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      text: "Yo this service is fire! Fast delivery, hot food, and the customer service is top tier. Can't ask for more than that fr fr.",
      name: "Marcus Johnson",
      stars: 5
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      text: "Best food delivery app I've used! Everything arrived fresh and exactly as ordered. The app is super easy to use too.",
      name: "Sarah Chen",
      stars: 5
    }
  ];

  // Container animation - stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Individual card animation
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="work-section-wrapper">
      <motion.div 
        className="work-section-top"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="primary-subheading">Reviews</p>
        <h1 className="primary-heading">What They Are Saying</h1>
        <p className="primary-text">
          My name is Temiola Ademola Asegbon, FoodGo has been a home for me 
          Melody Ugochukwu has shown me much love.

        </p>
      </motion.div>

      <motion.div 
        className="testimonials-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="testimonial-section-bottom"
            variants={cardVariants}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
          >
            <motion.img 
              src={testimonial.image} 
              alt={testimonial.name}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <p>{testimonial.text}</p>
            <motion.div 
              className="testimonials-stars-container"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              {[...Array(testimonial.stars)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotate: -180 }}
                  whileInView={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                >
                  <AiFillStar />
                </motion.div>
              ))}
            </motion.div>
            <h2>{testimonial.name}</h2>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Testimonial;

