import React from 'react';
import { Link } from 'react-router-dom';
import LazyVideoFrame from './LazyVideoFrame';

const VideoItem = ({ video, playlistFolder }) => {
  return (
    <Link to={`/cyber/hacking/videos/${video.id}`} className="video-item">
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
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        {video.description && <p className="video-description">{video.description}</p>}
      </div>
    </Link>
  );
};

export default VideoItem;