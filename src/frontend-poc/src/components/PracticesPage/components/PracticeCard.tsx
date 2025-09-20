import React, {
  RefObject,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import "../PracticesPage.css";
import { ScheduleCallSection } from "./ScheduleCallSection";
import { CallStatus } from "../../../App";
import { CallData } from "../../Dashboard";

export interface PracticeCardHandle {
  minimizeCard: () => void;
}

interface PracticeCardProps {
  key: number; // Unique key for each card
  title: string;
  isExpanded: boolean; // Optional prop to control expansion state
  onClick: (index: number, practice: String) => void;
  description: string;
  imageUrl: string;
  descriptionVideo?: string; // Optional video URL for the practice

  // WebRTC related props
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
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoteDescAddedForOfferer: React.Dispatch<React.SetStateAction<boolean>>;
  setAvailableCalls: React.Dispatch<React.SetStateAction<CallData[]>>;
}

export const PracticeCard = forwardRef<PracticeCardHandle, PracticeCardProps>(
  (
    {
      key,
      title,
      onClick,
      isExpanded,
      description,
      imageUrl,
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
      setShowPopup,
      setRemoteDescAddedForOfferer,
      setAvailableCalls,
    },
    ref
  ) => {
    /*
    const handleCardClick = (event: Event) => {
      event.stopPropagation(); // Stop the click from reaching the parent
      setIsExpanded((prev) => !prev);
      setIsMinimized(false);
      console.log("Card clicked, toggling expansion state to: " + !isExpanded);
    };

    const minimizeCard = () => {
      setIsExpanded(false);
      console.log("Card minimized");
    };

    useImperativeHandle(ref, () => ({
      minimizeCard,
    }));
*/
    return (
      <div
        className={`practice-card ${isExpanded ? "expanded" : ""}`}
        onClick={(e) => {
          console.log(
            "PracticeCard clicked stopping proppegation for: " + title
          );
          e.stopPropagation(); // Stop the click from reaching the parent
          onClick(key, title); // Call the onClick handler if provided
          //setIsExpanded((prev) => !prev);
        }}
      >
        <div className="card-content">
          <img src={imageUrl} alt={title} className="practice-image" />
          <div className="practice-details">
            <div className="practice-title">{title}</div>
            <div className="practice-description">
              <span>{description}</span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="expanded-content">
            <div className="expanded-row">
              <div
                className="video-section"
                onClick={(e) => e.stopPropagation()}
              >
                <video controls>
                  <source src="./noticing_game_fixed.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <ScheduleCallSection
                practice={title}
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
                setShowPopup={setShowPopup}
                setRemoteDescAddedForOfferer={setRemoteDescAddedForOfferer}
                setAvailableCalls={setAvailableCalls}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);
