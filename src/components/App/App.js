import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
//import CTFGame from '../CTFGame/CTFGame';
import './App.css';

// Import all Information Technology components  
import InformationTechnology from '../InformationTechnology/InformationTechnology';
import InfoTechWorksWith from '../InformationTechnology/InfoTechWorksWith/InfoTechWorksWith';
import TroubleshootingGuides from '../InformationTechnology/MarkdownDocs/TroubleshootingGuides';
import BuildingComputers from '../InformationTechnology/BuildingComputers/BuildingComputers';
import ITdepartment from '../InformationTechnology/InfoTechDepartment/InfoTechDepartment';
import TechnologyNews from '../InformationTechnology/MarkdownDocs/TechnologyNews';

// Import all Cyber components  
import Cyber from '../Cyber/Cyber';
import CyberWorksWith from '../Cyber/CyberWorksWith/CyberWorksWith';
import CyberArticles from '../Cyber/MarkdownDocs/CyberArticles';
import CyberGuides from '../Cyber/MarkdownDocs/CyberGuides';
import VideoPlayer from '../Cyber/Videos/VideoPlayer';
import VideosList from '../Cyber/Videos/VideosList';

// Import all General components  
import { lazy, Suspense } from 'react';
import PageNotFound from '../PageNotFound/PageNotFound';
import CyberBar from '../Cyber/Sidebars/CyberBar';
import InfoTechBar from '../InformationTechnology/InfoTechBar/InfoTechBar';
import ContactUs from '../ContactUs/ContactUs';
import Thanks from '../Thanks/Thanks';
import CacheClearOnRouteChange from '../ClearCache/ClearCache';



function App() {
  const Hacking = lazy(() => import('../Cyber/Hacking/Hacking'));
  const MainPage = lazy(() => import('../MainPage/MainPage'));
  return (
    <Router>
      {/* ✅ This runs the cache clear logic on every route change */}
      <CacheClearOnRouteChange />      
      <div className="App">
        {/* Conditionally Render Sidebar */}
        <ConditionalSidebar />
        <div className="content">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Routin to: Relevant MainPage */}
              <Route path="/" element={<MainPage />} />
              <Route path="/cyber" element={<Cyber />} />
              <Route path="/information-technology" element={<InformationTechnology />} />
              {/*<Route path="/ctf-game" component={CTFGame} /> {/* Route for the CTF game */}

              {/* Contact Page */}
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/thanks" element={<Thanks />} />
              <Route path="/cyber/works-with" element={<CyberWorksWith />} />
              <Route path="/information-technology/works-with" element={<InfoTechWorksWith />} />


              {/* Hacking Section For Computers */}
              <Route path="/cyber/hacking" element={<Hacking />} />
              <Route path="/cyber/hacking/guides" element={<CyberGuides />} />
              <Route path="/cyber/hacking/guides/:fileName" element={<CyberGuides />} />
              <Route path="/cyber/hacking/articles" element={<CyberArticles />} />
              <Route path="/cyber/hacking/articles/:fileName" element={<CyberArticles />} />
              <Route path="/cyber/hacking/videos" element={<VideosList />} />
              <Route path="/cyber/hacking/videos/:id" element={<VideoPlayer />} />

              {/* Information-Technology Section For Computers&Mobile */}
              <Route path="/information-technology/InfoTechDepartment/" element={<ITdepartment />} />
              <Route path="/information-technology/technology-news" element={<TechnologyNews />} />
              <Route path="/information-technology/technology-news/:fileName" element={<TechnologyNews />} />
              <Route path="/information-technology/troubleshooting-guides" element={<TroubleshootingGuides />} />
              <Route path="/information-technology/troubleshooting-guides/:fileName" element={<TroubleshootingGuides />} />
              <Route path="/information-technology/building-computers" element={<BuildingComputers />} />

              {/* 404 Not Found */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
          {/* Invisible Block for Safari Scrolling Issue */}
          <div className="invisible-block"></div>         
        </div>
      </div>
    </Router>
  );
}

// Component to conditionally render the sidebar
function ConditionalSidebar() {
  const location = useLocation();
  
  // Conditionally render CyberBar or InfoTechBar based on the path
  if (location.pathname.startsWith('/cyber')) {
    return <CyberBar />;
  }

  if (location.pathname.startsWith('/information-technology')) {
    return <InfoTechBar />;
  }

  // No sidebar for other routes
  return null;
}

export default App;
 