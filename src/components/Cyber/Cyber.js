import React, { useEffect, useRef, useState } from 'react';
import './Cyber.css';
import IndicatorDots from '../Cyber/IndicatorDots/IndicatorDots';
import theHood from './Sections/theHood.png';
import ResilienceTester from './Sections/ResilienceTester';
import TheGreenHood from './Sections/TheGreenHood';

const Cyber = () => {
  const resilienceTestersRef = useRef(null);
  const theGreenHoodRef = useRef(null);

  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (ref, section) => {
    if (ref && ref.current) {
      setActiveSection(section); 
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
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
        resilienceTestersRef={resilienceTestersRef}
        theGreenHoodRef={theGreenHoodRef}
      />

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

export default Cyber;
