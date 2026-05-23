import { appDiscoveryPage } from "../../../../shared/practices/practices";
import "./UserProgressPage.css";

export function UserProgressPage() {
  const brand = appDiscoveryPage.brand;

  return (
    <div className="user-progress">
      <header className="user-progress__topbar">
        <span className="user-progress__brand">{brand}</span>
        <div className="user-progress__toolbar">
          <button type="button" className="user-progress__icon-btn" aria-label="Search">
            <span className="material-symbols-outlined" aria-hidden>
              search
            </span>
          </button>
          <button
            type="button"
            className="user-progress__icon-btn"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined" aria-hidden>
              notifications
            </span>
          </button>
          <div className="user-progress__avatar" aria-hidden />
        </div>
      </header>

      <div className="user-progress__layout">
        <aside className="user-progress__sidebar user-progress__desktop-only">
          <div className="user-progress__mom-card">
            <p className="user-progress__mom-eyebrow">Practice momentum</p>
            <div className="user-progress__mom-hours">
              <strong>42.5</strong>
              <span className="material-symbols-outlined" aria-hidden>
                timer
              </span>
            </div>
            <p className="user-progress__hours-label desktop-hours-caption">Hours logged</p>
            <div className="user-progress__gauge" aria-hidden>
              <span className="user-progress__gauge-label">75% goal met</span>
            </div>
            <p className="user-progress__mom-foot">
              You&apos;ve completed 12.5 hours more practice than the last cycle. Keep pushing
              forward.
            </p>
          </div>
          <div className="user-progress__mastery-card">
            <h3 className="user-progress__mastery-title">Leadership mastery</h3>
            {[
              { label: "Radical candor", pct: 88 },
              { label: "Active listening", pct: 94 },
              { label: "Conflict resolution", pct: 62 },
            ].map((row) => (
              <div key={row.label} className="user-progress__mastery-row">
                <div className="user-progress__mastery-label">
                  <span>{row.label}</span>
                  <span>{row.pct}%</span>
                </div>
                <div className="user-progress__mastery-bar">
                  <div
                    className="user-progress__mastery-fill"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
            <button type="button" className="user-progress__mastery-cta">
              Explore skill detail
            </button>
          </div>
        </aside>

        <div className="user-progress__center">
          <main className="user-progress__main user-progress__mobile-only">
            <p className="user-progress__eyebrow">Your momentum</p>
            <p className="user-progress__hours-label">Practice hours</p>
            <p className="user-progress__hours-value">42 / 60 hrs</p>
            <div className="user-progress__level-bar">
              <div className="user-progress__level-fill">Level 4: Lead architect</div>
              <div className="user-progress__level-rest">70% to mastery</div>
            </div>
            <div className="user-progress__stat-row">
              <div className="user-progress__stat-card">
                <p className="user-progress__stat-value">12</p>
                <p className="user-progress__stat-label">Current streak</p>
              </div>
              <div className="user-progress__stat-card">
                <p className="user-progress__stat-value">158</p>
                <p className="user-progress__stat-label">Sessions</p>
              </div>
            </div>
            <div className="user-progress__section-head">
              <h2 className="user-progress__section-title">Leadership journey</h2>
              <a className="user-progress__section-link" href="#journey">
                Expand
              </a>
            </div>
            <div className="user-progress__carousel" id="journey">
              <div className="user-progress__milestone">
                <p className="user-progress__milestone-tag">Milestone 01</p>
                <h3 className="user-progress__milestone-title">Foundational empathy</h3>
                <p className="user-progress__milestone-desc">
                  Mastering active listening and emotional resonance within teams.
                </p>
                <p className="user-progress__status">
                  <span className="user-progress__status-dot" />
                  Completed
                </p>
              </div>
              <div className="user-progress__milestone user-progress__milestone--dark">
                <p className="user-progress__milestone-tag">Milestone 02</p>
                <h3 className="user-progress__milestone-title">Relational scaling</h3>
                <p className="user-progress__milestone-desc">
                  Designing feedback loops that hold at scale.
                </p>
                <p className="user-progress__status user-progress__status--progress">
                  <span className="user-progress__status-dot" />
                  In progress
                </p>
              </div>
            </div>
            <h2 className="user-progress__competencies-title">Competencies & recognition</h2>
            <div className="user-progress__competency user-progress__competency--light">
              <div className="user-progress__competency-head">
                <div className="user-progress__competency-icon">
                  <span className="material-symbols-outlined">chat</span>
                </div>
                <div>
                  <p className="user-progress__competency-name">Active presence</p>
                  <p className="user-progress__competency-level">Expert level</p>
                </div>
              </div>
              <div className="user-progress__segments">
                {[1, 1, 1, 1, 0].map((on, i) => (
                  <span
                    key={`ap-${i}`}
                    className={
                      "user-progress__segment" +
                      (on ? " user-progress__segment--on" : "")
                    }
                  />
                ))}
              </div>
            </div>
            <div className="user-progress__badge-row">
              <div className="user-progress__badge">
                <div className="user-progress__badge-icon" aria-hidden />
                <p className="user-progress__badge-name">The listener</p>
                <p className="user-progress__badge-meta">Badge earned</p>
              </div>
              <div className="user-progress__badge user-progress__badge--locked">
                <div className="user-progress__badge-icon" aria-hidden />
                <p className="user-progress__badge-name">The architect</p>
                <p className="user-progress__badge-meta">Locked</p>
              </div>
            </div>
            <div className="user-progress__competency user-progress__competency--dark">
              <div className="user-progress__competency-head">
                <div className="user-progress__competency-icon">
                  <span className="material-symbols-outlined">show_chart</span>
                </div>
                <div>
                  <p className="user-progress__competency-name">Emotional agility</p>
                  <p className="user-progress__competency-level">Intermediate</p>
                </div>
              </div>
              <div className="user-progress__segments">
                {[1, 1, 0, 0, 0].map((on, i) => (
                  <span
                    key={`ea-${i}`}
                    className={
                      "user-progress__segment" +
                      (on ? " user-progress__segment--on" : "")
                    }
                  />
                ))}
              </div>
            </div>
          </main>

          <div className="user-progress__desktop-only user-progress__center-inner">
            <section className="user-progress__hero-desktop" aria-labelledby="impact-title">
              <span className="user-progress__hero-badge">Relational growth</span>
              <h2 id="impact-title" className="user-progress__hero-title">
                The path of impact.
              </h2>
              <p className="user-progress__hero-lead">
                You&apos;re currently in the top 5% of relational leaders. Your focus on empathetic
                scaling is showing significant results in team velocity.
              </p>
              <button type="button" className="user-progress__hero-cta">
                Continue practice
              </button>
            </section>

            <section className="user-progress__journey-block" aria-labelledby="learn-journey">
              <div className="user-progress__journey-head">
                <h2 id="learn-journey" className="user-progress__journey-title">
                  Learning journey
                </h2>
                <span className="user-progress__journey-pill">Current cycle</span>
              </div>
              <div className="user-progress__timeline">
                <div className="user-progress__tl-item">
                  <span className="user-progress__tl-dot user-progress__tl-dot--done" />
                  <p className="user-progress__tl-date">June 15, 2023</p>
                  <p className="user-progress__tl-item-title">Core communication fundamentals</p>
                  <p className="user-progress__tl-item-desc">
                    Baseline skills for clarity and care in high-stakes dialogue.
                  </p>
                </div>
                <div className="user-progress__tl-item">
                  <span className="user-progress__tl-dot" />
                  <div className="user-progress__tl-card user-progress__tl-card--active">
                    <p className="user-progress__tl-active-label">In progress</p>
                    <p className="user-progress__tl-item-title">Architecting trust ecosystems</p>
                    <p className="user-progress__tl-item-desc">
                      Building repeatable rituals that make trust measurable and portable.
                    </p>
                    <div className="user-progress__tl-progress">
                      <div className="user-progress__tl-progress-fill" />
                    </div>
                  </div>
                </div>
                <div className="user-progress__tl-item">
                  <span className="user-progress__tl-dot" />
                  <div className="user-progress__tl-card user-progress__tl-card--muted">
                    <p className="user-progress__tl-date">Est. July 20</p>
                    <p className="user-progress__tl-item-title">Mastering team vulnerability</p>
                    <p className="user-progress__tl-item-desc">Locked until prior milestone completes.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="user-progress__distinction" aria-labelledby="distinction-h">
              <h2 id="distinction-h" className="user-progress__distinction-title">
                Earned distinction
              </h2>
              <div className="user-progress__distinction-grid">
                <div className="user-progress__dist-card">
                  <div className="user-progress__dist-icon" aria-hidden />
                  <div>
                    <p className="user-progress__dist-name">Precision feedback</p>
                    <p className="user-progress__dist-meta">Earned May 2023</p>
                  </div>
                </div>
                <div className="user-progress__dist-card">
                  <div className="user-progress__dist-icon user-progress__dist-icon--green" aria-hidden />
                  <div>
                    <p className="user-progress__dist-name">Empathy champion</p>
                    <p className="user-progress__dist-meta">Earned April 2023</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
