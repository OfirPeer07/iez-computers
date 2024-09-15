// MainPage.js
import React, { useRef } from 'react';
import './MainPage.css'; // Import CSS for MainPage
import Introduction from './Sections/Introduction';
import Services from './Sections/Services';

const MainPage = () => {
  const introRef = useRef(null);
  const servicesRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="main-page">
      <div ref={introRef}>
        <Introduction />
      </div>
      <div ref={servicesRef}>
        <Services />
      </div>
      <div className="navigation-buttons">
        <button onClick={() => scrollToSection(introRef)}>Introduction</button>
        <button onClick={() => scrollToSection(servicesRef)}>Services</button>
      </div>
    </div>
  );
};

export default MainPage;
