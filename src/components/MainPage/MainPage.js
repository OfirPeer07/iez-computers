import React, { useEffect, useRef, useState } from 'react';
import './MainPage.css';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel';
import IndicatorDots from '../IndicatorDots/IndicatorDots';
import welcomeImage from './Sections/welcome.png';
import welcome2Image from './Sections/welcome2.png';
import theHood from './Sections/theHood.png';
import Introduction from './Sections/Introduction';
import Services from './Sections/Services';
import ResilienceTester from './Sections/ResilienceTester';
import TheGreenHood from './Sections/TheGreenHood';

const MainPage = () => {
  const introRef = useRef(null);
  const servicesRef = useRef(null);
  const photoCarouselRef = useRef(null);
  const resilienceTestersRef = useRef(null);
  const theGreenHoodRef = useRef(null);

  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (ref, section) => {
    if (ref && ref.current) {
      setActiveSection(section); // עדכן מיידית את המצב
      ref.current.scrollIntoView({ behavior: 'smooth' }); // גלול למיקום
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { ref: introRef, name: 'introduction' },
        { ref: servicesRef, name: 'services' },
        { ref: photoCarouselRef, name: 'carousel' },
        { ref: resilienceTestersRef, name: 'resilienceTesters' },
        { ref: theGreenHoodRef, name: 'theGreenHood' },
      ];

      let newActiveSection = activeSection;

      sections.forEach(({ ref, name }) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;

          // Update the active section based on which section is currently visible
          if (isInViewport && rect.top <= window.innerHeight * 0.3) {
            newActiveSection = name;
          }
        }
      });

      // Update active section only if it has changed
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Call handleScroll immediately to handle the state on page load
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  return (
    <div className="main-page">
      <IndicatorDots
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        introRef={introRef}
        servicesRef={servicesRef}
        photoCarouselRef={photoCarouselRef}
        resilienceTestersRef={resilienceTestersRef}
        theGreenHoodRef={theGreenHoodRef}
      />

      <div ref={introRef} className="section">
        <div className="text-image-container">
          <img src={welcomeImage} alt="Welcome" className="intro-image" />
          <Introduction />
        </div>
      </div>

      <div ref={servicesRef} className="section">
        <div className="text-image-container">
          <img src={welcome2Image} alt="Welcome 2" className="services-image" />
          <Services />
        </div>
      </div>

      <div ref={photoCarouselRef} className="carousel-section">
        <PhotoCarousel />
      </div>

      <div ref={resilienceTestersRef} className="section">
        <div className="text-image-container">
          <ResilienceTester />
        </div>
      </div>

      <div ref={theGreenHoodRef} className="section">
        <div className="text-image-container">
          <img src={theHood} alt="theHood" className="services-image" />
          <TheGreenHood />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
