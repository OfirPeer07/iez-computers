import React from 'react';
import { Phone, Mail, MessageCircle, Send, Clock, BellRing, Linkedin } from 'lucide-react';
import './ContactUs.css';

const ContactUs = () => {
  const phoneNumber = "+972508829793";
  const email = "IEZ@cyberservices.com";
  const whatsappNumber = "+972547758567";
  const telegramUsername = "hoodexe";
  const telegramChannel1 = "+4AEO8NTydHYxMDQ0";
  const telegramChannel2 = "+K7S8HGNgPRQ3Nzg8";
  const linkedinProfile = "idan-emanuel-zohar";

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 255, 0, 0.1)',
    color: '#e0e0e0',
    direction: 'rtl',
  };

  const titleStyle = {
    color: '#0f0',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2rem',
    textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
  };

  const contactMethodsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const contactMethodStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#e0e0e0',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  };

  const contactMethodHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
  };

  const iconStyle = {
    marginLeft: '1rem',
    color: '#0f0',
    transition: 'transform 0.3s ease',
  };

  const textStyle = {
    fontSize: '1.1rem',
  };

  const descriptionStyle = {
    fontSize: '0.9rem',
    color: '#aaa',
    marginTop: '0.5rem',
  };

  const workingHoursStyle = {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = '#3a3a3a';
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 255, 0, 0.3)';
    e.currentTarget.querySelector('svg').style.transform = 'scale(1.2)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = '#2a2a2a';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    e.currentTarget.querySelector('svg').style.transform = 'scale(1)';
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>צור קשר</h1>
      <div style={contactMethodsStyle}>
        <a 
          href={`tel:${phoneNumber}`} 
          style={contactMethodStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="התקשר אלינו"
        >
          <div style={contactMethodHeaderStyle}>
            <Phone size={24} style={iconStyle} aria-hidden="true" />
            <span style={textStyle}>{phoneNumber}</span>
          </div>
          <span style={descriptionStyle}>חייג אלי לשיחה מיידית</span>
        </a>
        <a 
          href={`mailto:${email}`} 
          style={contactMethodStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="שלח לנו אימייל"
        >
          <div style={contactMethodHeaderStyle}>
            <Mail size={24} style={iconStyle} aria-hidden="true" />
            <span style={textStyle}>{email}</span>
          </div>
          <span style={descriptionStyle}>שלח לי הודעת אימייל ואחזור אליך בהקדם</span>
        </a>
        <a 
          href={`https://wa.me/${whatsappNumber}`} 
          style={contactMethodStyle} 
          target="_blank" 
          rel="noopener noreferrer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="פנה אלינו בוואטסאפ"
        >
          <div style={contactMethodHeaderStyle}>
            <MessageCircle size={24} style={iconStyle} aria-hidden="true" />
            <span style={textStyle}>WhatsApp</span>
          </div>
          <span style={descriptionStyle}>שלח לי הודעת וואטסאפ לתמיכה מהירה</span>
        </a>
        <a 
          href={`https://t.me/${telegramUsername}`} 
          style={contactMethodStyle} 
          target="_blank" 
          rel="noopener noreferrer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="פנה אלינו בטלגרם"
        >
          <div style={contactMethodHeaderStyle}>
            <Send size={24} style={iconStyle} aria-hidden="true" />
            <span style={textStyle}>Telegram - צ'אט פרטי</span>
          </div>
          <span style={descriptionStyle}>צור איתי קשר פרטי דרך טלגרם לשאלות אישיות</span>
        </a>
        <a 
          href={`https://t.me/${telegramChannel1}`} 
          style={contactMethodStyle} 
          target="_blank" 
          rel="noopener noreferrer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="הצטרף לערוץ הטלגרם הראשי שלנו"
        >
          <div style={contactMethodHeaderStyle}>
            <BellRing size={24} style={iconStyle} aria-hidden="true" />
            <span style={textStyle}>Telegram - ערוץ ראשי</span>
          </div>
          <span style={descriptionStyle}>הצטרף לערוץ הראשי שלנו לקבלת עדכונים כלליים ומידע חשוב</span>
        </a>
        <a 
          href={`https://t.me/${telegramChannel2}`} 
          style={contactMethodStyle} 
          target="_blank" 
          rel="noopener noreferrer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="הצטרף לערוץ הטלגרם המקצועי שלנו"
        >
          <div style={contactMethodHeaderStyle}>
            <BellRing size={24} style={iconStyle} aria-hidden="true" />
            <span style={textStyle}>Telegram - ערוץ הברדס הירוק</span>
          </div>
          <span style={descriptionStyle}>הצטרף לערוץ של הברדס הירוק על מנת להקבל עכונים בנושא</span>
        </a>
        <a 
          href={`https://www.linkedin.com/in/${linkedinProfile}`} 
          style={contactMethodStyle} 
          target="_blank" 
          rel="noopener noreferrer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="עקוב אחרינו בלינקדאין"
        >
          <div style={contactMethodHeaderStyle}>
            <Linkedin size={24} style={iconStyle} aria-hidden="true" />
            <span style={textStyle}>LinkedIn</span>
          </div>
          <span style={descriptionStyle}>התחברו אליי בלינקדאין</span>
        </a>
      </div>
      <div style={workingHoursStyle}>
        <Clock size={18} style={{...iconStyle, marginRight: '0.5rem'}} aria-hidden="true" />
        <span>שעות פעילות: ימים ב'-ה', 10:00-19:00</span>
      </div>
    </div>
  );
};

export default ContactUs;