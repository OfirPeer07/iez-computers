import React from 'react';
import './ITdepartment.css'; 
import TechnologyNews from './TechnologyNews.jpg';  
import TroubleshootingGuides from './TroubleshootingGuides.jpg';
import BuildingComputers from './BuildingComputers.jpg';

const ITdepartment = () => {

    const handleNavigation = (path) => {
        window.location.href = path;
      };

  return (
    <div className="itdepartment-container">
      <div className="itdepartment-rectangle img1">
        <img src={TroubleshootingGuides} alt="Troubleshooting Guides" onClick={() => handleNavigation('information-technology-department/troubleshooting-guides')} />
      </div>
      <div className="itdepartment-rectangle img2">
        <img src={TechnologyNews} alt="Technology News" onClick={() => handleNavigation('information-technology-department/technology-news')} />
      </div>
      <div className="itdepartment-rectangle img3">
        <img src={BuildingComputers} alt="Building Computers" onClick={() => handleNavigation('information-technology-department/building-computers')} />
      </div>
    </div>
  );
};

export default ITdepartment;
