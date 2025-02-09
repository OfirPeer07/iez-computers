// LazyVideoFrame.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import './VideosList.css';

const LazyVideoFrame = React.memo(({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const video = videoRef.current;
          if (video) {
            video.src = src;
            video.load();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  const handleLoad = useCallback(() => setIsLoaded(true), []);

  return (
    <>
      {!isLoaded && <div className="video-placeholder" aria-label="ממתין לטעינת הסרטון">הסרטון יעלה בקרוב</div>}
      <video
        ref={videoRef}
        className={`${className} ${isLoaded ? 'is-loaded' : 'is-loading'}`}
        onLoadedData={handleLoad}
        muted
        playsInline
        aria-label={alt}
      >
        <source type="videos/mp4" />
        {alt}
      </video>
    </>
  );
});

LazyVideoFrame.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default LazyVideoFrame;

