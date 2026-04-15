import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const FilterHeader: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onPractices = pathname === "/app" || pathname === "/practices";

  return (
    <header className="practices-top-nav">
      <div className="practices-top-nav__inner">
        <span className="practices-top-nav__brand">GrowHub</span>
        <nav className="practices-nav-pills" aria-label="Main">
          <button
            type="button"
            className={
              "practices-nav-pills__btn" +
              (onPractices ? " practices-nav-pills__btn--active" : "")
            }
            onClick={() => navigate("/app")}
          >
            Practices
          </button>
          <button
            type="button"
            className={
              "practices-nav-pills__btn" +
              (!onPractices ? " practices-nav-pills__btn--active" : "")
            }
            onClick={() => navigate("/invitecodes")}
          >
            Invitation Codes
          </button>
        </nav>
      </div>
    </header>
  );
};
