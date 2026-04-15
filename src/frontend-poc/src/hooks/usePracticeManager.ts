import { useEffect, useState, useRef } from 'react';

interface PracticeConfig {
  duration: number;
  endingDuration?: number;
  audioCues: readonly { time: number; src: string }[];
}

export const usePracticeManager = (config: PracticeConfig, onEnd: () => void) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const onEndRef = useRef(onEnd);
  const timersRef = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);
  const endTimerRef = useRef<number | null>(null);
  const configRef = useRef(config);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    onEndRef.current = onEnd;
    configRef.current = config;
  }, [onEnd, config]);

  useEffect(() => {
    if (hasStartedRef.current) return;

    if (timersRef.current.length > 0 || intervalRef.current !== null || endTimerRef.current !== null) {
      timersRef.current.forEach(clearTimeout);
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      if (endTimerRef.current !== null) clearTimeout(endTimerRef.current);
      timersRef.current = [];
      intervalRef.current = null;
      endTimerRef.current = null;
    }

    hasStartedRef.current = true;
    const currentConfig = configRef.current;
    const timers: number[] = [];
    const startTime = Date.now();
    const endingDuration = currentConfig.endingDuration ?? 0;
    const countdownStartTime = currentConfig.duration - endingDuration;

    currentConfig.audioCues.forEach((cue) => {
      const timerId = window.setTimeout(() => {
        new Audio(cue.src).play();
      }, cue.time);
      timers.push(timerId);
    });

    const countdownInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = currentConfig.duration - elapsed;

      if (elapsed >= countdownStartTime) {
        if (remaining > 0) {
          const secondsRemaining = Math.ceil(remaining / 1000);
          setCountdown(secondsRemaining > 0 ? secondsRemaining : 0);
        } else {
          setCountdown(0);
        }
      }
    }, 100);

    intervalRef.current = countdownInterval as unknown as number;

    const endTimer = window.setTimeout(() => {
      setCountdown(null);
      onEndRef.current();
    }, currentConfig.duration);

    endTimerRef.current = endTimer;
    timersRef.current = timers;

    return () => {
      hasStartedRef.current = false;
      timers.forEach(clearTimeout);
      if (endTimer) clearTimeout(endTimer);
      if (countdownInterval) clearInterval(countdownInterval);
      setCountdown(null);
      timersRef.current = [];
      intervalRef.current = null;
      endTimerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return countdown;
};
