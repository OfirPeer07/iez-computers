import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// Import all the components you mentioned
import MainPage from '../MainPage/MainPage';
import SideBar from '../SideBar/SideBar';
import Hacking from '../Hacking/Hacking';
import CyberArticles from '../MarkdownDocs/CyberArticles';
import CyberGuides from '../MarkdownDocs/CyberGuides';
import TechnologyNews from '../MarkdownDocs/TechnologyNews';
import TroubleshootingGuides from '../MarkdownDocs/TroubleshootingGuides';
import ITdepartment from '../ITdepartment/ITdepartment';
import VideosList from '../Videos/VideosList'; // Import the VIDEOS component
import VideoPlayer from '../Videos/VideoPlayer'; // Import the VideoPlayer component
import ContactUs from '../ContactUs/ContactUs';
import PageNotFound from '../PageNotFound/PageNotFound';


function App() {
  return (
    <Router>
      <div className="App">
        <SideBar />
        <div className="content">
          <Routes>
            {/* 404 Not Found Route */}
            <Route path="*" element={<PageNotFound />} />
            
            {/* Main Pages */}
            <Route path="/" element={<MainPage />} />
            <Route path="/contact-us" element={<ContactUs />} />
            
            {/* Section Pages */}
            <Route path="/hacking" element={<Hacking />} />
            <Route path="/hacking/cyber-guides/:fileName" element={<CyberGuides />} />
            <Route path="/hacking/cyber-guides" element={<CyberGuides />} />
            <Route path="/hacking/cyber-articles" element={<CyberArticles />} />
            <Route path="/hacking/cyber-articles/:fileName" element={<CyberArticles />} />
            
            {/* Videos Section */}
            <Route path="/hacking/videos" element={<VideosList />} />
            <Route path="/hacking/videos/:id" element={<VideoPlayer />} />

            {/* IT Department Section */}
            <Route path="/information-technology-department" element={<ITdepartment />} />
            <Route path="/information-technology-department/technology-news" element={<TechnologyNews />} />
            <Route path="/information-technology-department/technology-news/:fileName" element={<TechnologyNews />} />
            <Route path="/information-technology-department/troubleshooting-guides" element={<TroubleshootingGuides />} />
            <Route path="/information-technology-department/troubleshooting-guides/:fileName" element={<TroubleshootingGuides />} />
            <Route path="/information-technology-department/building-computers" element={<TroubleshootingGuides />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
