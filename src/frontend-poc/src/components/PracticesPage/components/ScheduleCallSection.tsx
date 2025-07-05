import React, { RefObject, useRef, useState } from "react";
import MandalaImage from "../../../assets/mandala.png";
import PlannerImage from "../../../assets/planner.png";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CallStatus } from "../../../App";
import {
  WebRtcManager,
  WebRtcManagerNewHandle,
} from "../../WebRtcManager/WebRtcManager";

interface ScheduleCallSectionProps {
  practice: string; // Optional prop to pass the practice name
  callStatus: CallStatus | undefined;
  updateCallStatus: React.Dispatch<
    React.SetStateAction<CallStatus | undefined>
  >;
  //  localStream: MediaStream | undefined;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  remoteStream: MediaStream | undefined;
  setRemoteStream: React.Dispatch<
    React.SetStateAction<MediaStream | undefined>
  >;
  peerConnection: RTCPeerConnection | undefined;
  setPeerConnection: React.Dispatch<
    React.SetStateAction<RTCPeerConnection | undefined>
  >;
  //  offerData: any;
  setOfferData: React.Dispatch<React.SetStateAction<any>>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
  localFeedEl: RefObject<HTMLVideoElement | null>;
  gatheredAnswerIceCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
  setIceCandidatesReadyTrigger: React.Dispatch<React.SetStateAction<number>>;
  remoteDescAddedForOfferer: boolean;
}

export const ScheduleCallSection: React.FC<ScheduleCallSectionProps> = ({
  practice,
  callStatus,
  updateCallStatus,
  setLocalStream,
  remoteStream,
  setRemoteStream,
  peerConnection,
  setPeerConnection,
  setOfferData,
  remoteFeedEl,
  localFeedEl,
  gatheredAnswerIceCandidatesRef,
  setIceCandidatesReadyTrigger,
  remoteDescAddedForOfferer,
}) => {
  const [activeTab, setActiveTab] = useState<"join" | "schedule">("join"); // default is "join"
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const navigate = useNavigate();

  const webRtcManagerRef = useRef<WebRtcManagerNewHandle>(null);

  const handlePracticeNow = () => {
    console.log("handlePracticeNow CALLED with practice:", practice);

    webRtcManagerRef.current?.checkMatch(practice); // or whatever type you want
  };
  /*
  const goToDashboard = () => {
    navigate("/dashboard");
    console.log("Navigating to dashboard");
  };
*/
  return (
    <div className="call-section" onClick={(e) => e.stopPropagation()}>
      <WebRtcManager
        ref={webRtcManagerRef}
        callStatus={callStatus}
        updateCallStatus={updateCallStatus}
        setLocalStream={setLocalStream}
        remoteStream={remoteStream}
        setRemoteStream={setRemoteStream}
        peerConnection={peerConnection}
        setPeerConnection={setPeerConnection}
        setOfferData={setOfferData}
        remoteFeedEl={remoteFeedEl}
        localFeedEl={localFeedEl}
        gatheredAnswerIceCandidatesRef={gatheredAnswerIceCandidatesRef}
        setIceCandidatesReadyTrigger={setIceCandidatesReadyTrigger}
        remoteDescAddedForOfferer={remoteDescAddedForOfferer}
      />
      <div className="button-row">
        <button
          onClick={() => {
            setActiveTab("join");

            console.log("Joining call...");
          }}
          className={activeTab === "join" ? "active-button" : ""}
        >
          <img
            className="call-section-item call-section-logo-item"
            src={MandalaImage}
            alt={MandalaImage}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("schedule");
          }}
          className={activeTab === "schedule" ? "active-button" : ""}
        >
          <img
            className="call-section-item"
            src={PlannerImage}
            alt={PlannerImage}
          />{" "}
        </button>
      </div>

      {activeTab === "join" && (
        <div className="join-call-content">
          <button onClick={handlePracticeNow}>Practice Now</button>
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="scheduler-section">
          <p>Schedule Call</p>

          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15} // choose intervals: 15 mins, 30 mins, etc
            timeCaption="Time"
            dateFormat="MMM d, yyyy HH:mm" // Example: "Jun 8, 2025 14:30"
            placeholderText="Select date and time"
            popperPlacement="bottom" // Optional: ensures it pops under the field
            isClearable={false} // <--- disables clear button
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("join");
            }}
          >
            Back to Join Call
          </button>
        </div>
      )}
    </div>
  );
};
