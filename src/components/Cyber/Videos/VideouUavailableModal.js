import React from 'react';

const VideoUnavailableModal = ({ onClose, onBackToList }) => {
  return (
    <div className="video-unavailable-modal" role="dialog" aria-labelledby="modal-title">
      <button className="close-button" onClick={onClose} aria-label="סגור">×</button>
      <h3 id="modal-title">היי! נראה שהסרטון הבא לא עלה עדיין</h3>
      <p>אל דאגה, הוא יעלה בקרוב. בינתיים אתם יכולים לחזור אחורה או לעבור לסרטונים ומאמרים אחרים</p>
      <div className="modal-buttons">
        <button onClick={onClose}>חזור</button>
        <button onClick={onBackToList}>חזרה לרשימת הסרטונים</button>
      </div>
    </div>
  );
};

export default VideoUnavailableModal;