import React from "react";
import FilterImage from "../../../assets/filter.png";

export const FilterHeader: React.FC = () => {
  return (
    <div className="header-section">
      <div className="header-practices">Practices</div>
      <div className="header-sessions">Available Sessions</div>
      <div className="header-filter">
        <img src={FilterImage} alt={FilterImage} className="filter-image" />
        Filter
      </div>
    </div>
  );
};
