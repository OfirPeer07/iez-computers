import React from 'react';
import { Link } from 'react-router-dom';

const CyberCategorySection = ({ data, toggleNav }) => (
  <div className="category-section">
    <h2>{data.title}</h2>
    <ul>
      {data.files && data.files.map((file, index) => (
        <li key={index}>
          <Link to={`/${data.path}/${file.path}`} onClick={toggleNav}>
            {file.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default CyberCategorySection;