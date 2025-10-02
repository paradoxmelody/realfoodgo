/*import React from 'react';
import LandingPage from './pages/LandingPage';
import LoginForm from './LoginForm';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <div>
      <Navbar />
      <LoginForm />
      <LandingPage/>
  
    </div>
  );
}

export default App;*/
import About from "./About";
import "./App.css";
import Contact from "./Contact";
import Footer from "./Footer";
import Home from "./Home";
import SplashCursor from "./SplashCursor";
import Testimonial from "./Testimonial";
import WhatsCooking from "./WhatsCooking";
import Work from "./Work";

function App() {
  return (
    <div className="App">
      <SplashCursor />
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