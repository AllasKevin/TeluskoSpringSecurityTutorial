import React from "react";
import FilterImage from "../../../assets/filter.png";
import { useNavigate } from "react-router-dom";

export const FilterHeader: React.FC = () => {
  const navigate = useNavigate();

  const onHeaderClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="header-section">
      <button
        className="header-practices"
        onClick={() => onHeaderClick("/app")}
      >
        Practices
      </button>
      <button
        className="header-sessions"
        onClick={() => onHeaderClick("/invitecodes")}
      >
        Invitation Codes
      </button>
    </div>
  );
};
