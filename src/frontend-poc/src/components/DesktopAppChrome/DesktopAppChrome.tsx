import { NavLink, useNavigate } from "react-router-dom";
import { appDiscoveryPage } from "../../../../shared/practices/practices";
import "./DesktopAppChrome.css";

export interface DesktopAppChromeProps {
  /** Opens matchmaking popup when set (e.g. under /app). Falls back to /app when omitted. */
  onStartPractice?: () => void;
}

export function DesktopAppChrome({ onStartPractice }: DesktopAppChromeProps) {
  const navigate = useNavigate();
  const copy = appDiscoveryPage;

  const handleStartPractice = () => {
    if (onStartPractice) onStartPractice();
    else navigate("/app/discover");
  };

  return (
    <>
      <header className="desktop-app-chrome__header" aria-label="App">
        <div className="desktop-app-chrome__header-inner">
          <span className="desktop-app-chrome__brand">{copy.brand}</span>
        </div>
      </header>

      <aside className="desktop-app-chrome__sidebar" aria-label="Sidebar">
        <div className="desktop-app-chrome__tier">
          <p className="desktop-app-chrome__tier-label">Active tier</p>
          <h2 className="desktop-app-chrome__tier-title">
            Relational Architect
          </h2>
          <p className="desktop-app-chrome__tier-sub">Growth tier</p>
        </div>
        <nav className="desktop-app-chrome__side-nav" aria-label="Sidebar">
          <NavLink
            to="/app/discover"
            end
            className={({ isActive }) =>
              "desktop-app-chrome__side-link" +
              (isActive ? " desktop-app-chrome__side-link--active" : "")
            }
          >
            <span className="material-symbols-outlined" aria-hidden>
              explore
            </span>
            <span>{copy.navPractices}</span>
          </NavLink>
          <NavLink
            to="/app"
            end
            className={({ isActive }) =>
              "desktop-app-chrome__side-link" +
              (isActive ? " desktop-app-chrome__side-link--active" : "")
            }
          >
            <span className="material-symbols-outlined" aria-hidden>
              auto_awesome
            </span>
            <span>Inspiration</span>
          </NavLink>
          <NavLink
            to="/app/user-progress"
            className={({ isActive }) =>
              "desktop-app-chrome__side-link" +
              (isActive ? " desktop-app-chrome__side-link--active" : "")
            }
          >
            <span className="material-symbols-outlined" aria-hidden>
              trending_up
            </span>
            <span>Progress</span>
          </NavLink>
          <NavLink
            to="/app/my-bookings"
            className={({ isActive }) =>
              "desktop-app-chrome__side-link" +
              (isActive ? " desktop-app-chrome__side-link--active" : "")
            }
          >
            <span className="material-symbols-outlined" aria-hidden>
              event_available
            </span>
            <span>{copy.myBookingsTitle}</span>
          </NavLink>
          <NavLink
            to="/invitecodes"
            className={({ isActive }) =>
              "desktop-app-chrome__side-link" +
              (isActive ? " desktop-app-chrome__side-link--active" : "")
            }
          >
            <span className="material-symbols-outlined" aria-hidden>
              key
            </span>
            <span>{copy.navInviteCodes}</span>
          </NavLink>
        </nav>
        <div className="desktop-app-chrome__sidebar-footer">
          <button
            type="button"
            className="desktop-app-chrome__sidebar-cta"
            onClick={handleStartPractice}
          >
            Book session
          </button>
        </div>
      </aside>
    </>
  );
}
