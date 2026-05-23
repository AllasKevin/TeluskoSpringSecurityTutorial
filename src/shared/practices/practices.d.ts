// This gives your frontend full typing even though the data file is JS.

/** Optional copy for editorial practice detail UI; component supplies defaults when absent. */
export interface PracticeDetailLabels {
  brand?: string;
  objectivesHeading?: string;
  aboutHeading?: string;
  joinCta?: string;
  scheduleCta?: string;
  backAriaLabel?: string;
  playVideoAriaLabel?: string;
}

export interface Practice {
  title: string;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  instructor?: {
    name?: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      youtube?: string;
    };
  };
  length?: string;
  /** Short hero subtitle (editorial detail pages). */
  tagline?: string;
  moduleLabel?: string;
  contentTypeLabel?: string;
  facilitatorRole?: string;
  facilitatorQuote?: string;
  objectives?: string[];
  /** Longer “About this practice” copy; falls back to description if absent. */
  aboutExtended?: string;
  practiceDetailLabels?: PracticeDetailLabels;
  /** Shorter teaser on /app list; falls back to description when absent. */
  discoveryBlurb?: string;
}

/** Copy for the /app discovery shell (hero, nav labels, shared card wording). */
export interface AppDiscoveryPageCopy {
  brand: string;
  navPractices: string;
  navInviteCodes: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  /** e.g. "with" before instructor name on discovery cards */
  cardInstructorPrefix: string;
  /** Practice schedule page (/app/practice/:slug/schedule) */
  scheduleEyebrow: string;
  scheduleTitle: string;
  scheduleSubtitle: string;
  scheduleBackAriaLabel: string;
  scheduleDateHeading: string;
  scheduleSlotsHeading: string;
  scheduleTimeAdjustHint: string;
  scheduleSessionsHeading: string;
  scheduleConfirmCta: string;
  scheduleEmptySessions: string;
  /** /app/my-bookings */
  myBookingsEyebrow: string;
  myBookingsTitle: string;
  myBookingsSubtitle: string;
  myBookingsBackAriaLabel: string;
  myBookingsTabUpcoming: string;
  myBookingsTabPast: string;
  myBookingsEmptyUpcoming: string;
  myBookingsEmptyPast: string;
  myBookingsExploreTitle: string;
  myBookingsExploreHint: string;
  myBookingsExploreCta: string;
}

export const appDiscoveryPage: AppDiscoveryPageCopy;
export const practices: Practice[];
