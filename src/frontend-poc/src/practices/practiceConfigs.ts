export const practiceConfigs = {
  askingpractice: {
    duration: 30000,
    endingDuration: 5000, // 5 seconds countdown
    audioCues: [
      { time: 2_000, src: "/audio/choose-one-vocal.wav" },
      { time: 10_000, src: "/audio/vocal-two.wav" },
      { time: 20_000, src: "/audio/vocal-three-hey.wav" },
    ],
  },
  noticinggame: {
    duration: 60000,
    endingDuration: 10000, // 10 seconds countdown
    audioCues: [
      { time: 1_000, src: "/audio/vocal-shot-two.wav" },
      { time: 10_000, src: "/audio/vocal-three.wav" },
    ],
  },
  assertandprotect: {
    duration: 60000,
    endingDuration: 10000, // 10 seconds countdown
    audioCues: [
      { time: 1_000, src: "/audio/vocal-shot-two.wav" },
      { time: 10_000, src: "/audio/vocal-three.wav" },
    ],
  },
  gratitudepractice: {
    duration: 60000,
    endingDuration: 10000, // 10 seconds countdown
    audioCues: [
      { time: 1_000, src: "/audio/vocal-shot-two.wav" },
      { time: 10_000, src: "/audio/vocal-three.wav" },
    ],
  },
  kirtan: {
    duration: 60000,
    endingDuration: 10000, // 10 seconds countdown
    audioCues: [
      { time: 1_000, src: "/audio/vocal-shot-two.wav" },
      { time: 10_000, src: "/audio/vocal-three.wav" },
    ],
  },
  noncontactimprov: {
    duration: 60000,
    endingDuration: 10000, // 10 seconds countdown
    audioCues: [
      { time: 1_000, src: "/audio/vocal-shot-two.wav" },
      { time: 10_000, src: "/audio/vocal-three.wav" },
    ],
  },
  echooftrueself: {
    duration: 60000,
    endingDuration: 10000, // 10 seconds countdown
    audioCues: [
      { time: 1_000, src: "/audio/vocal-shot-two.wav" },
      { time: 10_000, src: "/audio/vocal-three.wav" },
    ],
  },
} as const;