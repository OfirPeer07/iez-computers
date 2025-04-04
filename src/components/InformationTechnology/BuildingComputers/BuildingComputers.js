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

// פונקציה לזיהוי מכשיר מובייל באמצעות User-Agent
const detectMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // רשימת ביטויים שמזהים מכשירים ניידים
  const mobileRegex = 
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(userAgent) 
    || 
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(userAgent.substr(0,4));
    
  return mobileRegex;
};

export default function BuildingComputers() {
  const [hoveredId, setHoveredId] = useState(null);
  const [imageError, setImageError] = useState({});
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null);

  // בדיקה האם המכשיר הוא מובייל
  useEffect(() => {
    try {
      // זיהוי מכשיר מובייל באמצעות User-Agent
      const mobile = detectMobileDevice();
      setIsMobile(mobile);
      
      console.log("האם המכשיר מובייל:", mobile);
    } catch (err) {
      console.error("שגיאה בזיהוי מכשיר:", err);
      // אם יש שגיאה בזיהוי, נשתמש בגישה אלטרנטיבית של רוחב מסך
      setIsMobile(window.innerWidth <= 768);
    }
  }, []);

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

  // פונקציה לטיפול בכניסת עכבר - פעילה רק בדסקטופ
  const handleMouseEnter = (id) => {
    if (!isMobile) {
      setHoveredId(id);
    }
  };
  
  // פונקציה לטיפול ביציאת עכבר - פעילה רק בדסקטופ
  const handleMouseLeave = () => {
    if (!isMobile) {
      setHoveredId(null);
    }
  };

  // פונקציה לטיפול בלחיצה - פעילה רק במובייל
  const handleCardClick = (id, event) => {
    if (isMobile) {
      event.preventDefault();
      setActiveCardId(activeCardId === id ? null : id);
    }
  };
  
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
    <div className={`container ${isMobile ? 'mobile-view' : ''}`}>
      <header className="pageHeader">
        <h1>המחשבים שהרכבתי</h1>
        <p className="subtitle">מחשבים מותאמים אישית בהרכבה עצמית</p>
      </header>

      <div className="computersGrid">
        {computersData.computers.map((computer) => (
          <div
            key={computer.id}
            className={`computerCard ${isMobile && activeCardId === computer.id ? 'active-mobile' : ''}`}
            onMouseEnter={() => handleMouseEnter(computer.id)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleCardClick(computer.id, e)}
          >
            <div className="imageContainer">
              {!imageError[computer.id] ? (
                <img
                  src={
                    hoveredId === computer.id ? computer.hoverImage : computer.mainImage
                  }
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
              
              {isMobile && (
                <div className="mobile-info-hint">
                  <span>{activeCardId === computer.id ? 'סגור' : 'הצג מפרט'}</span>
                </div>
              )}
            </div>

            <div className={`specs ${
              isMobile 
                ? activeCardId === computer.id ? 'active' : '' 
                : hoveredId === computer.id ? 'active' : ''
            }`}>
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