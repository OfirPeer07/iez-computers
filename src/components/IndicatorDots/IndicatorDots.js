import React, { useState, useEffect } from 'react';

const IndicatorDots = ({ scrollToSection, introRef, servicesRef, photoCarouselRef }) => {
  const [activeSection, setActiveSection] = useState('introduction');

  const handleScroll = () => {
    const sections = [
      { ref: introRef, name: 'introduction' },
      { ref: servicesRef, name: 'services' },
      { ref: photoCarouselRef, name: 'carousel' }
    ];

    // Checking each section if it's in view
    sections.forEach(section => {
      const sectionTop = section.ref.current.getBoundingClientRect().top;
      const sectionHeight = section.ref.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // If the section is in the middle of the viewport, update active section
      if (sectionTop <= windowHeight / 2 && sectionTop + sectionHeight > windowHeight / 2) {
        setActiveSection(section.name);
      }
    });
  };

  useEffect(() => {
    // Adding scroll event listener
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initial check on component mount

    return () => {
      // Cleanup event listener on component unmount
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle section navigation when an indicator is clicked
  const handleClick = (ref, section) => {
    scrollToSection(ref, section);
    setActiveSection(section);
  };

  return (
    <div className="indicator__list-wrap">
      <div className="indicator__list">
        <div
          className={`indicator__item ${activeSection === 'introduction' ? 'indicator__item--active' : ''}`}
          onClick={() => handleClick(introRef, 'introduction')}
        >
          <div className="indicator__dot-wrap">
            <div className="indicator__dot">
              <div className="indicator__dot-inner"></div>
            </div>
            <div className="indicator__label">ברוכים הבאים</div>
          </div>
        </div>

        <div
          className={`indicator__item ${activeSection === 'services' ? 'indicator__item--active' : ''}`}
          onClick={() => handleClick(servicesRef, 'services')}
        >
          <div className="indicator__dot-wrap">
            <div className="indicator__dot">
              <div className="indicator__dot-inner"></div>
            </div>
            <div className="indicator__label">האני מאמין שלי</div>
          </div>
        </div>

        <div
          className={`indicator__item ${activeSection === 'carousel' ? 'indicator__item--active' : ''}`}
          onClick={() => handleClick(photoCarouselRef, 'carousel')}
        >
          <div className="indicator__dot-wrap">
            <div className="indicator__dot">
              <div className="indicator__dot-inner"></div>
            </div>
            <div className="indicator__label">הרכבת מחשבים</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorDots;
