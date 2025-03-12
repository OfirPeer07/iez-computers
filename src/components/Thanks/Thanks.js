import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Heart, Code, Bug, Award, Github, Linkedin, Twitter, ExternalLink, ThumbsUp, User } from 'lucide-react';
import './Thanks.css';

const Thanks = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [heartAnims, setHeartAnims] = useState({});
  const location = useLocation();

  const contributors = [
    {
      id: 1,
      name: "שלומי כהן",
      contribution: "עזרה בפיתוח חלק הניווט של האתר ופתרון בעיות CSS מורכבות",
      image: "/images/contributors/shlomi.jpg", 
      type: "development",
      socialLinks: {
        github: "https://github.com/username1",
        linkedin: "https://linkedin.com/in/username1"
      }
    },
    {
      id: 2,
      name: "דנה לוי",
      contribution: "מצאה וסייעה בתיקון מספר פריצות אבטחה משמעותיות באתר",
      image: "/images/contributors/dana.jpg", 
      type: "security",
      socialLinks: {
        twitter: "https://twitter.com/username2",
        website: "https://personalsite.com/username2"
      }
    },
    {
      id: 3,
      name: "אליהו ישראלי",
      contribution: "תרם תוכן ומאמרים מקצועיים בנושא אבטחת מידע וסייבר",
      type: "content",
      socialLinks: {
        linkedin: "https://linkedin.com/in/username3",
        twitter: "https://twitter.com/username3"
      }
    },
    {
      id: 4,
      name: "רן עקיבא",
      contribution: "עזרה בעיצוב UI/UX של האתר והציעה שיפורים משמעותיים לחווית המשתמש",
      type: "development",
      socialLinks: {
        github: "https://github.com/username4"
      }
    }
  ];

  const getContributionIcon = (type) => {
    switch(type) {
      case 'development':
        return <Code size={16} />;
      case 'security':
        return <Bug size={16} />;
      case 'content':
        return <Award size={16} />;
      default:
        return <Heart size={16} />;
    }
  };

  const getContributionTypeName = (type) => {
    switch(type) {
      case 'development':
        return 'פיתוח';
      case 'security':
        return 'אבטחה';
      case 'content':
        return 'תוכן';
      default:
        return 'תרומה';
    }
  };

  const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 80%, 40%)`;
  };

  const createHeartAnimation = (contributorId) => {
    const newHearts = Array.from({ length: 7 }, (_, i) => ({
      id: `heart-${contributorId}-${i}-${Date.now()}`,
      left: 40 + Math.random() * 20,
      duration: 1 + Math.random(),
      delay: Math.random() * 0.5,
      size: 10 + Math.random() * 15,
      opacity: 0.7 + Math.random() * 0.3
    }));

    setHeartAnims(prev => ({
      ...prev,
      [contributorId]: [
        ...(prev[contributorId] || []),
        ...newHearts
      ]
    }));

    setTimeout(() => {
      setHeartAnims(prev => {
        const updatedHearts = { ...prev };
        if (updatedHearts[contributorId]) {
          updatedHearts[contributorId] = updatedHearts[contributorId].filter(
            heart => !newHearts.some(newHeart => newHeart.id === heart.id)
          );
        }
        return updatedHearts;
      });
    }, 3000);
  };

  const renderHearts = (contributorId) => {
    if (!heartAnims[contributorId] || heartAnims[contributorId].length === 0) {
      return null;
    }

    return heartAnims[contributorId].map(heart => (
      <div
        key={heart.id}
        className="floating-heart"
        style={{
          left: `${heart.left}%`,
          animationDuration: `${heart.duration}s`,
          animationDelay: `${heart.delay}s`,
          width: `${heart.size}px`,
          height: `${heart.size}px`,
          opacity: heart.opacity
        }}
      >
        <Heart size={heart.size} color="#ff5555" fill="#ff5555" />
      </div>
    ));
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const renderSocialLinks = (links) => {
    if (!links || Object.keys(links).length === 0) return null;
    
    return (
      <div className="social-links">
        {links.github && (
          <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="social-link">
            <Github size={18} />
          </a>
        )}
        {links.linkedin && (
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="social-link">
            <Linkedin size={18} />
          </a>
        )}
        {links.twitter && (
          <a href={links.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile" className="social-link">
            <Twitter size={18} />
          </a>
        )}
        {links.website && (
          <a href={links.website} target="_blank" rel="noopener noreferrer" aria-label="Personal Website" className="social-link">
            <ExternalLink size={18} />
          </a>
        )}
      </div>
    );
  };

  return (
    <div className={`thanks-page ${isLoaded ? 'is-loaded' : ''}`}>
      <div className="thanks-header">
        <div className="header-icon-container">
          <Heart size={48} className="header-icon" />
          <div className="icon-glow"></div>
        </div>
        <div className="header-text">
          <h1 className="main-title">תודה מיוחדת</h1>
          <p className="subtitle">לכל מי שתרם ועזר בבניית האתר</p>
        </div>
      </div>
      <div className="contributors-grid">
        {contributors.map((contributor, index) => (
          <div 
            key={contributor.id} 
            className={`contributor-card ${hoveredCard === contributor.id ? 'is-hovered' : ''}`}
            onMouseEnter={() => setHoveredCard(contributor.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <div className="contributor-avatar">
              {contributor.image ? (
                <img 
                  src={contributor.image} 
                  alt={contributor.name}
                  className="avatar-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="avatar-placeholder"
                style={{ 
                  backgroundColor: getAvatarColor(contributor.name),
                  display: contributor.image ? 'none' : 'flex'
                }}
              >
                <User size={32} color="#ffffff" />
              </div>
              <div 
                className={`contribution-type-badge ${contributor.type}`}
                title={getContributionTypeName(contributor.type)}
              >
                {getContributionIcon(contributor.type)}
              </div>
            </div>
            <div className="contributor-content">
              <h3 className="contributor-name">{contributor.name}</h3>
              {renderSocialLinks(contributor.socialLinks)}
              <p className="contributor-description">{contributor.contribution}</p>
              <div className="appreciation-button">
                <button 
                  className="thanks-button" 
                  aria-label={`Say thanks to ${contributor.name}`}
                  onClick={() => createHeartAnimation(contributor.id)}
                >
                  <ThumbsUp size={16} />
                  <span>תודה!</span>
                </button>
                <div className="hearts-container">
                  {renderHearts(contributor.id)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-contributor-section">
        <div className="add-contributor-inner">
          <h2>מכיר עוד מישהו שתרם לאתר?</h2>
          <p>עזור לנו לתת קרדיט לכל מי שעזר בפיתוח או שיפור האתר!</p>
          <a href="mailto:contact@iezcomputers.com" className="contact-button">
            צור קשר
          </a>
        </div>
      </div>
    </div>
  );
};

export default Thanks;
