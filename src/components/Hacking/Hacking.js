import React, { useEffect } from 'react';
import './Hacking.css';

function Hacking() {
  useEffect(() => {
    const canvas = document.getElementById('matrix');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const resizeCanvas = () => {
      // Set canvas dimensions to fill the viewport
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Set the canvas size initially and when the window is resized
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = document.getElementById('matrix');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const katakana = 'アカサタナハマヤラワガザダバパイキシチニヒミリギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレゲゼデベペオコソトノホモヨロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letters = katakana.split('');

    const fontSize = 16;
    let columns = Math.floor(canvas.width / fontSize); // Recalculate columns based on canvas width
    let drops = Array.from({ length: columns }, () => 1);

    const draw = () => {
      // Reset canvas with a slight opacity to create the falling effect
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Set font color and style
      context.fillStyle = '#0F0';
      context.font = `${fontSize}px monospace`;

      // Loop through columns and draw random characters
      drops.forEach((y, index) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        const x = index * fontSize;
        context.fillText(text, x, y * fontSize);

        // Reset drop when it's out of view
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[index] = 0;
        }
        drops[index]++;
      });
    };

    const interval = setInterval(draw, 33);

    // Handle window resize to adjust columns and drops
    const handleResize = () => {
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => 1);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="app-container">
      <canvas id="matrix" data-testid="matrix"></canvas>
      <div className="hacker"></div>
      <div className="rectangle first" onClick={() => handleNavigation('hacking/cyber-articles')}>
        <div className="title">Articles</div>
      </div>
      <div className="rectangle second" onClick={() => handleNavigation('hacking/cyber-guides')}>
        <div className="title">Guides</div>
      </div>
      <div className="rectangle third" onClick={() => handleNavigation('hacking/videos')}>
        <div className="title">Videos</div>
      </div>
    </div>
  );
}

export default Hacking;
