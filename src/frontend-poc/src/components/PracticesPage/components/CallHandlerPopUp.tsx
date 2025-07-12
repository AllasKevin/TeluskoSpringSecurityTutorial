import React, {
  RefObject,
  useImperativeHandle,
  useState,
  forwardRef,
  useRef,
} from "react";
import "../PracticesPage.css";
import { ScheduleCallSection } from "./ScheduleCallSection";
import { CallStatus } from "../../../App";
import {
  WebRtcManager,
  WebRtcManagerNewHandle,
} from "../../WebRtcManager/WebRtcManager";
import { CallData } from "../../Dashboard";

export interface CallHandlerPopUpHandle {
  minimizeCard: () => void;
}

interface CallHandlerPopUpProps {
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  availableCalls: CallData[];
  callStatus: CallStatus | undefined;
  updateCallStatus: React.Dispatch<
    React.SetStateAction<CallStatus | undefined>
  >;
  localStream: MediaStream | undefined;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  remoteStream: MediaStream | undefined;
  setRemoteStream: React.Dispatch<
    React.SetStateAction<MediaStream | undefined>
  >;
  peerConnection: RTCPeerConnection | undefined;
  setPeerConnection: React.Dispatch<
    React.SetStateAction<RTCPeerConnection | undefined>
  >;
  offerData: CallData | undefined;
  setOfferData: React.Dispatch<React.SetStateAction<any>>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
  localFeedEl: RefObject<HTMLVideoElement | null>;
  gatheredAnswerIceCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
  setIceCandidatesReadyTrigger: React.Dispatch<React.SetStateAction<number>>;
  remoteDescAddedForOfferer: boolean;
  setRemoteDescAddedForOfferer: React.Dispatch<React.SetStateAction<boolean>>;
  setAvailableCalls: React.Dispatch<React.SetStateAction<CallData[]>>;
  practice: string; // Optional prop to pass the practice name
}

export const CallHandlerPopUp = forwardRef<
  CallHandlerPopUpHandle,
  CallHandlerPopUpProps
>(
  (
    {
      setShowPopup,
      availableCalls,
      callStatus,
      updateCallStatus,
      localStream,
      setLocalStream,
      remoteStream,
      setRemoteStream,
      peerConnection,
      setPeerConnection,
      offerData,
      setOfferData,
      remoteFeedEl,
      localFeedEl,
      gatheredAnswerIceCandidatesRef,
      setIceCandidatesReadyTrigger,
      remoteDescAddedForOfferer,
      setRemoteDescAddedForOfferer,
      setAvailableCalls,
      practice,
    },
    ref
  ) => {
    const handleJoinCall = () => {
      console.log(`Joining call`);
      webRtcManagerRef.current?.checkMatch(practice);

      //setShowPopup(false);
    };
    const handleStartCall = () => {
      console.log("handleStartCall called, setting showPopup to false");
      webRtcManagerRef.current?.checkMatch(practice);

      //setShowPopup(false);
    };

    const webRtcManagerRef = useRef<WebRtcManagerNewHandle>(null);

    return (
      <div className="popup-overlay" onClick={() => setShowPopup(false)}>
        <WebRtcManager
          ref={webRtcManagerRef}
          callStatus={callStatus}
          updateCallStatus={updateCallStatus}
          localStream={localStream}
          setLocalStream={setLocalStream}
          remoteStream={remoteStream}
          setRemoteStream={setRemoteStream}
          peerConnection={peerConnection}
          setPeerConnection={setPeerConnection}
          offerData={offerData}
          setOfferData={setOfferData}
          remoteFeedEl={remoteFeedEl}
          localFeedEl={localFeedEl}
          gatheredAnswerIceCandidatesRef={gatheredAnswerIceCandidatesRef}
          setIceCandidatesReadyTrigger={setIceCandidatesReadyTrigger}
          remoteDescAddedForOfferer={remoteDescAddedForOfferer}
          setRemoteDescAddedForOfferer={setRemoteDescAddedForOfferer}
          setAvailableCalls={setAvailableCalls}
        />
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="popup-text">
            <h2>Available Calls</h2>
            <ul>
              {availableCalls.map((call, index) => (
                <li key={index}>
                  {call.offererUserName}
                  {" Calling"}
                  <button onClick={() => handleJoinCall()}>Join</button>
                </li>
              ))}
            </ul>
            <button onClick={handleStartCall}>Start New Call</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      </div>
    );
  }
);
