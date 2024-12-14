import React from 'react';
import './MainPage.css'; // Importing CSS for styles
import cyberImage from './Cyber.png';
import itImage from './IT.png';

const MainPage = () => {
  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <div className="main-page">
      <header className="main-header">
        <h1 className="main-title">Welcome to the Future</h1>
        <p className="main-subtitle">Explore the cutting-edge worlds of Cybersecurity and IT</p>
      </header>

      <div className="cyber-it-navigation">
        <div
          className="image-container"
          onClick={() => navigateTo('/cyber')}
        >
          <img src={cyberImage} alt="Cyber Main Page" className="navigation-image" />
          <div className="overlay">
            <div className="overlay-content">
              <h2 className="overlay-title">Cyber Main Page</h2>
              <p className="overlay-description">Step into the world of Cybersecurity and protect the future.</p>
            </div>
          </div>
        </div>

        <div
          className="image-container"
          onClick={() => navigateTo('/information-technology')}
        >
          <img src={itImage} alt="Information Technology Main Page" className="navigation-image" />
          <div className="overlay">
            <div className="overlay-content">
              <h2 className="overlay-title">Information Technology Main Page</h2>
              <p className="overlay-description">Discover IT innovations that drive success.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="main-footer">
        <p className="footer-text">&#169; 2024 Future Visions. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainPage;
