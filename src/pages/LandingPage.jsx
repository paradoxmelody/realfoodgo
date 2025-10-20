import About from "../components/landing/About";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";
import Home from "../components/landing/Home";
// import SplashCursor from "../components/landing/SplashCursor"; // Temporarily commented
import Testimonial from "../components/landing/Testimonial";
import WhatsCooking from "../components/landing/WhatsCooking";
import Work from "../components/landing/Work";
import './LandingPage.css';


function App() {
  return (
    <div className="App">
      {/* <SplashCursor /> */}
      <Home />
      <About />
      <Work />
      <WhatsCooking />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;