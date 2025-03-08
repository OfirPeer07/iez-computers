// VideosList.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import VideoCategory from './VideoCategory';
import './VideosList.css';

const VideosList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const fetchPlaylists = useCallback(async () => {
    try {
      const response = await fetch('/playlists-json.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPlaylists(data);
    } catch (e) {
      setError(`שגיאה בטעינת רשימות ההשמעה: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

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

  const renderedPlaylists = useMemo(() => (
    playlists.map((playlist) => (
      <VideoCategory 
        key={playlist.id} 
        playlist={playlist}
        isMobile={isMobile}
      />
    ))
  ), [playlists, isMobile]);

  if (loading) return <div className="loading" aria-live="polite">טוען...</div>;
  if (error) return <div className="error" aria-live="assertive">שגיאה: {error}</div>;
  if (playlists.length === 0) return <div className="no-content" aria-live="polite">אין פלייליסטים זמינים</div>;

  return (
    <div className={`videos-page videos-list-page ${isMobile ? 'mobile-device' : ''}`}>
      <div className="videos-container">
        {renderedPlaylists}
      </div>
    </div>
  );
};

export default VideosList;
