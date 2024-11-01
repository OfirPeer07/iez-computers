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
};

const VideoItem = React.memo(({ video, playlistFolder }) => {
  const formatDuration = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <Link to={`/video/${video.id}`} className="video-item" aria-label={`צפה בסרטון: ${video.title}`}>
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
      <div key={playlist.id} className="video-category">
        <h2 className="category-title">{playlist.title}</h2>
        <div className="video-scroll custom-scrollbar">
          {playlist.videos.map((video) => (
            <VideoItem 
              key={video.id} 
              video={video} 
              playlistFolder={playlist.folder} 
            />
          ))}
        </div>
      </div>
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
