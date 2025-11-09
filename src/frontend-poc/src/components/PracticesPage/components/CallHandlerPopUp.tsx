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
import { Booking } from "../../../types/booking";

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
  practice: string;
  currentBooking: Booking | undefined; // Optional prop to pass the booking
  setCurrentBooking: React.Dispatch<React.SetStateAction<Booking | undefined>>; // Optional setter for the booking
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
      currentBooking,
      setCurrentBooking,
    },
    ref
  ) => {
    const webRtcManagerRef = useRef<WebRtcManagerNewHandle>(null);
    const [availableMatches, setAvailableMatches] = useState<
      { userName: string; practice: string }[]
    >([]);

    const [checkingMatch, setCheckingMatch] = useState(false);

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
      console.log("handleFindMatch called, setting showPopup to false");
      console.log(availableMatches);
      setCheckingMatch(true);
      webRtcManagerRef.current?.findMatch(practice);

      //setShowPopup(false);
    };

    // Use useEffect to ensure webRtcManagerRef is available before calling findMatch
    useEffect(() => {
      if (currentBooking && webRtcManagerRef.current) {
        console.log("Current booking in CallHandlerPopUp:", currentBooking);
        console.log("webRtcManagerRef is available, calling findMatch");

        // Add a delay to ensure WebRTC manager socket listeners are fully initialized
        // The WebRtcManager initializes socket listeners in a useEffect that runs on mount
        const timeoutId = setTimeout(() => {
          console.log(
            "Delayed findMatch call - WebRTC manager should be ready now"
          );
          webRtcManagerRef.current?.findMatch(practice);
          console.log("Called findMatch with practice:", practice);
        }, 2000); // 2 seconds to ensure socket listeners are set up

        // Cleanup timeout if component unmounts or dependencies change
        return () => clearTimeout(timeoutId);
      } else if (currentBooking && !webRtcManagerRef.current) {
        console.log(
          "Current booking exists but webRtcManagerRef is not available yet"
        );
      }
    }, [currentBooking, practice]);

    useEffect(() => {
      console.log(
        "availableMatches updated in callhandlepopu.useEffect:",
        availableMatches
      ); // ✅ Log here

      if (availableMatches.length > 0 && currentBooking) {
        const otherCallerUserName =
          currentBooking.userName === sessionStorage.getItem("username")
            ? currentBooking.responses?.find(
                (response) => response.responseStatus === "ACCEPTED"
              )?.responder.username
            : currentBooking.userName;

        console.log("Matches found, currentBooking:", currentBooking);
        availableMatches.forEach((match) => {
          console.log("Match:", match);
          console.log("otherCallerUserName:", otherCallerUserName);
          if (
            //match.practice === currentBooking.practice && TODO: VÄLDIGT VIKTIGT ATT KOLLA
            otherCallerUserName === match.userName
          ) {
            console.log("Auto-accepting match for user:", match.userName);
            webRtcManagerRef.current?.acceptMatch(practice, match.userName);
          }
        });
      }
    }, [availableMatches]);

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
          setShowPopup={setShowPopup}
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
            {Array.isArray(availableMatches) &&
              availableMatches.length === 0 &&
              checkingMatch && <div>Checking for match... </div>}
            {/* <button onClick={handleStartCall}>Start New Call</button>  */}
            <button onClick={handleFindMatch}>Check Match</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      </div>
    );
  }
);
