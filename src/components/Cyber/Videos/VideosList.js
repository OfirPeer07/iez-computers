import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
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

const VideoItem = React.memo(({ video, playlistFolder }) => {
  const formatDuration = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <Link to={`/cyber/hacking/videos/${video.id}`} className="video-item" aria-label={`צפה בסרטון: ${video.title}`}>
      <div className="video-thumbnail">
        <LazyVideoFrame 
          src={`/playlists/${playlistFolder}/${video.filename}`}
          alt={video.title}
          className="video-thumbnail"
        />
        <div className="play-button" aria-hidden="true"></div>
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        {video.duration && <span className="video-duration">{formatDuration(video.duration)}</span>}
        {video.description && <p className="video-description">{video.description}</p>}
      </div>
    </Link>
  );
});

VideoItem.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.number.isRequired,
    filename: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    duration: PropTypes.number,
  }).isRequired,
  playlistFolder: PropTypes.string.isRequired,
};

const VideoCategory = React.memo(({ playlist }) => {
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
    contentWidth: 0,
    containerWidth: 0
  });
  const [hasScroll, setHasScroll] = useState(false);
  const scrollRef = useRef(null);
  const scrollCheckRef = useRef(null);

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const contentWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;
    
    console.log('Scroll Debug:', { contentWidth, containerWidth });
    
    setScrollState({
      canScrollRight: true,
      canScrollLeft: true,
      contentWidth,
      containerWidth
    });
  }, []);

  const handleScroll = useCallback((direction) => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    
    container.scrollBy({
      left: direction === 'left' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }, []);

  const checkForScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const hasHorizontalScroll = container.scrollWidth > container.clientWidth;
    setHasScroll(hasHorizontalScroll);
  }, []);

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

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const scrollAmount = 300; // הגדלת מהירות הגלילה
      
      // גלילה מיידית במקום smooth
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

  return (
    <div className="video-category">
      <h2 className="category-title">{playlist.title}</h2>
      <div className="video-scroll-wrapper">
        {hasScroll && (
          <>
            <div 
              className={`scroll-arrow left`}
              onClick={() => handleScroll('left')}
              style={{ fontSize: '2rem', color: '#00ff00' }}
            >
              ‹
            </div>
            <div 
              className={`scroll-arrow right`}
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

const VideosList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlaylists = useCallback(async () => {
    try {
      const response = await fetch('/playlists-json.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlaylists(data);
    } catch (e) {
      console.error('Error loading playlists:', e);
      setError(`שגיאה בטעינת רשימות ההשמעה: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const renderedPlaylists = useMemo(() => (
    playlists.map((playlist) => (
      <VideoCategory key={playlist.id} playlist={playlist} />
    ))
  ), [playlists]);

  if (loading) return <div className="loading" aria-live="polite">טוען...</div>;
  if (error) return <div className="error" aria-live="assertive">שגיאה: {error}</div>;
  if (playlists.length === 0) return <div className="no-content" aria-live="polite">אין פלייליסטים זמינים</div>;

  return (
    <div className="videos-page videos-list-page">
      <div className="videos-container">
        {renderedPlaylists}
      </div>
    </div>
  );
};

export default VideosList;