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
import { Practice } from "../../../../../shared/practices/practices";

export interface PracticeCardHandle {
  minimizeCard: () => void;
}

interface PracticeCardProps {
  key: number; // Unique key for each card
  isExpanded: boolean; // Optional prop to control expansion state
  onClick: (index: number, practice: String) => void;
  practice: Practice;
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
  setShowCallModal: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoteDescAddedForOfferer: React.Dispatch<React.SetStateAction<boolean>>;
  setAvailableCalls: React.Dispatch<React.SetStateAction<CallData[]>>;
}

export const PracticeCard = forwardRef<PracticeCardHandle, PracticeCardProps>(
  (
    {
      key,
      onClick,
      isExpanded,
      practice,
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
      setShowCallModal,
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
            "PracticeCard clicked stopping proppegation for: " + practice.title
          );
          e.stopPropagation(); // Stop the click from reaching the parent
          onClick(key, practice.title); // Call the onClick handler if provided
          //setIsExpanded((prev) => !prev);
        }}
      >
        <div className="card-content">
          {practice.imageUrl.endsWith("mandala.png") ? (
            <img
              src={practice.imageUrl}
              alt="Company Logo"
              className="practice-logo-icon"
            />
          ) : (
            <img
              src={practice.imageUrl}
              alt={practice.title}
              className="practice-image"
            />
          )}
          <div className="practice-details">
            <div className="practice-title">{practice.title}</div>
            <div className="practice-description">
              <span>{practice.description}</span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="expanded-content">
            <div className="centered-video-container">
              {practice.videoUrl && (
                <div
                  className="video-section"
                  onClick={(e) => e.stopPropagation()}
                >
                  <video controls poster={practice.thumbnailUrl ?? undefined}>
                    <source src={practice.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              <button
                className="call-action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCallModal(true);
                }}
              >
                <span className="button-icon">📞</span>
                <span className="button-text">Join or Schedule Call</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
