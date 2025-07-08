import React, {
  RefObject,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import "../PracticesPage.css";
import { ScheduleCallSection } from "./ScheduleCallSection";
import { CallStatus } from "../../../App";

export interface CallHandlerPopUpHandle {
  minimizeCard: () => void;
}

interface CallHandlerPopUpProps {
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  availableCalls: { id: number; title: string }[];
  handleStartCall: () => void;
  handleJoinCall: (callId: number) => void;
}

export const CallHandlerPopUp = forwardRef<
  CallHandlerPopUpHandle,
  CallHandlerPopUpProps
>(({ setShowPopup, availableCalls, handleJoinCall, handleStartCall }, ref) => {
  return (
    <div className="popup-overlay" onClick={() => setShowPopup(false)}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-text">
          <h2>Available Calls</h2>
          <ul>
            {availableCalls.map((call) => (
              <li key={call.id}>
                {call.title}{" "}
                <button onClick={() => handleJoinCall(call.id)}>Join</button>
              </li>
            ))}
          </ul>
          <button onClick={handleStartCall}>Start New Call</button>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      </div>
    </div>
  );
});
