// VideosList.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import VideoCategory from './VideoCategory';

const VideosList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
