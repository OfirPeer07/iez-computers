import React from 'react';
import { Link } from 'react-router-dom';
import { FaNetworkWired, FaTools, FaServer, FaDesktop, FaDatabase } from 'react-icons/fa';
import './InfoTechWorksWith.css';

const InfoTechWorksWith = () => {
  const vendors = [
    {
      name: 'מור לוי יבואן רשמי',
      description: 'יבואן רשמי של מגוון מוצרי חומרה ואלקטרוניקה איכותיים. אני עובד עם מור לוי להבאת הפתרונות הטובים ביותר ללקוחותיי.',
      logo: '/images/vendors/mor_levy_logo.png'
    },
    {
      name: 'גרנד אדוונס',
      description: 'ספק פתרונות מחשוב מתקדמים וציוד היקפי. באמצעות גרנד אדוונס אני מספק רכיבי מחשב ופתרונות טכנולוגיים מתקדמים.',
      logo: '/images/vendors/grand_advance_logo.png'
    },
    {
      name: 'איסטרוניקס',
      description: 'יבואן ומפיץ מוביל של מוצרי אלקטרוניקה ומחשבים. אני משתמש במוצרי איסטרוניקס לספק פתרונות אמינים ללקוחותיי.',
      logo: '/images/vendors/eastronics_logo.png'
    },
    {
      name: 'C-DATA',
      description: 'ספק מוביל של פתרונות תקשורת ואחסון נתונים. אני עובד עם C-DATA לספק פתרונות תקשורת ואחסון מידע מתקדמים.',
      logo: '/images/vendors/cdata_logo.png'
    },
    {
      name: 'TZAG',
      description: 'ספק של פתרונות אבטחה וציוד מחשוב איכותי. באמצעות TZAG אני מספק ללקוחותיי פתרונות אבטחה מתקדמים לצד ציוד מחשוב.',
      logo: '/images/vendors/tzag_logo.png'
    },
  ];

  const privateServices = [
    {
      title: 'התקנה ותיקון מחשבים',
      description: 'שירותי התקנה, תיקון ותחזוקת מחשבים ביתיים. אני מתמחה בפתרון בעיות חומרה ותוכנה.',
      icon: <FaTools />
    },
    {
      title: 'שדרוגי חומרה',
      description: 'שדרוג רכיבי חומרה כמו זיכרון, דיסקים וכרטיסי מסך לשיפור ביצועי המחשב.',
      icon: <FaDesktop />
    },
    {
      title: 'פתרונות רשת ביתית',
      description: 'התקנה והגדרה של רשתות ביתיות, מכשירי נתב אלחוטיים ופתרונות קישוריות.',
      icon: <FaNetworkWired />
    },
    {
      title: 'שחזור מידע וגיבויים',
      description: 'שירותי שחזור מידע מדיסקים פגומים והקמת מערכות גיבוי אוטומטיות להגנה על המידע.',
      icon: <FaDatabase />
    },
    {
      title: 'בניית מחשבים מותאמים אישית',
      description: 'תכנון ובניית מחשבים ביתיים מותאמים אישית לפי צרכי הלקוח ותקציבו.',
      icon: <FaServer />
    },
  ];

  const renderVendorCards = (vendorList) => {
    return vendorList.map((vendor, index) => (
      <div className="vendor-card" key={`vendor-${index}`}>
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

  const renderBenefitCards = (benefitList) => {
    return benefitList.map((benefit, index) => (
      <div className="benefit-card" key={`benefit-${index}`}>
        <div className="benefit-icon">
          {benefit.icon}
        </div>
        <h3 className="benefit-title">{benefit.title}</h3>
        <p className="benefit-description">{benefit.description}</p>
      </div>
    ));
  };

  return (
    <div className="works-with-container" dir="rtl">
      <div className="works-with-header">
        <h1>שירותי טכנאי מחשבים</h1>
        <p className="subheading">
          אני מספק שירותי טכנאות מחשבים ברמה הגבוהה ביותר ללקוחות פרטיים. 
          אני עובד עם המותגים המובילים בתעשייה ומספק פתרונות מקצועיים לכל צרכי המחשוב שלכם.
        </p>
      </div>

      <div className="services-section">
        <h2 className="section-title">השירותים שאני מציע</h2>
        <div className="benefits-grid">
          {renderBenefitCards(privateServices)}
        </div>
      </div>

      <div className="partners-section">
        <h2 className="section-title">הספקים איתם אני עובד</h2>
        <div className="vendors-grid">
          {renderVendorCards(vendors)}
        </div>
      </div>

      <div className="cta-section">
        <h2>צריכים עזרה עם המחשב?</h2>
        <p>צרו איתי קשר לקבלת ייעוץ מקצועי או להזמנת שירות</p>
        <Link to="/contact-us" className="cta-button">צרו קשר עכשיו</Link>
      </div>
    </div>
  );
};

export default InfoTechWorksWith;
