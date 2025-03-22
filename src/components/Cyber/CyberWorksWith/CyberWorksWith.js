import React, { useState } from 'react';
import './CyberWorksWith.css';
import { 
  FaShieldAlt, 
  FaServer, 
  FaNetworkWired, 
  FaLock, 
  FaCloudversify,
  FaUserSecret,
  FaCertificate,
  FaFileAlt,
  FaLaptopCode,
  FaBookReader,
  FaUsers,
  FaLightbulb,
  FaBrain,
  FaEye
} from 'react-icons/fa';

const CyberWorksWith = () => {
  const [failedImages, setFailedImages] = useState([]);
  
  const handleImageError = (index) => {
    if (!failedImages.includes(index)) {
      setFailedImages([...failedImages, index]);
    }
  };

  const expertiseAreas = [
    {
      icon: <FaNetworkWired />,
      title: 'בדיקות חוסן לתשתיות',
      description: 'מתמחה בביצוע בדיקות חוסן מקיפות לתשתיות IT, תקשורת, רשתות ומערכות הפעלה. זיהוי נקודות תורפה בארכיטקטורת התשתית וסיכוני אבטחה.',
    },
    {
      icon: <FaServer />,
      title: 'בדיקות אבטחה לשרתים',
      description: 'ניתוח אבטחה מעמיק לשרתים, שירותי רשת ותשתיות קריטיות. זיהוי ניצול חולשות הרשאות, תצורות שגויות ומנגנוני הזדהות.',
    },
    {
      icon: <FaCloudversify />,
      title: 'אבטחת תשתיות ענן',
      description: 'הערכת אבטחה ובדיקות חדירה למערכות תשתית מבוססות ענן. מיפוי תצורות שגויות והערכת מדיניות הרשאות ב־AWS, Azure ו־GCP.',
    },
    {
      icon: <FaUserSecret />,
      title: 'Red Team לתשתיות',
      description: 'ביצוע סימולציות תקיפה מתקדמות על תשתיות ארגוניות, תוך שימוש בטקטיקות תוקף אמיתיות למטרת שיפור יכולות ההגנה והזיהוי.',
    },
  ];

  const knowledgeAreas = [
    {
      name: 'אבטחת רשתות',
      description: 'הבנה יסודית של עקרונות אבטחת רשתות, פרוטוקולים, ומנגנוני הגנה. יכולת לזהות חולשות נפוצות בתצורות רשת.',
      icon: '/images/skills/network_logo.png'
    },
    {
      name: 'אבטחת מערכות הפעלה',
      description: 'הכרת מנגנוני האבטחה במערכות הפעלה שונות (Windows, Linux) וזיהוי נקודות תורפה בהגדרות ותצורות.',
      icon: '/images/skills/os_logo.png'
    },
    {
      name: 'בסיסי ידע בסקריפטינג',
      description: 'יכולות כתיבת סקריפטים בסיסיים ב-Python ו-Bash לאוטומציה של משימות אבטחה ותהליכי בדיקה.',
      icon: '/images/skills/script_logo.png'
    },
    {
      name: 'כלי בדיקות חוסן',
      description: 'הכרות עם מגוון כלי בדיקות חוסן כמו Nmap, Metasploit, וכלים נוספים הנמצאים בשימוש נפוץ בתעשייה.',
      icon: '/images/skills/tools_logo.png'
    },
  ];

  const professionalDevelopment = [
    {
      icon: <FaBookReader />,
      title: 'למידה מתמדת',
      description: 'מחויבות ללמידה מתמדת של טכנולוגיות, טכניקות ומגמות חדשות בעולם הסייבר. מעקב אחר מאמרים, כנסים וקהילות מקצועיות.',
    },
    {
      icon: <FaLightbulb />,
      title: 'קליטה מהירה',
      description: 'יכולת גבוהה לקליטה והטמעה מהירה של טכנולוגיות, כלים ומושגים חדשים. גישה אנליטית המאפשרת לימוד עצמאי והסתגלות מהירה לסביבות עבודה חדשות.',
    },
    {
      icon: <FaBrain />,
      title: 'חשיבה ייחודית',
      description: 'דרך חשיבה ייחודית המאפשרת זיהוי חולשות ואנומליות שגישות סטנדרטיות מתקשות לאתר. יכולת לראות קשרים בין מערכות ולנתח מצבים מורכבים מזוויות בלתי שגרתיות, מה שמעניק יתרון משמעותי באיתור נקודות תורפה בתשתיות.',
    },
    {
      icon: <FaEye />,
      title: 'ראייה הוליסטית',
      description: 'ראייה מערכתית רחבה של תשתיות ומערכות, המאפשרת לזהות נקודות תורפה בהקשר הרחב של הארגון. הבנה אינטואיטיבית של הקשרים בין מערכות שונות.',
    },
    {
      icon: <FaUsers />,
      title: 'שיתוף ידע בקהילה',
      description: 'השתתפות פעילה בקהילות סייבר מקומיות, פורומים ומפגשי Meetup. האמנה בשיתוף ידע כמנוע לצמיחה אישית ומקצועית.',
    },
    {
      icon: <FaLaptopCode />,
      title: 'סביבות תרגול עצמאיות',
      description: 'בניית סביבות תרגול בווירטואליזציה להתנסות עם כלים וטכניקות. השתתפות באתגרי CTF ובפלטפורמות כמו HackTheBox.',
    },
    {
      icon: <FaLightbulb />,
      title: 'חשיבה יצירתית',
      description: 'פיתוח גישה יצירתית לפתרון בעיות אבטחה. חיפוש דרכים לא שגרתיות לזיהוי ומיפוי חולשות אבטחה בסביבות ארגוניות.',
    },
  ];

  const certifications = [
    {
      icon: <FaCertificate />,
      title: 'CEH - Certified Ethical Hacker',
      description: 'הסמכה בינלאומית המעידה על מיומנויות ביצוע בדיקות חוסן מקיפות והכרת מתודולוגיות האקינג אתי.',
    },
    {
      icon: <FaCertificate />,
      title: 'ITSAFE PENTESTING INFRASTRUCTURE',
      description: 'הסמכה מקצועית המתמקדת בביצוע בדיקות חוסן לתשתיות ארגוניות. כוללת הכשרה מעמיקה בזיהוי, ניתוח וניצול חולשות במערכות תשתית.',
    }
  ];

  const renderKnowledgeCards = (knowledgeAreas) => {
    return knowledgeAreas.map((area, index) => (
      <div className="vendor-card" key={index}>
        <div className="vendor-logo">
          {area.icon && !failedImages.includes(index) ? (
            <img 
              src={area.icon} 
              alt={`${area.name} לוגו`} 
              className="logo-image" 
              onError={() => handleImageError(index)}
            />
          ) : (
            <div className="logo-placeholder">{area.name.charAt(0)}</div>
          )}
        </div>
        <h3>{area.name}</h3>
        <p>{area.description}</p>
      </div>
    ));
  };

  const renderServiceCards = (services) => {
    return services.map((service, index) => (
      <div className="benefit-card" key={index}>
        <div className="benefit-icon">{service.icon}</div>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
      </div>
    ));
  };

  return (
    <div className="works-with-container" dir="rtl">
      <div className="works-with-header">
        <h1>שירותי בדיקות חוסן לתשתיות</h1>
        <p className="subheading">
          מתמחה באבטחת תשתיות IT וסייבר, עם דגש על בדיקות חוסן לרשתות, שרתים ותשתיות. בתחילת דרכי המקצועית בתחום,
          אך מביא ידע טכני מעמיק וגישה שיטתית לזיהוי נקודות תורפה ושיפור מערך ההגנה בארגונים.
        </p>
      </div>

      <div className="services-section">
        <h2 className="section-title">התמחות בתשתיות</h2>
        <div className="benefits-grid">
          {renderServiceCards(expertiseAreas)}
        </div>
      </div>

      <div className="services-section">
        <h2 className="section-title">התפתחות מקצועית</h2>
        <div className="benefits-grid">
          {renderServiceCards(professionalDevelopment)}
        </div>
      </div>

      <div className="partners-section">
        <h2 className="section-title">תחומי ידע</h2>
        <div className="vendors-grid">
          {renderKnowledgeCards(knowledgeAreas)}
        </div>
      </div>

      <div className="services-section">
        <h2 className="section-title">הסמכות והשכלה</h2>
        <div className="benefits-grid">
          {renderServiceCards(certifications)}
        </div>
      </div>
    </div>
  );
};

export default CyberWorksWith;
