export const practiceConfigs = {
  askingpractice: {
    duration: 602000,
    endingDuration: 60000, // 60 seconds countdown
    audioCues: [
      { time: 2_000, src: "/audio/asking_practice_instructions_1.mp3" },
      { time: 182_000, src: "/audio/asking_practice_instructions_2.mp3" },
      { time: 362_000, src: "/audio/asking_practice_instructions_3.mp3" },
      { time: 542_000, src: "/audio/asking_practice_instructions_4.mp3" },
    ],
  },
  noticinggame: {
    duration: 561000,
    endingDuration: 60000, // 60 seconds countdown
    audioCues: [
      { time: 2_000, src: "/audio/noticing_game_instructions_1.mp3" },
      { time: 152_000, src: "/audio/noticing_game_instructions_2.mp3" },
      { time: 267_000, src: "/audio/noticing_game_instructions_3.mp3" },
      { time: 453_000, src: "/audio/noticing_game_instructions_4.mp3" },
    ],
  },
  ifspartssharing: {
    duration: 3600000,
    endingDuration: 420000, // 420 seconds countdown
    audioCues: [
      { time: 2_000, src: "/audio/ifs_parts_sharing_instructions.mp3" },
    ],
  },
} as const;