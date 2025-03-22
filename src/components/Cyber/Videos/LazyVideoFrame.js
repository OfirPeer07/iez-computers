// LazyVideoFrame.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import './VideosList.css';

const LazyVideoFrame = React.memo(({ src, alt, className, preload }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const videoRef = useRef(null);

  // Checking if is Mobile and Tablet
  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent.toLowerCase();
      const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
      const tabletRegex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/;
      const iosRegex = /ip(hone|od|ad)/i;
      
      const isMobileDevice = mobileRegex.test(ua);
      const isTablet = tabletRegex.test(ua);
      const isIOSDevice = iosRegex.test(ua);
      
      setIsMobile(isMobileDevice || isTablet);
      setIsIOS(isIOSDevice);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (preload && videoRef.current) {
      try {
        videoRef.current.src = src;
        videoRef.current.load();
        return; 
      } catch (error) {
        console.error('Error preloading video:', error);
      }
    }
    
    if (!('IntersectionObserver' in window)) {
      if (videoRef.current) {
        try {
          videoRef.current.src = src;
          videoRef.current.load();
        } catch (error) {
          console.error('Error loading video:', error);
        }
      }
      return;
    }
    
    try {
      const options = { 
        threshold: 0.01,
        rootMargin: isMobile ? '50px' : '100px'
      };
      
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            const video = videoRef.current;
            if (video) {
              try {
                video.src = src;
                video.load();
              } catch (error) {
                console.error('Error loading video in observer:', error);
              }
              observer.disconnect();
            }
          }
        },
        options
      );

      if (videoRef.current) {
        observer.observe(videoRef.current);
      }

      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    } catch (error) {
      console.error('Error with IntersectionObserver:', error);
      if (videoRef.current) {
        try {
          videoRef.current.src = src;
          videoRef.current.load();
        } catch (loadError) {
          console.error('Error fallback loading video:', loadError);
        }
      }
    }
  }, [src, isMobile, preload]);

  const handleLoad = useCallback(() => {
    try {
      setIsLoaded(true);
    } catch (error) {
      console.error('Error in handleLoad:', error);
    }
  }, []);

  return (
    <>
      {!isLoaded && (
        <div className={`video-placeholder loading-text ${isMobile ? 'mobile-device' : ''}`} aria-label="ממתין לטעינת הסרטון">
          <span className="loading-text-content">בטעינה</span>
        </div>
      )}
      <video
        ref={videoRef}
        className={`${className} ${isLoaded ? 'is-loaded' : 'is-loading'} ${isMobile ? 'mobile-device' : ''}`}
        onLoadedData={handleLoad}
        muted
        playsInline={true}
        webkit-playsinline="true"
        preload="none"
        aria-label={alt}
      >
        <source type="video/mp4" />
        {alt}
      </video>
    </>
  );
});

LazyVideoFrame.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  preload: PropTypes.bool
};

LazyVideoFrame.defaultProps = {
  preload: false
};

export default LazyVideoFrame;
