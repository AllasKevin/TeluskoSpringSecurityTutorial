import React from "react";
import "./VideoPage.css";

interface CountdownTimerProps {
  countdown: number | null;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ countdown }) => {
  if (countdown === null) {
    return null;
  }

  return (
    <div className="countdown-timer">
      <span className="countdown-icon" aria-hidden="true">⏱️</span>
      <span className="countdown-text">{countdown}</span>
    </div>
  );
};

export default CountdownTimer;

