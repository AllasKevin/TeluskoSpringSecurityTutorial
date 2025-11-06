import { useEffect, useState, useRef } from "react";

export const usePracticeManager = (
  config: { 
    duration: number; 
    endingDuration?: number;
    audioCues: readonly { time: number; src: string }[] 
  },
  onEnd: () => void
) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const onEndRef = useRef(onEnd);
  const timersRef = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);
  const endTimerRef = useRef<number | null>(null);
  const configRef = useRef(config);
  const hasStartedRef = useRef(false);

  // Update refs when they change
  useEffect(() => {
    onEndRef.current = onEnd;
    configRef.current = config;
  }, [onEnd, config]);

  useEffect(() => {
    // Prevent multiple starts - check if already started
    if (hasStartedRef.current) {
      console.log("Practice manager already started, skipping...");
      return;
    }

    // Check if timers are already running
    if (timersRef.current.length > 0 || intervalRef.current !== null || endTimerRef.current !== null) {
      console.log("Timers already exist, cleaning up first...");
      // Clean up existing timers
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
    const endingDuration = currentConfig.endingDuration || 0;
    const countdownStartTime = currentConfig.duration - endingDuration;

    console.log("Practice started with config:", currentConfig);
    console.log(`Duration: ${currentConfig.duration}ms, Ending duration: ${endingDuration}ms, Countdown starts at: ${countdownStartTime}ms`);
    
    // Schedule audio cues
    currentConfig.audioCues.forEach((cue) => {
      const timerId = window.setTimeout(() => {
        console.log(`Playing audio cue at ${cue.time}ms: ${cue.src}`);
        new Audio(cue.src).play();
      }, cue.time);
      timers.push(timerId);
    });

    // Update countdown every 100ms for smooth updates
    const countdownInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = currentConfig.duration - elapsed;
      
      // Only update if we're in the countdown period
      if (elapsed >= countdownStartTime) {
        if (remaining > 0) {
          // Show countdown in seconds
          const secondsRemaining = Math.ceil(remaining / 1000);
          const displayValue = secondsRemaining > 0 ? secondsRemaining : 0;
          setCountdown(displayValue);
        } else {
          // Time is up - countdown will be cleared by endTimer
          setCountdown(0);
        }
      }
      // Before countdown starts, don't update (keep it null)
    }, 100);

    intervalRef.current = countdownInterval;

    // Schedule end callback
    const endTimer = window.setTimeout(() => {
      console.log("Practice duration ended, calling onEnd");
      setCountdown(null);
      onEndRef.current();
    }, currentConfig.duration);

    endTimerRef.current = endTimer;
    timersRef.current = timers;

    return () => {
      console.log("Cleaning up practice manager");
      hasStartedRef.current = false;
      timers.forEach(clearTimeout);
      if (endTimer) clearTimeout(endTimer);
      if (countdownInterval) clearInterval(countdownInterval);
      setCountdown(null);
      timersRef.current = [];
      intervalRef.current = null;
      endTimerRef.current = null;
    };
    // Empty dependency array - only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return countdown;
};
