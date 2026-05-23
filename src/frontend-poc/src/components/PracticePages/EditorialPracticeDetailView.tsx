import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { Practice } from "../../../../shared/practices/practices";
import "./EditorialPracticeDetailView.css";

const DEFAULT_PRACTICE_DETAIL_LABELS = {
  brand: "Tuff Anytime",
  objectivesHeading: "Session objectives",
  aboutHeading: "About this practice",
  joinCta: "Join now",
  scheduleCta: "Schedule for later",
  backAriaLabel: "Back to discovery",
  playVideoAriaLabel: "Play intro video",
} as const;

function formatDurationPill(length?: string): string {
  if (!length) return "";
  const m = length.match(/(\d+)/);
  return m ? `${m[1]} min` : length.trim();
}

interface EditorialPracticeDetailViewProps {
  practice: Practice;
  onJoinNow: () => void;
  scheduleTo: string;
}

export function EditorialPracticeDetailView({
  practice,
  onJoinNow,
  scheduleTo,
}: EditorialPracticeDetailViewProps) {
  const L = practice.practiceDetailLabels;
  const brand = L?.brand ?? DEFAULT_PRACTICE_DETAIL_LABELS.brand;
  const objectivesHeading =
    L?.objectivesHeading ?? DEFAULT_PRACTICE_DETAIL_LABELS.objectivesHeading;
  const aboutHeading =
    L?.aboutHeading ?? DEFAULT_PRACTICE_DETAIL_LABELS.aboutHeading;
  const joinCta = L?.joinCta ?? DEFAULT_PRACTICE_DETAIL_LABELS.joinCta;
  const scheduleCta =
    L?.scheduleCta ?? DEFAULT_PRACTICE_DETAIL_LABELS.scheduleCta;
  const backAriaLabel =
    L?.backAriaLabel ?? DEFAULT_PRACTICE_DETAIL_LABELS.backAriaLabel;
  const playVideoAriaLabel =
    L?.playVideoAriaLabel ?? DEFAULT_PRACTICE_DETAIL_LABELS.playVideoAriaLabel;

  const videoDomId = `intro-video-${practice.name}`;
  const facHeadingId = `editorial-facilitator-heading-${practice.name}`;

  const openIntroVideo = () => {
    const videoEl = document.getElementById(videoDomId) as HTMLVideoElement | null;
    if (!videoEl) return;
    videoEl.classList.remove("intro-video-element-hidden");
    videoEl.controls = true;
    const enterFullscreen = () => {
      if (videoEl.requestFullscreen) return videoEl.requestFullscreen();
      if ((videoEl as any).webkitRequestFullscreen)
        return (videoEl as any).webkitRequestFullscreen();
      if ((videoEl as any).mozRequestFullScreen)
        return (videoEl as any).mozRequestFullScreen();
      if ((videoEl as any).webkitEnterFullscreen) {
        (videoEl as any).webkitEnterFullscreen();
        return Promise.resolve();
      }
      return Promise.reject();
    };
    enterFullscreen()
      .then(() => videoEl.play().catch(() => {}))
      .catch(() => videoEl.play().catch(() => {}));
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const videoEl = document.getElementById(videoDomId) as HTMLVideoElement | null;
      if (!videoEl) return;
      const isFullscreen =
        document.fullscreenElement === videoEl ||
        (document as any).webkitFullscreenElement === videoEl ||
        (document as any).mozFullScreenElement === videoEl ||
        (document as any).msFullscreenElement === videoEl;
      if (!isFullscreen) {
        videoEl.pause();
        videoEl.classList.add("intro-video-element-hidden");
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [videoDomId]);

  const durationPill = formatDurationPill(practice.length);
  const aboutText = (practice.aboutExtended ?? practice.description).trim();
  const lead = practice.tagline ?? practice.description;
  const showFacilitator =
    !!practice.instructor &&
    !!(
      practice.instructor.name ||
      practice.facilitatorRole ||
      practice.facilitatorQuote
    );
  const showAbout = aboutText.length > 0;

  const hasStackContent =
    (practice.objectives && practice.objectives.length > 0) || showAbout;

  const mainClass =
    "asking-detail__main" +
    (showFacilitator ? "" : " asking-detail__main--solo-stack");

  return (
    <div className="asking-detail">
      <header className="asking-detail__topbar">
        <Link to="/app/discover" className="asking-detail__back" aria-label={backAriaLabel}>
          <span className="material-symbols-outlined" aria-hidden>
            arrow_back
          </span>
        </Link>
        <span className="asking-detail__brand">{brand}</span>
      </header>

      <main className={mainClass}>
        {practice.thumbnailUrl && practice.videoUrl && (
          <div className="asking-detail__hero-wrap">
            <button
              type="button"
              className="asking-detail__hero"
              onClick={openIntroVideo}
              aria-label={playVideoAriaLabel}
            >
              <img
                src={practice.thumbnailUrl}
                alt=""
                className="asking-detail__hero-img"
              />
              <div className="asking-detail__hero-overlay">
                <span className="asking-detail__play">
                  <span className="material-symbols-outlined">play_arrow</span>
                </span>
              </div>
              <div className="asking-detail__hero-chips">
                {durationPill && (
                  <span className="asking-detail__chip">{durationPill}</span>
                )}
                {practice.contentTypeLabel && (
                  <span className="asking-detail__chip asking-detail__chip--accent">
                    {practice.contentTypeLabel}
                  </span>
                )}
              </div>
            </button>
            <video
              id={videoDomId}
              controls
              className="intro-video-element-hidden"
              playsInline
              preload="metadata"
              onMouseMove={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <source src={practice.videoUrl} type="video/mp4" />
            </video>
          </div>
        )}

        <header className="asking-detail__intro">
          <div className="asking-detail__eyebrow-row">
            {practice.moduleLabel && (
              <span className="asking-detail__module-pill">{practice.moduleLabel}</span>
            )}
          </div>
          <h1 className="asking-detail__title">{practice.title}</h1>
          <p className="asking-detail__lead">{lead}</p>
        </header>

        {showFacilitator && practice.instructor && (
          <section
            className="asking-detail__facilitator"
            aria-labelledby={
              practice.instructor.name ? facHeadingId : undefined
            }
            aria-label={practice.instructor.name ? undefined : "Facilitator"}
          >
            <div className="asking-detail__facilitator-glow" aria-hidden />
            <div className="asking-detail__facilitator-inner">
              <img
                src={practice.imageUrl}
                alt={practice.instructor.name ?? ""}
                className="asking-detail__facilitator-photo"
              />
              <div className="asking-detail__facilitator-body">
                {practice.instructor.name && (
                  <h2 id={facHeadingId} className="asking-detail__facilitator-name">
                    {practice.instructor.name}
                  </h2>
                )}
                {practice.facilitatorRole && (
                  <p className="asking-detail__facilitator-role">
                    {practice.facilitatorRole}
                  </p>
                )}
                {practice.facilitatorQuote && (
                  <p className="asking-detail__facilitator-quote">
                    &ldquo;{practice.facilitatorQuote}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {hasStackContent && (
          <div className="asking-detail__stack">
            {practice.objectives && practice.objectives.length > 0 && (
              <section className="asking-detail__objectives" aria-labelledby="obj-heading">
                <h3 id="obj-heading" className="asking-detail__section-label">
                  {objectivesHeading}
                </h3>
                <div>
                  {practice.objectives.map((text, i) => (
                    <div key={i} className="asking-detail__objective-row">
                      <span className="material-symbols-outlined" aria-hidden>
                        check_circle
                      </span>
                      <p className="asking-detail__objective-text">{text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {showAbout && (
              <section className="asking-detail__about" aria-labelledby="about-heading">
                <h3 id="about-heading" className="asking-detail__section-label">
                  {aboutHeading}
                </h3>
                <p className="asking-detail__about-text">{aboutText}</p>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="asking-detail__footer">
        <button
          type="button"
          className="asking-detail__cta-primary"
          onClick={onJoinNow}
        >
          {joinCta}
        </button>
        <Link className="asking-detail__cta-secondary" to={scheduleTo}>
          {scheduleCta}
        </Link>
      </footer>
    </div>
  );
}
