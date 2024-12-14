import React, { useEffect, useState } from 'react';
import './IndicatorDots.css';

const IndicatorDots = ({ introRef, servicesRef, photoCarouselRef }) => {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (ref, sectionName) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionName);
    }
  };

  useEffect(() => {
    const sectionRefs = [
      { ref: introRef, name: 'introduction' },
      { ref: servicesRef, name: 'services' },
      { ref: photoCarouselRef, name: 'carousel' },
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
  }, [introRef, servicesRef, photoCarouselRef]);

  return (
    <div className="indicator__list-wrap">
      <div className="indicator__list">
        <button
          className={`indicator__item ${activeSection === 'introduction' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(introRef, 'introduction')}
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">ברוכים הבאים</span>
          </span>
        </button>
        <button
          className={`indicator__item ${activeSection === 'services' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(servicesRef, 'services')}
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">האני מאמין שלי</span>
          </span>
        </button>
        <button
          className={`indicator__item ${activeSection === 'carousel' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(photoCarouselRef, 'carousel')}
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">הרכבת מחשבים</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default IndicatorDots;
