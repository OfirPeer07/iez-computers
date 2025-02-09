import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import LazyVideoFrame from './LazyVideoFrame';

const VideoItem = React.memo(({ video, playlistFolder }) => {
  const formatDuration = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <Link to={`/cyber/hacking/videos/${video.id}`} className="video-item" aria-label={`צפה בסרטון: ${video.title}`}>
      <div className="video-thumbnail">
        {video.filename ? (
          <LazyVideoFrame 
            src={`/playlists/${playlistFolder}/${video.filename}`}
            alt={video.title}
            className="video-thumbnail"
          />
        ) : (
          <div className="video-placeholder">הסרטון הבא יעלה בקרוב</div>
        )}
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

export default VideoItem;
