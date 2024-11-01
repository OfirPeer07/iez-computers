import React, { useRef, useState } from 'react';
import './MainPage.css';
import Introduction from './Sections/Introduction';
import Services from './Sections/Services';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel';
import IndicatorDots from '../IndicatorDots/IndicatorDots';
import welcomeImage from './Sections/welcome.png';  
import welcome2Image from './Sections/welcome2.png';

const MainPage = () => {
  const introRef = useRef(null);
  const servicesRef = useRef(null);
  const photoCarouselRef = useRef(null);

  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (ref, section) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(section);
    }
  };

  return (
    <div className="main-page">
      <IndicatorDots
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        introRef={introRef}
        servicesRef={servicesRef}
        photoCarouselRef={photoCarouselRef}
      />

      <div ref={introRef} className="section">
        <div className="text-image-container">
          <img src={welcomeImage} alt="Welcome" className="intro-image" /> {/* Welcome image on the left */}
          <Introduction />
        </div>
      </div>

      <div ref={servicesRef} className="section">
        <div className="text-image-container">
          <img src={welcome2Image} alt="Welcome 2" className="services-image" /> {/* Welcome2 image on the left */}
          <Services />
        </div>
      </div>

      <div ref={photoCarouselRef} className="carousel-section">
        <PhotoCarousel />
      </div>
    </div>
  );
};

export default MainPage;