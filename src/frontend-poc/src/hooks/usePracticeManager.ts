import { useEffect } from "react";

export const usePracticeManager = (
  config: { duration: number; audioCues: readonly { time: number; src: string }[] },
  onEnd: () => void
) => {
  useEffect(() => {
    const timers: number[] = [];

    console.log("Practice started with config:", config);
    config.audioCues.forEach((cue) => {
      timers.push(window.setTimeout(() => new Audio(cue.src).play(), cue.time));
    });

    const endTimer = window.setTimeout(onEnd, config.duration);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(endTimer);
    };
  }, [config, onEnd]);
};
