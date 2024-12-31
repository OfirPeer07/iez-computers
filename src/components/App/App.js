import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

// Import all Information Technology components  
import InformationTechnology from '../InformationTechnology/InformationTechnology';
import TechnologyNews from '../InformationTechnology/MarkdownDocs/TechnologyNews';
import ITdepartment from '../InformationTechnology/InfoTechDepartment/InfoTechDepartment';
import TroubleshootingGuides from '../InformationTechnology/MarkdownDocs/TroubleshootingGuides';

// Import all Cyber components  
import Cyber from '../Cyber/Cyber';
import Hacking from '../Cyber/Hacking/Hacking';
import CyberArticles from '../Cyber/MarkdownDocs/CyberArticles';
import CyberGuides from '../Cyber/MarkdownDocs/CyberGuides';
import VideosList from '../Cyber/Videos/VideosList';
import VideoPlayer from '../Cyber/Videos/VideoPlayer';

// Import all General components  
import PageNotFound from '../PageNotFound/PageNotFound';
import MainPage from '../MainPage/MainPage';
import SideBar from '../Cyber/SideBar/SideBar';
import ContactUs from '../ContactUs/ContactUs';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Conditionally Render Sidebar */}
        <ConditionalSidebar />
        <div className="content">
          <Routes>
            {/* Routin to: Relevant MainPage */}
            <Route path="/" element={<MainPage />} />
            <Route path="/cyber" element={<Cyber />} />
            <Route path="/information-technology" element={<InformationTechnology />} />

            {/* Contact Page */}
            <Route path="/contact-us" element={<ContactUs />} />

            {/* Hacking Section */}
            <Route path="/cyber/hacking" element={<Hacking />} />
            <Route path="/cyber/hacking/guides" element={<CyberGuides />} />
            <Route path="/cyber/hacking/guides/:fileName" element={<CyberGuides />} />
            <Route path="/cyber/hacking/articles" element={<CyberArticles />} />
            <Route path="/cyber/hacking/articles/:fileName" element={<CyberArticles />} />
            <Route path="/cyber/hacking/videos" element={<VideosList />} />
            <Route path="/cyber/hacking/videos/:id" element={<VideoPlayer />} />

            {/* IT Department Section */}
            <Route path="/information-technology/InfoTechDepartment/" element={<ITdepartment />} />
            <Route path="/information-technology/technology-news" element={<TechnologyNews />} />
            <Route path="/information-technology/technology-news/:fileName" element={<TechnologyNews />} />
            <Route path="/information-technology/troubleshooting-guides" element={<TroubleshootingGuides />} />
            <Route path="/information-technology/troubleshooting-guides/:fileName" element={<TroubleshootingGuides />} />
            <Route path="/information-technology/building-computers" element={<TroubleshootingGuides />} />

            {/* 404 Not Found */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Component to conditionally render the sidebar
function ConditionalSidebar() {
  const location = useLocation();
  // Add more paths to exclude the sidebar if needed
  const excludedPaths = ['/'];

  return !excludedPaths.includes(location.pathname) ? <SideBar /> : null;
}

export default App;
