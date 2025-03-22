import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './VideoPlayer.css';

const LazyVideoFrame = React.memo(({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);

  // Checking if is Mobile or Tablet
  useEffect(() => {
    const checkDevice = () => {
      const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
      const tabletRegex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/;
      
      const isMobileDevice = mobileRegex.test(navigator.userAgent.toLowerCase());
      const isTablet = tabletRegex.test(navigator.userAgent.toLowerCase());
      
      setIsMobile(isMobileDevice || isTablet);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

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

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [mdContent, setMdContent] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(null);
  const itemRefs = useRef({});

  // בדיקה אם המכשיר הוא מובייל או טאבלט
  useEffect(() => {
    const checkMobile = () => {
      const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
      const tabletRegex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/;
      
      const isMobileDevice = mobileRegex.test(navigator.userAgent.toLowerCase());
      const isTablet = tabletRegex.test(navigator.userAgent.toLowerCase());
      
      setIsMobile(isMobileDevice || isTablet);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchVideoAndPlaylist = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMdContent('');

    try {
      const response = await fetch('/playlists-json.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const foundPlaylist = data.find(p => p.videos.some(v => v.id === parseInt(id, 10)));
      if (!foundPlaylist) {
        throw new Error('הסרטון לא נמצא');
      }
      const foundVideo = foundPlaylist.videos.find(v => v.id === parseInt(id, 10));
      setVideo({ ...foundVideo, playlistFolder: foundPlaylist.folder });
      setPlaylist(foundPlaylist);

      if (foundVideo.mdContent) {
        try {
          const mdResponse = await fetch(`/playlists/${foundPlaylist.folder}/${foundVideo.mdContent}`);
          if (mdResponse.ok) {
            const mdText = await mdResponse.text();
            setMdContent(mdText);
          } else {
            console.warn(`קובץ MD לא נמצא עבור סרטון ${foundVideo.id}`);
          }
        } catch (mdError) {
          console.error('שגיאה בטעינת קובץ MD:', mdError);
        }
      }
    } catch (e) {
      console.error('Error loading video:', e);
      setError(`שגיאה בטעינת הסרטון: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVideoAndPlaylist();
  }, [fetchVideoAndPlaylist]);

  useEffect(() => {
    if (scrollRef.current && video && playlist?.videos) {
      const currentIndex = playlist.videos.findIndex(v => v.id === video.id);
      const nextVideoElement = itemRefs.current[playlist.videos[currentIndex + 1]?.id];
      
      if (nextVideoElement) {
        const scrollPosition = nextVideoElement.offsetTop - scrollRef.current.offsetTop;
        scrollRef.current.scrollTop = scrollPosition;
      }
    }
  }, [video, playlist]);

  const handleVideoError = useCallback(() => {
    setShowUnavailableModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowUnavailableModal(false);
  }, []);

  const navigateToVideoList = useCallback(() => {
    navigate('/cyber/hacking/videos/');
  }, [navigate]);

  const handleNextVideo = useCallback(() => {
    if (playlist && video) {
      const currentIndex = playlist.videos.findIndex(v => v.id === video.id);
      if (currentIndex < playlist.videos.length - 1) {
        const nextVideo = playlist.videos[currentIndex + 1];
        if (nextVideo.filename) {
          navigate(`/cyber/hacking/videos/${nextVideo.id}`);
        } else {
          setShowUnavailableModal(true);
        }
      }
    }
  }, [playlist, video, navigate]);

  if (loading) return <div className="loading loading-text" aria-live="polite"><span className="loading-text-content">בטעינה</span></div>;
  if (error) return <div className="error" aria-live="assertive">שגיאה: {error}</div>;
  if (!video) return <div className="no-content" aria-live="polite">הסרטון לא נמצא</div>;

  const currentIndex = playlist.videos.findIndex(v => v.id === video.id);
  const prevVideo = currentIndex > 0 ? playlist.videos[currentIndex - 1] : null;
  const nextVideo = currentIndex < playlist.videos.length - 1 ? playlist.videos[currentIndex + 1] : null;

  return (
    <div className={`videos-page single-video-page ${isMobile ? 'mobile-device' : ''}`}>
      <div className={`video-player-container ${isMobile ? 'mobile-device' : ''}`}>
        <Link to="/cyber/hacking/videos" className="back-to-videos">חזרה לרשימת הסרטונים</Link>
        {video.filename ? (
          <video 
            controls 
            src={`/playlists/${video.playlistFolder}/${video.filename}`}
            onError={handleVideoError}
            playsInline={isMobile}
          />
        ) : (
          <div className="video-placeholder loading-text">
            <span className="loading-text-content">בטעינה</span>
          </div>
        )}
        <div className={`navigation-buttons ${isMobile ? 'mobile-device' : ''}`}>
          {prevVideo && (
            <button 
              onClick={() => navigate(`/cyber/hacking/videos/${prevVideo.id}`)} 
              className={`prev-video ${isMobile ? 'mobile-device' : ''}`}
            >
              הסרטון הקודם
            </button>
          )}
          {nextVideo && (
            <button 
              onClick={() => navigate(`/cyber/hacking/videos/${nextVideo.id}`)}  
              className={`next-video ${isMobile ? 'mobile-device' : ''}`}
            >
              הסרטון הבא
            </button>
          )}
        </div>
        <div className={`video-info ${isMobile ? 'mobile-device' : ''}`}>
          <h1>{video.title}</h1>
          {video.description && <p className="video-description">{video.description}</p>}
        </div>
        {mdContent && (
          <div className="video-md-content">
            <ReactMarkdown
              children={mdContent}
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            />
          </div>
        )}
      </div>
      {playlist && (
        <div className="related-videos">
          <h2>הסרטונים הבאים</h2>
          <div className="video-scroll" ref={scrollRef}>
            {playlist.videos.filter(v => v.id !== video.id).map((relatedVideo) => (
              <div 
                key={relatedVideo.id} 
                ref={el => itemRefs.current[relatedVideo.id] = el}
                className="related-video-item"
              >
                <VideoItem 
                  video={relatedVideo} 
                  playlistFolder={playlist.folder} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {showUnavailableModal && (
        <div className="modal-overlay">
          <VideoUnavailableModal 
            onClose={closeModal} 
            onBackToList={navigateToVideoList} 
          />
        </div>
      )}
    </div>
  );
};

const VideoUnavailableModal = React.memo(({ onClose, onBackToList }) => (
  <div className="video-unavailable-modal" role="dialog" aria-labelledby="modal-title">
    <button className="close-button" onClick={onClose} aria-label="סגור">×</button>
    <h3 id="modal-title">היי! נראה שהסרטון הבא לא עלה עדיין</h3>
    <p>אל דאגה, הוא יעלה בקרוב. <br/>
      בינתיים אתם יכולים לחזור אחורה או לעבור לסרטונים ומאמרים אחרים.</p>
    <div className="modal-buttons">
      <button onClick={onClose}>חזור</button>
      <button onClick={onBackToList}>חזרה לרשימת הסרטונים</button>
    </div>
  </div>
));

VideoUnavailableModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBackToList: PropTypes.func.isRequired,
};

export default VideoPlayer;