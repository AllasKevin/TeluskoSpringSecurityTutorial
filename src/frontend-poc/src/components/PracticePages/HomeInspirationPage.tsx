import { appDiscoveryPage } from "../../../../shared/practices/practices";
import inspLead from "../../assets/inspiration/download.png";
import inspPillar from "../../assets/inspiration/download (1).jfif";
import inspArticle0 from "../../assets/inspiration/download (2).jfif";
import inspArticle1 from "../../assets/inspiration/download (3).jfif";
import inspAvatar0 from "../../assets/inspiration/download (4).jfif";
import inspAvatar1 from "../../assets/inspiration/download (5).jfif";
import inspTipsFeature from "../../assets/inspiration/download (6).jfif";
import inspTipCard0 from "../../assets/inspiration/download (7).jfif";
import inspTipCard1 from "../../assets/inspiration/download.jfif";
import "./HomeInspirationPage.css";

const copy = {
  dailyEyebrow: "Daily insight",
  dailyTitle: "The strength of silent observation",
  dailyLead:
    "Mastering the art of pause allows you to respond with architectural precision rather than emotional reactivity.",
  readMore: "Read more",
  pillarsTitle: "Practice pillars",
  viewAll: "View all",
  narrativesTitle: "Growth narratives",
  desktopEyebrow: "Leadership pulse",
  desktopTitleBefore: "Great leaders don't just solve problems; they build the ",
  desktopTitleEm: "architects",
  desktopTitleAfter: " of solutions.",
  desktopLead:
    "Today's practice focuses on radical transparency. When giving feedback, lead with curiosity rather than conviction.",
  startPractice: "Start daily practice",
  exploreTips: "Explore tips",
  tipsTitle: "Tips for the journey",
  tipsSub: "Actionable insights for relational growth.",
  tipsViewAll: "View all modules",
  featureTitle: "Mastering the art of high-stakes feedback",
  featureDesc:
    "Structure conversations so clarity lands without shutting people down—especially when stakes are high.",
  featureMeta: "Advanced skill · 12 min read",
  storiesTitle: "Success stories",
} as const;

const pillarSmall = [
  {
    icon: "lightbulb",
    title: "The 5-second alignment rule",
  },
  {
    icon: "psychology",
    title: "Managing high-tension rooms",
  },
] as const;

const tipsGrid = [
  {
    icon: "rocket_launch",
    title: "Starting your first practice",
    hue: "#005a24",
    thumb: inspTipCard0,
  },
  {
    icon: "location_on",
    title: "Cognitive reframing",
    hue: "var(--primary)",
    thumb: inspTipCard1,
  },
  {
    icon: "groups",
    title: "Psychological safety",
    hue: "#005a24",
    thumb: inspArticle0,
  },
  {
    icon: "menu_book",
    title: "Reflective journaling",
    hue: "#555f6f",
    thumb: inspArticle1,
  },
] as const;

const articles = [
  {
    tags: ["Leadership", "8 min read"],
    title: "Architecting relational safety in rapid teams",
    summary:
      "Psychological safety is not a soft skill—it is structural scaffolding for high-performance leadership.",
    image: inspArticle0,
  },
  {
    tags: ["Strategy", "5 min read"],
    title: "The emotional intelligence gap",
    summary:
      "Mapping the bridge between technical competence and interpersonal mastery in the modern workplace.",
    image: inspArticle1,
  },
] as const;

const stories = [
  {
    quote:
      "Tuff Anytime gave our leads a shared language for tension—we stopped fixing people and started designing conversations.",
    name: "Sarah Jenkins",
    role: "Head of operations, Fintech Co",
    avatar: inspAvatar0,
  },
  {
    quote:
      "The practice rhythm turned feedback from a threat into a ritual. Our velocity followed trust.",
    name: "Marcus Liang",
    role: "VP Engineering, Northwind",
    avatar: inspAvatar1,
  },
] as const;

