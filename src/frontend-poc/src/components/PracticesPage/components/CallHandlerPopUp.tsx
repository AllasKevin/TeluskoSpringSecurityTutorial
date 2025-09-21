import React, {
  RefObject,
  useImperativeHandle,
  useState,
  forwardRef,
  useRef,
  useEffect,
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
    const [availableMatches, setAvailableMatches] = useState<
      { userName: string; practice: string }[]
    >([]);

    const handleJoinCall = (otherCallerUserName: string | null | undefined) => {
      console.log(`Joining call`);
      webRtcManagerRef.current?.joinCall(practice, otherCallerUserName);

      //setShowPopup(false);
    };
    const handleAcceptCall = (
      otherCallerUserName: string | null | undefined
    ) => {
      console.log("handleStartCall called, setting showPopup to false");
      webRtcManagerRef.current?.acceptMatch(practice, otherCallerUserName);

      //setShowPopup(false);
    };
    const handleDeclineCall = (
      otherCallerUserName: string | null | undefined
    ) => {
      console.log("handleDeclineCall called");
      webRtcManagerRef.current?.declineMatch(practice, otherCallerUserName);

      //setShowPopup(false);
    };
    const handleStartCall = () => {
      console.log("handleStartCall called, setting showPopup to false");
      webRtcManagerRef.current?.startNewCall(practice);

      //setShowPopup(false);
    };
    const handleFindMatch = () => {
      console.log("handleStartCall called, setting showPopup to false");
      webRtcManagerRef.current?.findMatch(practice);

      //setShowPopup(false);
    };

    useEffect(() => {
      console.log("availableMatches updated: " + availableMatches);
      console.log(availableMatches);
    }, [availableMatches]);

    const webRtcManagerRef = useRef<WebRtcManagerNewHandle>(null);

    console.log("availableMatches:", availableMatches); // ✅ Log here
    console.log(availableMatches);

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
          setAvailableMatches={setAvailableMatches}
          practice={practice}
        />
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="popup-text">
            <h2>Potential matches found </h2>{" "}
            <ul>
              {Array.isArray(availableMatches) &&
                availableMatches.map((match, index) => (
                  <li key={index}>
                    {match.userName}
                    {" Calling"}
                    {/* <button onClick={() => handleJoinCall(match.userName)}>
                      Join
                    </button>  */}
                    <button onClick={() => handleAcceptCall(match.userName)}>
                      Accept
                    </button>
                    <button onClick={() => handleDeclineCall(match.userName)}>
                      Decline
                    </button>
                  </li>
                ))}
            </ul>
            {/* <button onClick={handleStartCall}>Start New Call</button>  */}
            <button onClick={handleFindMatch}>Check Match</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      </div>
    );
  }
);
