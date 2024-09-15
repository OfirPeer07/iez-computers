// App.js
import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SideBar from '../SideBar/SideBar';
import Hacking from '../Hacking/Hacking';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel';
import GeneralArticles from '../MarkdownDocs/GeneralArticles';
import CyberArticles from '../MarkdownDocs/CyberArticles';
import TroubleshootingGuides from '../MarkdownDocs/TroubleshootingGuides';
import CyberGuides from '../MarkdownDocs/CyberGuides';
import Introduction from '../MainPage/Sections/Introduction';
import Services from '../MainPage/Sections/Services';
import welcomeImage from '../MainPage/Sections/welcome.png';
import welcomeImage2 from '../MainPage/Sections/welcome2.png';
import IndicatorDots from '../IndicatorDots/IndicatorDots';

function MainContent() {
  const introRef = useRef(null);
  const servicesRef = useRef(null);
  const photoCarouselRef = useRef(null);

  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (ref, section) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(section);
  };

  return (
    <>
      <IndicatorDots 
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        introRef={introRef}
        servicesRef={servicesRef}
        photoCarouselRef={photoCarouselRef}
      />
      <div ref={introRef} className="section">
        <div className="text-image-container">
          <div className="text-content">
            <Introduction />
          </div>
          <div className="image-content">
            <img src={welcomeImage} alt="Welcome" className="intro-image" />
          </div>
        </div>
      </div>
      <div ref={servicesRef} className="section">
        <div className="text-image-container">
          <div className="text-content">
            <Services />
          </div>
          <div className="image-content">
            <img src={welcomeImage2} alt="Services" className="services-image" />
          </div>
        </div>
      </div>
      <div ref={photoCarouselRef}>
        <PhotoCarousel />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <SideBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/hacking" element={<Hacking />} />
            <Route path="/troubleshooting-guides/:fileName" element={<TroubleshootingGuides />} />
            <Route path="/articles/:fileName" element={<GeneralArticles />} />
            <Route path="/hacking/cyber-guides/:fileName" element={<CyberGuides />} />
            <Route path="/hacking/cyber-articles/:fileName" element={<CyberArticles />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;