export function HomeInspirationPage() {
  const brand = appDiscoveryPage.brand;

  return (
    <div className="home-inspiration">
      <header className="home-inspiration__topbar">
        <span className="home-inspiration__brand">{brand}</span>
        <div className="home-inspiration__toolbar">
          <button
            type="button"
            className="home-inspiration__icon-btn"
            aria-label="Search"
          >
            <span className="material-symbols-outlined" aria-hidden>
              search
            </span>
          </button>
          <button
            type="button"
            className="home-inspiration__icon-btn"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined" aria-hidden>
              notifications
            </span>
          </button>
        </div>
      </header>

      <main className="home-inspiration__main">
        <div className="home-inspiration__desktop-only home-inspiration__lead-desktop">
          <div className="home-inspiration__lead-copy">
            <p className="home-inspiration__pulse-eyebrow">{copy.desktopEyebrow}</p>
            <h1 className="home-inspiration__pulse-title">
              {copy.desktopTitleBefore}
              <em>{copy.desktopTitleEm}</em>
              {copy.desktopTitleAfter}
            </h1>
            <p className="home-inspiration__pulse-lead">{copy.desktopLead}</p>
            <div className="home-inspiration__pulse-actions">
              <button type="button" className="home-inspiration__btn-primary">
                {copy.startPractice}
              </button>
              <button type="button" className="home-inspiration__btn-secondary">
                {copy.exploreTips}
              </button>
            </div>
          </div>
          <div className="home-inspiration__lead-visual" aria-hidden>
            <img
              src={inspLead}
              alt=""
              className="home-inspiration__media-fill"
            />
          </div>
        </div>

        <section
          className="home-inspiration__hero home-inspiration__mobile-only"
          aria-labelledby="daily-insight-title"
        >
          <div className="home-inspiration__hero-media" aria-hidden>
            <img
              src={inspTipsFeature}
              alt=""
              className="home-inspiration__media-fill"
            />
          </div>
          <div className="home-inspiration__hero-copy">
            <p className="home-inspiration__hero-eyebrow">{copy.dailyEyebrow}</p>
            <h2 id="daily-insight-title" className="home-inspiration__hero-title">
              {copy.dailyTitle}
            </h2>
            <p className="home-inspiration__hero-lead">{copy.dailyLead}</p>
            <div className="home-inspiration__hero-cta">
              <button type="button">{copy.readMore}</button>
            </div>
          </div>
        </section>

        <section aria-labelledby="pillars-heading">
          <div className="home-inspiration__section-head">
            <h2 id="pillars-heading" className="home-inspiration__section-title">
              {copy.pillarsTitle}
            </h2>
            <a className="home-inspiration__section-link" href="#pillars-heading">
              {copy.viewAll}
            </a>
          </div>
          <div className="home-inspiration__pillars home-inspiration__mobile-only">
            <div className="home-inspiration__pillar-stack">
              {pillarSmall.map((p) => (
                <div key={p.title} className="home-inspiration__pillar-card">
                  <div className="home-inspiration__pillar-icon">
                    <span className="material-symbols-outlined">{p.icon}</span>
                  </div>
                  <h3 className="home-inspiration__pillar-title">{p.title}</h3>
                </div>
              ))}
            </div>
            <div className="home-inspiration__pillar-card home-inspiration__pillar-card--tall">
              <div className="home-inspiration__pillar-media">
                <img
                  src={inspPillar}
                  alt=""
                  className="home-inspiration__media-fill"
                />
              </div>
              <div className="home-inspiration__pillar-body">
                <span className="home-inspiration__pillar-tag">Interaction</span>
                <h3 className="home-inspiration__pillar-title">
                  Non-verbal anchoring techniques
                </h3>
              </div>
            </div>
          </div>

          <div className="home-inspiration__desktop-only">
            <div className="home-inspiration__section-head home-inspiration__tips-head">
              <h2 className="home-inspiration__section-title">{copy.tipsTitle}</h2>
              <a className="home-inspiration__section-link" href="#tips">
                {copy.tipsViewAll} →
              </a>
            </div>
            <p id="tips" className="home-inspiration__tips-sub">
              {copy.tipsSub}
            </p>
            <div className="home-inspiration__tips-grid">
              <div className="home-inspiration__tips-feature">
                <div className="home-inspiration__tips-feature-media" aria-hidden>
                  <img
                    src={inspTipsFeature}
                    alt=""
                    className="home-inspiration__media-fill"
                  />
                </div>
                <div className="home-inspiration__pillar-icon">
                  <span className="material-symbols-outlined">forum</span>
                </div>
                <h3 className="home-inspiration__tips-feature-title">
                  {copy.featureTitle}
                </h3>
                <p className="home-inspiration__tips-feature-desc">{copy.featureDesc}</p>
                <p className="home-inspiration__tips-meta">{copy.featureMeta}</p>
              </div>
              <div className="home-inspiration__tips-small-grid">
                {tipsGrid.map((t) => (
                  <div key={t.title} className="home-inspiration__tips-small-card">
                    <div className="home-inspiration__tips-small-thumb" aria-hidden>
                      <img
                        src={t.thumb}
                        alt=""
                        className="home-inspiration__media-fill"
                      />
                    </div>
                    <div
                      className="home-inspiration__pillar-icon"
                      style={{ color: t.hue }}
                    >
                      <span className="material-symbols-outlined">{t.icon}</span>
                    </div>
                    <h3 className="home-inspiration__pillar-title">{t.title}</h3>
                    <p className="home-inspiration__article-summary">
                      Short insight for your next session.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="narratives-heading">
          <h2
            id="narratives-heading"
            className="home-inspiration__narratives-title home-inspiration__mobile-only"
          >
            {copy.narrativesTitle}
          </h2>
          {articles.map((a) => (
            <article key={a.title} className="home-inspiration__article">
              <div className="home-inspiration__article-media" aria-hidden>
                <img
                  src={a.image}
                  alt=""
                  className="home-inspiration__media-fill"
                />
              </div>
              <div className="home-inspiration__article-body">
                <div className="home-inspiration__article-tags">
                  {a.tags.map((t) => (
                    <span key={t} className="home-inspiration__tag">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="home-inspiration__article-title">{a.title}</h3>
                <p className="home-inspiration__article-summary">{a.summary}</p>
              </div>
            </article>
          ))}
        </section>

        <section
          className="home-inspiration__stories-wrap home-inspiration__desktop-only"
          aria-labelledby="stories-heading"
        >
          <h2 id="stories-heading" className="home-inspiration__stories-title">
            {copy.storiesTitle}
          </h2>
          <div className="home-inspiration__stories-grid">
            {stories.map((s) => (
              <blockquote key={s.name} className="home-inspiration__story-card">
                <p className="home-inspiration__story-quote">{s.quote}</p>
                <footer className="home-inspiration__story-author">
                  <img
                    className="home-inspiration__story-avatar"
                    src={s.avatar}
                    alt=""
                  />
                  <div>
                    <p className="home-inspiration__story-name">{s.name}</p>
                    <p className="home-inspiration__story-role">{s.role}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
