import { Link } from "react-router-dom";
import { appDiscoveryPage } from "../../../../shared/practices/practices";
import { ScheduleCallSectionOutlet } from "../PracticesPage/components/ScheduleCallSectionOutlet";
import "./MyBookingsPage.css";

export function MyBookingsPage() {
  const copy = appDiscoveryPage;

  return (
    <div className="my-bookings-shell">
      <header className="my-bookings-shell__topbar">
        <Link
          to="/app"
          className="my-bookings-shell__back"
          aria-label={copy.myBookingsBackAriaLabel}
        >
          <span className="material-symbols-outlined" aria-hidden>
            arrow_back
          </span>
        </Link>
        <span className="my-bookings-shell__brand">{copy.brand}</span>
      </header>

      <main className="my-bookings-shell__main">
        <section className="my-bookings-shell__hero" aria-labelledby="my-bookings-title">
          <span className="my-bookings-shell__eyebrow">{copy.myBookingsEyebrow}</span>
          <h1 id="my-bookings-title" className="my-bookings-shell__title">
            {copy.myBookingsTitle}
          </h1>
          <div className="my-bookings-shell__accent" aria-hidden />
          <p className="my-bookings-shell__subtitle">{copy.myBookingsSubtitle}</p>
        </section>

        <ScheduleCallSectionOutlet
          practice="anypractice"
          forcedTab="mybookings"
          hideTabBar
          editorialMyBookings
        />
      </main>
    </div>
  );
}
