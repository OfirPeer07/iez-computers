// VideoCategory.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import VideoItem from './VideoItem';

const VideoCategory = ({ playlist, isMobile }) => {
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
    contentWidth: 0,
    containerWidth: 0
  });
  const [hasScroll, setHasScroll] = useState(false);
  const scrollRef = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Updates the scroll state based on the scroll container's dimensions
  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const contentWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;
    
    console.log('Scroll Debug:', { contentWidth, containerWidth });
    
    setScrollState((prevState) => ({
      ...prevState,
      canScrollRight: contentWidth > containerWidth, 
      canScrollLeft: container.scrollLeft > 0, 
      contentWidth,
      containerWidth
    }));
  }, []);

  // Handles the scroll event to scroll the container smoothly in the desired direction
  const handleScroll = useCallback((direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'right' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  // Check if the scroll container has horizontal scroll available
  const checkForScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const hasHorizontalScroll = container.scrollWidth > container.clientWidth;
    setHasScroll(hasHorizontalScroll); // Set hasScroll state based on availability
  }, []);

  // Observe changes to the container's size to check if horizontal scrolling is possible
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkForScroll();

    const resizeObserver = new ResizeObserver(() => {
      checkForScroll();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [checkForScroll]);

  // Attach event listener to handle scroll event when user scrolls manually
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScrollEvent = () => {
      updateScrollState();
    };

    container.addEventListener('scroll', handleScrollEvent, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScrollEvent);
    };
  }, [updateScrollState]);

  // Attach wheel event to handle scroll by mouse wheel
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const scrollAmount = 300; 
      
      // Scroll immediately instead of smoothly
      container.scrollBy({
        left: e.deltaY > 0 ? scrollAmount : -scrollAmount,
        behavior: 'auto'
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Handle touch events for mobile swipe
  const handleTouchStart = useCallback((e) => {
    if (window.innerWidth <= 768) return;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (window.innerWidth <= 768) return;
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (window.innerWidth <= 768) return;
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const container = scrollRef.current;
    
    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 1 : -1;
      const scrollAmount = container.clientWidth * 0.85;
      
      container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }, []);

  // Add touch event listeners
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div className={`video-category ${isMobile ? 'mobile-device' : ''}`}>
      <h2 className={`category-title ${isMobile ? 'mobile-device' : ''}`}>{playlist.title}</h2>
      <div className="video-scroll-wrapper">
        {!isMobile && (
          <button
            className="scroll-arrow right"
            onClick={() => handleScroll('left')}
            aria-label="גלול שמאלה"
          >
          </button>
        )}
        <div className={`video-scroll ${isMobile ? 'mobile-device' : ''}`} ref={scrollRef}>
          {playlist.videos.map((video) => (
            <VideoItem
              key={video.id}
              video={video}
              playlistFolder={playlist.folder}
              isMobile={isMobile}
            />
          ))}
        </div>
        {!isMobile && (
          <button
            className="scroll-arrow left"
            onClick={() => handleScroll('right')}
            aria-label="גלול ימינה"
          >
          </button>
        )}
      </div>
    </div>
  );
};

VideoCategory.propTypes = {
  playlist: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    folder: PropTypes.string.isRequired,
    videos: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        filename: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default VideoCategory;
