export const appDiscoveryPage = {
  brand: "Tuff Anytime",
  navPractices: "Practices",
  navInviteCodes: "Invitation Codes",
  heroEyebrow: "Growth protocol",
  heroTitle: "Practice discovery",
  heroSubtitle:
    "Choose a module to read more, watch the intro, and join or schedule a live session.",
  cardInstructorPrefix: "with",
  scheduleEyebrow: "Relational practice",
  scheduleTitle: "Schedule practice session",
  scheduleSubtitle:
    "Select your preferred time. Offer a new session or join one that matches this module.",
  scheduleBackAriaLabel: "Back to module",
  scheduleDateHeading: "Select date",
  scheduleSlotsHeading: "Select time",
  scheduleTimeAdjustHint: "Drag to adjust time",
  scheduleSessionsHeading: "Other users' bookings",
  scheduleConfirmCta: "Confirm booking",
  scheduleEmptySessions: "No sessions at this time yet. Create one below.",
  myBookingsEyebrow: "Practice management",
  myBookingsTitle: "My bookings",
  myBookingsSubtitle:
    "Confirm, join, or manage sessions you host or have joined.",
  myBookingsBackAriaLabel: "Back to discovery",
  myBookingsTabUpcoming: "Upcoming",
  myBookingsTabPast: "Past sessions",
  myBookingsEmptyUpcoming: "No upcoming sessions.",
  myBookingsEmptyPast: "No past sessions yet.",
  myBookingsExploreTitle: "Need more practice?",
  myBookingsExploreHint:
    "Book a new session and keep building your relational skills.",
  myBookingsExploreCta: "Explore schedule",
};

export const practices = [
    {
      title: "Asking Practice",
      name: "askingpractice",
      description:
        "Practice what it feels like to play around with asking for what ever comes to mind, or go beyond and connect with and express your deepest wishes.",
      imageUrl: "/profilepictures/lore.jpg",
      videoUrl: "/instructionvideos/asking_practice.mp4",
      thumbnailUrl: "/instructionvideos/asking_practice.png",
      instructor: {
        name: "Lore Blancke",
        website: "https://www.intimate-breath.com",
        socialMedia: {
          facebook: "https://www.facebook.com/IntimateBreath/",
          instagram: "https://www.instagram.com/intimatebreath",
        },
      },
      length: "10 minutes",
      tagline:
        "Master the art of the open-ended question to unlock team potential and deeper relational bridges.",
      moduleLabel: "Leadership Module",
      contentTypeLabel: "Instructional",
      facilitatorRole: "Relational Architect",
      facilitatorQuote:
        "Leadership isn't about having the right answers, but asking the right questions.",
      objectives: [
        "Identify 'Fix-it' reflexes and redirect them into curious inquiries.",
        "Structure questions that promote psychological safety and ownership.",
        "Practice the 'Wait' technique to allow space for meaningful answers.",
      ],
      aboutExtended:
        'This practice is designed for established leaders who find themselves constantly in "resolution mode." By pivoting from directive speech to relational asking, you empower your team to discover solutions independently, fostering a culture of high-growth accountability.',
      practiceDetailLabels: {
        brand: "Tuff Anytime",
        objectivesHeading: "Session objectives",
        aboutHeading: "About this practice",
        joinCta: "Join now",
        scheduleCta: "Schedule for later",
        backAriaLabel: "Back to discovery",
        playVideoAriaLabel: "Play intro video",
      },
    },
    {
      title: "Noticing Game",
      name: "noticinggame",
      description:
        "Explore what experiences are revealed inside yourself in the present moment and relate those authentically to your co-explorer.",
      imageUrl: "/profilepictures/nadine.jpg",
      videoUrl: "/instructionvideos/noticing_game.mp4",
      thumbnailUrl: "/instructionvideos/noticing_game.png",
      instructor: {
        name: "Nadine Edstrand",
        socialMedia: {
          instagram: "https://www.instagram.com/nadineedstrand",
          website: "https://www.bigheartcommunity.se",
        },
      },
      length: "10 minutes",
      tagline:
        "Slow down, notice what is alive in you right now, and share it in a way your partner can receive.",
      moduleLabel: "Presence module",
      contentTypeLabel: "Experiential",
      facilitatorRole: "Facilitator and community weaver",
      facilitatorQuote:
        "What we notice together becomes a bridge—not a performance.",
      objectives: [
        "Land in the body and name inner experience without fixing or explaining it away.",
        "Offer reflections that stay close to your own truth while inviting connection.",
        "Hold pauses and uncertainty as part of the practice, not problems to solve.",
      ],
      aboutExtended:
        "The Noticing Game invites you into relational presence: you turn attention toward subtle sensations, emotions, and images as they arise, then articulate them honestly. It builds capacity to stay with what is true in the moment and to meet another person from that place—ideal for deepening intimacy, empathy, and authentic dialogue in pairs or small groups.",
    },
    {
      title: "IFS parts-sharing",
      name: "ifspartssharing",
      description:
        "Step into different parts of yourself, and allow yourself to communicate from those places. Experience the integration and inner harmony that comes with that.",
      imageUrl: "/profilepictures/daniel.jpg",
      videoUrl: "/instructionvideos/ifs_parts_sharing.mp4",
      thumbnailUrl: "/instructionvideos/ifs_parts_sharing.png",
      instructor: {
        name: "Daniel Rashid",
        socialMedia: {
          facebook: "https://www.facebook.com/Z7danneZ7",
        },
      },
      length: "60 minutes",
      tagline:
        "Give voice to different parts of you and discover how compassion and clarity emerge when every part is welcome.",
      moduleLabel: "Inner work",
      contentTypeLabel: "Experiential",
      facilitatorRole: "IFS-informed guide",
      facilitatorQuote:
        "No part of you is the enemy; every part has a story worth hearing.",
      objectives: [
        "Recognize distinct parts (managers, firefighters, exiles) and speak from one at a time.",
        "Practice Self-led curiosity toward parts that carry strong emotion or rigid beliefs.",
        "Integrate insights by acknowledging what each part needs before shifting perspective.",
      ],
      aboutExtended:
        "Inspired by Internal Family Systems, this practice structures a respectful conversation between the different parts of your inner world. By role-shifting and listening without merging, you reduce internal conflict and nurture Self energy—so compassion, confidence, and playfulness can lead. It suits anyone exploring personal growth, therapy-adjacent work, or facilitation with a parts-friendly lens.",
    },  
    {
      title: "Any Practice",
      name: "anypractice",
      description:
        "If you are up for whichever practice, here you can see all available calls and bookings for all practices..",
      imageUrl: "/brand/tuff-ledarskap-wordmark.png"
    },
];