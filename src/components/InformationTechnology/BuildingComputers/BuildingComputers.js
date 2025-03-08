import React, { useState, useEffect } from 'react';
import { FaMicrochip, FaMemory, FaDesktop, FaServer, FaHdd, FaLaptop } from 'react-icons/fa';
import computersData from './computers.json';
import './BuildingComputers.css';

const specIcons = {
  cpu: FaMicrochip,
  gpu: FaDesktop,
  ram: FaMemory,
  motherboard: FaServer,
  storage: FaHdd,
  case: FaLaptop,
};

const specLabels = {
  cpu: 'מעבד',
  gpu: 'כרטיס מסך',
  ram: 'זיכרון',
  motherboard: 'לוח אם',
  storage: 'אחסון',
  case: 'קייס',
};

export default function BuildingComputers() {
  const [hoveredId, setHoveredId] = useState(null);
  const [imageError, setImageError] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (!computersData || !computersData.computers || !Array.isArray(computersData.computers)) {
        throw new Error('נתוני המחשבים אינם בפורמט הנכון');
      }
    } catch (err) {
      console.error('שגיאה בטעינת נתוני המחשבים:', err);
      setError(err.message);
    }
  }, []);

  const handleMouseEnter = (id) => setHoveredId(id);
  const handleMouseLeave = () => setHoveredId(null);
  const handleImageError = (id) => {
    console.warn(`שגיאה בטעינת תמונה למחשב ${id}`);
    setImageError(prev => ({ ...prev, [id]: true }));
  };

  if (error) {
    return (
      <div className="error-container" style={{ textAlign: 'center', padding: '20px' }}>
        <h2>😕 שגיאה</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="pageHeader">
        <h1>המחשבים שהרכבתי</h1>
        <p className="subtitle">מחשבים מותאמים אישית בהרכבה עצמית</p>
      </header>

      <div className="computersGrid">
        {computersData.computers.map((computer) => (
          <div
            key={computer.id}
            className="computerCard"
            onMouseEnter={() => handleMouseEnter(computer.id)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="imageContainer">
              {!imageError[computer.id] ? (
                <img
                  src={hoveredId === computer.id ? computer.hoverImage : computer.mainImage}
                  alt={`מחשב מותאם אישית ${computer.id}`}
                  className="computerImage"
                  onError={() => handleImageError(computer.id)}
                  loading="lazy"
                />
              ) : (
                <div className="errorImage">
                  <span>😕</span>
                  <p>התמונה אינה זמינה כרגע</p>
                </div>
              )}
            </div>

            <div className={`specs ${hoveredId === computer.id ? 'active' : ''}`}>
              <h3>מפרט טכני</h3>
              <ul>
                {Object.entries(computer.specs).map(([key, value], index) => {
                  const Icon = specIcons[key];
                  return (
                    <li key={key} style={{ '--item-index': index }}>
                      <Icon className="specIcon" aria-hidden="true" />
                      <span>{specLabels[key]}: {value}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}