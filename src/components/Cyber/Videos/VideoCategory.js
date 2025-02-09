// VideoCategory.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import VideoItem from './VideoItem';

const VideoCategory = React.memo(({ playlist }) => {
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
    contentWidth: 0,
    containerWidth: 0
  });
  const [hasScroll, setHasScroll] = useState(false);
  const scrollRef = useRef(null);
  const scrollCheckRef = useRef(null); // Using this to track scroll state

  // Updates the scroll state based on the scroll container's dimensions
  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const contentWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;
    
    console.log('Scroll Debug:', { contentWidth, containerWidth });
    
    setScrollState((prevState) => ({
      ...prevState,
      canScrollRight: contentWidth > containerWidth, // Can scroll right if content is wider than container
      canScrollLeft: container.scrollLeft > 0, // Can scroll left if we're not at the start
      contentWidth,
      containerWidth
    }));
  }, []);

  // Handles the scroll event to scroll the container smoothly in the desired direction
  const handleScroll = useCallback((direction) => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.8; // Scroll by 80% of the container width
    
    container.scrollBy({
      left: direction === 'left' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
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
      const scrollAmount = 300; // Increase scroll speed
      
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

  return (
    <div className="video-category">
      <h2 className="category-title">{playlist.title}</h2>
      <div className="video-scroll-wrapper">
        {hasScroll && (
          <>
            <div 
              className={`scroll-arrow left ${!scrollState.canScrollLeft ? 'disabled' : ''}`} // Disable arrow if can't scroll left
              onClick={() => handleScroll('left')}
              style={{ fontSize: '2rem', color: '#00ff00' }}
            >
              ‹
            </div>
            <div 
              className={`scroll-arrow right ${!scrollState.canScrollRight ? 'disabled' : ''}`} // Disable arrow if can't scroll right
              onClick={() => handleScroll('right')}
              style={{ fontSize: '2rem', color: '#00ff00' }}
            >
              ›
            </div>
          </>
        )}
        <div 
          ref={scrollRef}
          className="video-scroll custom-scrollbar"
        >
          {playlist.videos.map((video) => (
            <VideoItem 
              key={video.id} 
              video={video} 
              playlistFolder={playlist.folder} 
            />
          ))}
        </div>
      </div>
    </div>
  );
});

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
      })
    ).isRequired,
  }).isRequired,
};

export default VideoCategory;
