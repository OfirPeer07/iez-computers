import React, { useEffect, useState } from 'react';
import './IndicatorDots.css';

const IndicatorDots = ({resilienceTestersRef, theGreenHoodRef }) => {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (ref, sectionName) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionName);
    }
  };

  useEffect(() => {
    const sectionRefs = [
      { ref: resilienceTestersRef, name: 'resilienceTesters' },
      { ref: theGreenHoodRef, name: 'theGreenHood' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sectionRefs.find((s) => s.ref.current === entry.target);
            if (section) setActiveSection(section.name);
          }
        });
      },
      { threshold: 0.6 } // Adjust the threshold for better precision
    );

    sectionRefs.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [resilienceTestersRef, theGreenHoodRef]);

  return (
    <div className="indicator__list-wrap">
      <div className="indicator__list">
        <button
          className={`indicator__item ${activeSection === 'resilienceTesters' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(resilienceTestersRef, 'resilienceTesters')}
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">בודק חוסן</span>
          </span>
        </button>
        <button
          className={`indicator__item ${activeSection === 'theGreenHood' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(theGreenHoodRef, 'theGreenHood')}
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">הברדס הירוק</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default IndicatorDots;
