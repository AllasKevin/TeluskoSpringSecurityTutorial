import { useEffect } from "react";
import { Link, Navigate, useOutletContext, useParams } from "react-router-dom";
import {
  appDiscoveryPage,
  practices,
} from "../../../../shared/practices/practices";
import { ScheduleCallSectionOutlet } from "../PracticesPage/components/ScheduleCallSectionOutlet";
import type { PracticeAppOutletContext } from "../../types/practiceAppOutlet";
import "./PracticeSchedulePage.css";

export function PracticeSchedulePage() {
  const { practiceSlug } = useParams<{ practiceSlug: string }>();
  const { setChosenPractice } = useOutletContext<PracticeAppOutletContext>();
  const practice = practices.find((p) => p.name === practiceSlug);
  const copy = appDiscoveryPage;

  useEffect(() => {
    if (practiceSlug) setChosenPractice(practiceSlug);
  }, [practiceSlug, setChosenPractice]);

  if (!practiceSlug) {
    return <Navigate to="/app/discover" replace />;
  }

  if (!practice) {
    return <Navigate to="/app/discover" replace />;
  }

  return (
    <div className="schedule-shell">
      <header className="schedule-shell__topbar">
        <Link
          to={`/app/practice/${practiceSlug}`}
          className="schedule-shell__back"
          aria-label={copy.scheduleBackAriaLabel}
        >
          <span className="material-symbols-outlined" aria-hidden>
            arrow_back
          </span>
        </Link>
        <span className="schedule-shell__brand">{copy.brand}</span>
      </header>

      <main className="schedule-shell__main">
        <section className="schedule-shell__hero" aria-labelledby="schedule-page-title">
          <span className="schedule-shell__eyebrow">{copy.scheduleEyebrow}</span>
          <h1 id="schedule-page-title" className="schedule-shell__title">
            {copy.scheduleTitle}
          </h1>
          <p className="schedule-shell__module">{practice.title}</p>
          <p className="schedule-shell__subtitle">{copy.scheduleSubtitle}</p>
        </section>

        <ScheduleCallSectionOutlet
          practice={practiceSlug}
          forcedTab="schedule"
          hideTabBar
          editorialSchedule
        />
      </main>
    </div>
  );
}
