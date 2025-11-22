export const practiceConfigs = {
  askingpractice: {
    duration: 262000,
    endingDuration: 60000, // 60 seconds countdown
    audioCues: [
      { time: 2_000, src: "/audio/asking_practice_instructions_1.mp3" },
      { time: 62_000, src: "/audio/asking_practice_instructions_2.mp3" },
      { time: 122_000, src: "/audio/asking_practice_instructions_3.mp3" },
      { time: 182_000, src: "/audio/asking_practice_instructions_4.mp3" },
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