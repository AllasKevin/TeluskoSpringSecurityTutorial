import { NavLink } from "react-router-dom";
import "./BottomNav.css";

const items = [
  { to: "/app/discover", end: true, label: "Discover", icon: "explore" },
  {
    to: "/app",
    end: true,
    label: "Inspire",
    icon: "auto_awesome",
  },
  {
    to: "/app/user-progress",
    end: false,
    label: "Progress",
    icon: "trending_up",
  },
  { to: "/app/my-bookings", end: false, label: "Bookings", icon: "event_available" },
] as const;

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map(({ to, end, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            "bottom-nav__link" + (isActive ? " bottom-nav__link--active" : "")
          }
        >
          <span className="material-symbols-outlined bottom-nav__icon" aria-hidden>
            {icon}
          </span>
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
