import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { appDiscoveryPage } from "../../../../../../shared/practices/practices";

export const FilterHeader: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const copy = appDiscoveryPage;
  const onPractices =
    pathname === "/app/discover" ||
    pathname === "/practices" ||
    pathname.startsWith("/app/practice");
  const onInviteCodes = pathname === "/invitecodes";

  return (
    <header className="practices-top-nav filter-header">
      <div className="practices-top-nav__inner">
        <span className="practices-top-nav__brand">{copy.brand}</span>
        <nav className="practices-nav-pills" aria-label="Main">
          <button
            type="button"
            className={
              "practices-nav-pills__btn" +
              (onPractices ? " practices-nav-pills__btn--active" : "")
            }
            onClick={() => navigate("/app/discover")}
          >
            {copy.navPractices}
          </button>
          <button
            type="button"
            className={
              "practices-nav-pills__btn" +
              (onInviteCodes ? " practices-nav-pills__btn--active" : "")
            }
            onClick={() => navigate("/invitecodes")}
          >
            {copy.navInviteCodes}
          </button>
        </nav>
      </div>
    </header>
  );
};
