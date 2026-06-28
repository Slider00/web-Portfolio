import React from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Certifications from "./sections/Certifications";
import Experiences from "./sections/Experiences";
import Testimonial from "./sections/Testimonial";
import RecruiterHub from "./sections/RecruiterHub";
import Contact from "./sections/Contact";
import Footer from './sections/Footer';
import PortfolioAIChat from "./components/PortfolioAIChat";

const App = () => {
  return (
    <div className="container mx-auto max-w-7xl">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Certifications />
      <Experiences />
      <Testimonial />
      <RecruiterHub />
      <Contact />
      <Footer/>
      <PortfolioAIChat />
    </div>
  );
};

export default App;
