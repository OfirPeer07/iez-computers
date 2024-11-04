import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from '../MainPage/MainPage';
import SideBar from '../SideBar/SideBar';
import Hacking from '../Hacking/Hacking';
import CyberArticles from '../MarkdownDocs/CyberArticles';
import CyberGuides from '../MarkdownDocs/CyberGuides';
import TechnologyNews from '../MarkdownDocs/TechnologyNews';
import TroubleshootingGuides from '../MarkdownDocs/TroubleshootingGuides';
import ITdepartment from '../ITdepartment/ITdepartment'
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
            <Route path='*' element={<PageNotFound />} />
            <Route path="/" element={<MainPage />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/hacking" element={<Hacking />} />
            <Route path="/hacking/cyber-guides/:fileName" element={<CyberGuides />} />
            <Route path="/hacking/cyber-articles/:fileName" element={<CyberArticles />} />
            <Route path="/information-technology-department/technology-news/:fileName" element={<TechnologyNews />} />
            <Route path="/information-technology-department/troubleshooting-guides/:fileName" element={<TroubleshootingGuides />} />
            <Route path="/hacking/videos" element={<VideosList />} />
            <Route path="/hacking/videos/:id" element={<VideoPlayer />} />
            <Route path="/information-technology-department" element={<ITdepartment />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
