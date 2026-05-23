import { useEffect } from "react";
import { Link, Navigate, useOutletContext, useParams } from "react-router-dom";
import { practices } from "../../../../shared/practices/practices";
import { FilterHeader } from "../PracticesPage/components/FilterHeader";
import { ScheduleCallSectionOutlet } from "../PracticesPage/components/ScheduleCallSectionOutlet";
import type { PracticeAppOutletContext } from "../../types/practiceAppOutlet";
import "../PracticesPage/PracticesPage.css";

export function PracticeJoinPage() {
  const { practiceSlug } = useParams<{ practiceSlug: string }>();
  const { setChosenPractice } = useOutletContext<PracticeAppOutletContext>();
  const practice = practices.find((p) => p.name === practiceSlug);

  useEffect(() => {
    if (practiceSlug) setChosenPractice(practiceSlug);
  }, [practiceSlug, setChosenPractice]);

  if (!practiceSlug || !practice) {
    return <Navigate to="/app/discover" replace />;
  }

  return (
    <div className="practices-container">
      <div className="practices-content">
        <FilterHeader />
        <div className="practice-flow-page">
          <Link
            to={`/app/practice/${practiceSlug}`}
            className="practice-flow-page__back"
          >
            ← Back to module
          </Link>
          <p className="practices-hero__eyebrow">Live session</p>
          <h1 className="practice-flow-page__title">{practice.title}</h1>
          <p className="practice-flow-page__lead">
            Start a practice session when someone else is ready to join.
          </p>
          <ScheduleCallSectionOutlet
            practice={practiceSlug}
            forcedTab="join"
            hideTabBar
          />
        </div>
      </div>
    </div>
  );
}
