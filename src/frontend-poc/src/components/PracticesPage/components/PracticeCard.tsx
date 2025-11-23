import React, {
  RefObject,
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
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

    const openIntroVideo = () => {
      const videoEl = document.getElementById(
        "intro-video"
      ) as HTMLVideoElement | null;
      if (!videoEl) return;

      // Remove the hidden class so video is interactive
      videoEl.classList.remove("intro-video-element-hidden");

      // Ensure controls are enabled and video is ready
      videoEl.controls = true;

      // Use browser's native fullscreen
      const enterFullscreen = () => {
        if (videoEl.requestFullscreen) {
          return videoEl.requestFullscreen();
        } else if ((videoEl as any).webkitRequestFullscreen) {
          return (videoEl as any).webkitRequestFullscreen();
        } else if ((videoEl as any).mozRequestFullScreen) {
          return (videoEl as any).mozRequestFullScreen();
        } else if ((videoEl as any).webkitEnterFullscreen) {
          // iOS Safari
          (videoEl as any).webkitEnterFullscreen();
          return Promise.resolve();
        }
        return Promise.reject();
      };

      enterFullscreen()
        .then(() => {
          // Play the video after entering fullscreen
          videoEl.play().catch(() => {});
        })
        .catch(() => {
          // If fullscreen fails, still try to play
          videoEl.play().catch(() => {});
        });
    };

    // Handle fullscreen exit to pause and hide video
    useEffect(() => {
      const handleFullscreenChange = () => {
        const videoEl = document.getElementById(
          "intro-video"
        ) as HTMLVideoElement | null;
        if (!videoEl) return;

        const isFullscreen =
          document.fullscreenElement === videoEl ||
          (document as any).webkitFullscreenElement === videoEl ||
          (document as any).mozFullScreenElement === videoEl ||
          (document as any).msFullscreenElement === videoEl;

        if (!isFullscreen) {
          // Exited fullscreen - pause and hide the video
          videoEl.pause();
          videoEl.classList.add("intro-video-element-hidden");
        }
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.addEventListener("mozfullscreenchange", handleFullscreenChange);
      document.addEventListener("MSFullscreenChange", handleFullscreenChange);

      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
        document.removeEventListener(
          "webkitfullscreenchange",
          handleFullscreenChange
        );
        document.removeEventListener(
          "mozfullscreenchange",
          handleFullscreenChange
        );
        document.removeEventListener(
          "MSFullscreenChange",
          handleFullscreenChange
        );
      };
    }, []);

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
            <div className="practice-title">
              <span className="title-text">{practice.title}</span>
              {practice.instructor?.name && (
                <span className="instructor-name-in-title">
                  {" "}
                  with {practice.instructor.name}
                </span>
              )}
            </div>
            <div className="practice-description">
              <span>{practice.description}</span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="expanded-content">
            {practice.videoUrl && (
              <div
                className="video-section"
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  id="intro-video"
                  controls
                  className="intro-video-element-hidden"
                  playsInline
                  onMouseMove={(e) => {
                    e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <source src={practice.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="expanded-bottom-section">
              <div
                className="thumbnail-section"
                onClick={(e) => {
                  e.stopPropagation();
                  openIntroVideo();
                }}
              >
                {practice.videoUrl && practice.thumbnailUrl && (
                  <button
                    className="video-thumb"
                    onClick={(e) => {
                      e.stopPropagation();
                      openIntroVideo();
                    }}
                  >
                    <div className="thumb-wrapper">
                      <img
                        src={practice.thumbnailUrl}
                        alt="Play intro video"
                        className="thumb-image"
                      />
                      <div className="thumb-overlay">
                        <span className="thumb-icon">▶</span>
                      </div>
                    </div>
                  </button>
                )}
                {practice.videoUrl && practice.thumbnailUrl && (
                  <p className="thumb-instruction">Tap to watch the intro</p>
                )}
              </div>
              {practice.instructor && (
                <div className="instructor-links-section">
                  {practice.instructor.name && (
                    <p className="instructor-name-text">
                      Find more from {practice.instructor.name}
                    </p>
                  )}
                  <div className="social-media-links">
                    {practice.instructor.website && (
                      <a
                        href={practice.instructor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Website"
                      >
                        <span className="link-icon">🌐</span>
                      </a>
                    )}
                    {practice.instructor.socialMedia &&
                      [
                        { key: "instagram", icon: "📷" },
                        { key: "facebook", icon: "👥" },
                        { key: "twitter", icon: "🐦" },
                        { key: "linkedin", icon: "💼" },
                        { key: "youtube", icon: "📺" },
                      ]
                        .filter(
                          (item) =>
                            practice.instructor?.socialMedia?.[
                              item.key as keyof typeof practice.instructor.socialMedia
                            ]
                        )
                        .map((item) => (
                          <a
                            key={item.key}
                            href={
                              practice.instructor?.socialMedia?.[
                                item.key as keyof typeof practice.instructor.socialMedia
                              ]
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={
                              item.key.charAt(0).toUpperCase() +
                              item.key.slice(1)
                            }
                          >
                            <span className="link-icon">{item.icon}</span>
                          </a>
                        ))}
                  </div>
                </div>
              )}
            </div>
            <div className="call-button-container">
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
