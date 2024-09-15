import React from 'react';
import './Introduction.css'; // Import CSS for styling

const Introduction = () => {
  return (
    <div className="introduction-container">
      <div className="text-box">
        <div className="inner-box" dir="rtl">
          <h2>נעים מאוד!</h2>
          <p>אני עידן עמנואל זוהר, פרילנסר המשלב בין תחומי התמחות בטכנאות מחשבים ואבטחת מידע.</p>
          <p>בתור טכנאי מחשבים מיומן, אני מספק שירותי תיקון, תחזוקה ושדרוג של מחשבים אישיים ועסקיים.</p>
          <p>אני עובד ישירות מול ספקים מהימנים כדי להבטיח שהלקוחות שלי יקבלו את החלקים האיכותיים ביותר בשוק, במחירים האטרקטיביים ביותר.</p>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
