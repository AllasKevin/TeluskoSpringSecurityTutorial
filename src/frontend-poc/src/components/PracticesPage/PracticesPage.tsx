import React, { RefObject, useEffect, useRef, useState } from "react";
import { PracticeCard, PracticeCardHandle } from "./components/PracticeCard";
import { FilterHeader } from "./components/FilterHeader";
import { NavigationBar } from "./components/NavigationBar";
import "./PracticesPage.css";
import Profilbild from "../../assets/Profilbild.jpg";
import dileva from "../../assets/dileva.jpg";
import gabor from "../../assets/gabor-mate.jpg";
import tony from "../../assets/tony-robbins.webp";
import nadine from "../../assets/nadine.jpg";
import swan from "../../assets/teal-swan.webp";

import { ListGroup } from "react-bootstrap";
import { CallStatus } from "../../App";
import { CallHandlerPopUp } from "./components/CallHandlerPopUp";
import { CallModal } from "./components/CallModal";
import { CallData } from "../Dashboard";

interface PracticesPageProps {
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
}

export const PracticesPage: React.FC<PracticesPageProps> = ({
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
}) => {
  console.log(callStatus);
  console.log(updateCallStatus);
  console.log(setLocalStream);

  const practices = [
    {
      title: "Noticing Game",
      description:
        "Explore what experiences are revealed inside yourself in the present moment and relate those authentically to your co-explorer.",
      imageUrl: nadine,
    },
    {
      title: "Assert & Protect",
      description:
        "Practice how to assert and protect your boundaries in a safe space.",
      imageUrl: gabor,
      descriptionVideo:
        "https://cdn.coverr.co/videos/coverr-woman-walking-on-beach-4215/1080p.mp4",
    },
    {
      title: "Gratitude Practice",
      description:
        "Increase your awareness of the positive aspects of your life and cultivate a sense of gratitude.",
      imageUrl: tony,
    },
    {
      title: "Kirtan",
      description:
        "Engage in guided call-and-response chanting of sacred names to harmonize breath, voice, and intention.",
      imageUrl: dileva,
    },
    {
      title: "Non-Contact Improv",
      description:
        "Reflect each other’s bodily directional impulses by mirroring small initiating movements and amplifying dynamic flow.",
      imageUrl: Profilbild,
    },
    {
      title: "Echo of True Self",
      description:
        "Speak your truth and experience the power of being heard and affirmed by another.",
      imageUrl: swan,
    },
    // Repeated for all practice cards
  ];

  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(
    null
  );
  const [showPopup, setShowPopup] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [chosenPractice, setChosenPractice] = useState<string>("");
  const [availableCalls, setAvailableCalls] = useState<CallData[]>([]);

  const handleCardClick = (index: number, practice: string) => {
    console.log("Card clicked, index: " + index);
    setExpandedCardIndex((prev) => (prev === index ? null : index));
    setChosenPractice(practice);
  };

  const handleClickOutsideCard = () => {
    console.log("Clicked outside card, minimizing all cards");
    setExpandedCardIndex(null);
  };

  useEffect(() => {
    console.log("showPopup:", showPopup);
  }, []);

  /*  const cardRef = useRef<PracticeCardHandle>(null);
 const handleClickOutsideCard = () => {
    cardRef.current?.minimizeCard();
  };
*/
  return (
    <>
      <div className="practices-container" onClick={handleClickOutsideCard}>
        <div className="shape-1" />
        <div className="shape-2" />
        <div className="shape-3" />
        <div className="shape-4" />
        <div className="shape-5" />
        <div className="practices-content">
          <FilterHeader />
          <ListGroup className="practices-list">
            {practices.map((practice, index) => (
              <PracticeCard
                key={index}
                isExpanded={expandedCardIndex === index}
                onClick={() => handleCardClick(index, practice.title)}
                title={practice.title}
                description={practice.description}
                imageUrl={practice.imageUrl}
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
                setShowCallModal={setShowCallModal}
                setRemoteDescAddedForOfferer={setRemoteDescAddedForOfferer}
                setAvailableCalls={setAvailableCalls}
              />
            ))}
          </ListGroup>
        </div>
        {showPopup && (
          <CallHandlerPopUp
            setShowPopup={setShowPopup}
            availableCalls={availableCalls}
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
            practice={chosenPractice} // Pass the chosen practice to the popup
          />
        )}
        <CallModal
          isOpen={showCallModal}
          onClose={() => setShowCallModal(false)}
          practice={chosenPractice}
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
          setShowCallModal={setShowCallModal}
          setRemoteDescAddedForOfferer={setRemoteDescAddedForOfferer}
          setAvailableCalls={setAvailableCalls}
        />
      </div>
      <NavigationBar />
    </>
  );
};
