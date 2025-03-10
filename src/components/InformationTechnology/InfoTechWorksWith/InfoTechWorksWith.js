import React from 'react';
import './InfoTechWorksWith.css';
import { FaServer, FaShieldAlt, FaLaptopCode, FaTools, FaNetworkWired, FaUserShield } from 'react-icons/fa';

const CyberWorksWith = () => {
  // נתוני ספקים
  const vendors = [
    {
      name: 'Dell',
      description: 'ספק מחשבים, שרתים וציוד היקפי מהמובילים בעולם. אנו מספקים פתרונות Dell מקצועיים לעסקים וללקוחות פרטיים.',
      logo: '/images/vendors/dell_logo.png'
    },
    {
      name: 'HP',
      description: 'שותף מורשה של HP המספק מחשבים, מדפסות וציוד היקפי איכותי. אנו מציעים מגוון פתרונות מבית HP לעסקים ופרטיים.',
      logo: '/images/vendors/hp_logo.png'
    },
    {
      name: 'Microsoft',
      description: 'שותף מורשה של Microsoft המספק רישוי תוכנה, פתרונות ענן ושירותי Microsoft 365 לארגונים ולקוחות פרטיים.',
      logo: '/images/vendors/microsoft_logo.png'
    },
    {
      name: 'Lenovo',
      description: 'ספק מורשה של Lenovo המציע מחשבים ניידים, מחשבי כף יד וציוד היקפי ללקוחות עסקיים ופרטיים באיכות גבוהה.',
      logo: '/images/vendors/lenovo_logo.png'
    },
  ];

  // נתוני שותפי סייבר
  const cyberPartners = [
    {
      name: 'CheckPoint',
      description: 'שותף של CheckPoint המספק פתרונות אבטחת מידע מתקדמים, חומות אש וטכנולוגיות הגנת סייבר לארגונים.',
      logo: '/images/vendors/checkpoint_logo.png'
    },
    {
      name: 'CrowdStrike',
      description: 'שותף של CrowdStrike המספק פתרונות הגנה מפני איומים מתקדמים, ניטור אירועי אבטחה והגנה בקצה.',
      logo: '/images/vendors/crowdstrike_logo.png'
    },
    {
      name: 'Fortinet',
      description: 'שותף של Fortinet המספק פתרונות אבטחת רשת, VPN, חומות אש ופתרונות אבטחה מקיפים לעסקים מכל הגדלים.',
      logo: '/images/vendors/fortinet_logo.png'
    },
  ];

  // שירותים ללקוחות פרטיים
  const privateServices = [
    {
      icon: <FaLaptopCode />,
      title: 'התקנה ותיקון מחשבים',
      description: 'שירותי התקנה, תיקון ותחזוקה של מחשבים אישיים ומחשבים ניידים. מענה מקצועי ומהיר לכל בעיה טכנית.',
    },
    {
      icon: <FaTools />,
      title: 'שדרוג חומרה',
      description: 'שירותי שדרוג חומרה כולל זיכרון, כונני SSD, כרטיסי מסך ומעבדים. פתרונות מותאמים אישית לשיפור ביצועים.',
    },
    {
      icon: <FaNetworkWired />,
      title: 'פתרונות רשת ביתיים',
      description: 'הקמה ותחזוקה של רשתות ביתיות, התקנת נתבים, מגבירי טווח WiFi ופתרונות אבטחת רשת ביתית.',
    },
  ];

  // שירותים לעסקים וחברות סייבר
  const businessServices = [
    {
      icon: <FaShieldAlt />,
      title: 'בדיקות חוסן',
      description: 'שירותי בדיקות חוסן (Penetration Testing) לאיתור פרצות אבטחה ונקודות תורפה במערכות ארגוניות.',
    },
    {
      icon: <FaServer />,
      title: 'ניהול תשתיות IT',
      description: 'שירותי ניהול ותחזוקת תשתיות IT לעסקים, כולל שרתים, גיבויים, תקשורת ואבטחת מידע עם תמיכה 24/7.',
    },
    {
      icon: <FaUserShield />,
      title: 'ייעוץ אבטחת מידע',
      description: 'שירותי ייעוץ מקצועיים בתחום אבטחת המידע והסייבר, כולל בניית תוכניות הגנה וסקרי סיכונים.',
    },
  ];

  // רינדור של כרטיסי ספקים
  const renderVendorCards = (vendors) => {
    return vendors.map((vendor, index) => (
      <div className="vendor-card" key={index}>
        <div className="vendor-logo">
          {vendor.logo ? (
            <img 
              src={vendor.logo} 
              alt={`${vendor.name} לוגו`} 
              className="logo-image" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.parentNode.innerHTML = `<div class="logo-placeholder">${vendor.name.charAt(0)}</div>`;
              }}
            />
          ) : (
            <div className="logo-placeholder">{vendor.name.charAt(0)}</div>
          )}
        </div>
        <h3>{vendor.name}</h3>
        <p>{vendor.description}</p>
      </div>
    ));
  };

  // רינדור של כרטיסי שירותים
  const renderBenefitCards = (benefits) => {
    return benefits.map((benefit, index) => (
      <div className="benefit-card" key={index}>
        <div className="benefit-icon">{benefit.icon}</div>
        <h3>{benefit.title}</h3>
        <p>{benefit.description}</p>
      </div>
    ));
  };

  return (
    <div className="works-with-container" dir="rtl">
      <div className="works-with-header">
        <h1>עובדים עם</h1>
        <p className="subheading">
          ב-IEZ אנו גאים לעבוד עם הספקים המובילים בתעשייה ולספק שירותים מקצועיים ברמה הגבוהה ביותר. 
          מצד אחד אנו שותפים של חברות הטכנולוגיה המובילות, ומצד שני אנו מספקים שירותים מקצועיים ללקוחות פרטיים ולחברות.
        </p>
      </div>

      {/* ספקים מורשים */}
      <div className="partners-section">
        <h2 className="section-title">ספקים מורשים</h2>
        <div className="vendors-grid">
          {renderVendorCards(vendors)}
        </div>
      </div>

      {/* שותפי סייבר */}
      <div className="partners-section">
        <h2 className="section-title">שותפי סייבר</h2>
        <div className="vendors-grid">
          {renderVendorCards(cyberPartners)}
        </div>
      </div>

      {/* שירותים ללקוחות פרטיים */}
      <div className="services-section">
        <h2 className="section-title">שירותים ללקוחות פרטיים</h2>
        <div className="benefits-grid">
          {renderBenefitCards(privateServices)}
        </div>
      </div>

      {/* שירותים לעסקים */}
      <div className="services-section">
        <h2 className="section-title">שירותים לעסקים</h2>
        <div className="benefits-grid">
          {renderBenefitCards(businessServices)}
        </div>
      </div>
    </div>
  );
};

export default CyberWorksWith;
