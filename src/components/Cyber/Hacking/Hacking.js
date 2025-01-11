import React, { useState, useEffect } from 'react';
import './Hacking.css';
import hackerImage from './Hacker.png';
import hackerVideo from './vidHacker.mp4';
import videosVideo from './videos.mp4';
import articlesVideo from './articles.mp4';
import guidesVideo from './guides.mp4';

function Hacking() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [rectanglesVisible, setRectanglesVisible] = useState(true); // State for rectangle visibility

  useEffect(() => {
    const canvas = document.getElementById('matrix');
    if (!canvas) return;
  
    const context = canvas.getContext('2d');
    if (!context) return;
  
    const fontSize = 16;
    const katakana =
      'アカサタナハマヤラワガザダバパイキシチニヒミリギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレゲゼデベペオコソトノホモヨロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letters = katakana.split('');
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);
  
    // Resize canvas without reloading the effect
    const resizeCanvas = () => {
      const newColumns = Math.floor(window.innerWidth / fontSize);
      if (newColumns !== columns) {
        columns = newColumns;
        drops = Array(columns).fill(1);
      }
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
  
    // Debounce resize handling
    const debounceResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };
  
    let resizeTimeout = null;
    resizeCanvas();
    window.addEventListener('resize', debounceResize);
  
    const drawMatrix = () => {
      if (!context) return;
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      context.fillStyle = '#0F0';
      context.font = `${fontSize}px monospace`;
  
      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
  
        context.fillText(text, x, y);
  
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
  
    const interval = setInterval(drawMatrix, 33);
  
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', debounceResize);
    };
  }, [isVideoPlaying]);
  
  const handleHackerClick = () => {
    setIsVideoPlaying(true);
    setRectanglesVisible(false); // Hide rectangles when video is playing
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };
  
  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    setRectanglesVisible(true); // Show rectangles again after the video ends
  };

  return (
    <div className="app-container">
      {!isVideoPlaying && <canvas id="matrix" />}
      {isVideoPlaying && (
        <video
          className="background-video"
          src={hackerVideo}
          autoPlay
          onEnded={handleVideoEnd}
          playsInline
          muted
        />
      )}

      {!isVideoPlaying && (
        <div
          className="hacker"
          style={{ backgroundImage: `url(${hackerImage})` }}
          onClick={handleHackerClick}
        >
          <div className="click-me">Click Me</div>
        </div>
      )}

      {/* Conditionally render rectangles based on visibility */}
      {rectanglesVisible && (
        <>
          <div className="rectangle first" onClick={() => handleNavigation('hacking/articles')}>
            <video className="background-video" autoPlay loop muted playsInline>
              <source src={articlesVideo} type="video/mp4" />
            </video>
            <div className="hackingTitle">Articles</div>
          </div>
          <div className="rectangle second" onClick={() => handleNavigation('hacking/guides')}>
            <video className="background-video" autoPlay loop muted playsInline>
              <source src={guidesVideo} type="video/mp4" />
            </video>
            <div className="hackingTitle">Guides</div>
          </div>
          <div className="rectangle third" onClick={() => handleNavigation('hacking/videos')}>
            <video className="background-video" autoPlay loop muted playsInline>
              <source src={videosVideo} type="video/mp4" />
            </video>
            <div className="hackingTitle">Videos</div>
          </div>
        </>
      )}
    </div>
  );
}

export default Hacking;
