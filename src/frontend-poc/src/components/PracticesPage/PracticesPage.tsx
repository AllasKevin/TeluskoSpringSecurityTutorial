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
import lore from "../../assets/lore.jpg";
import swan from "../../assets/teal-swan.webp";
import { practices } from "../../../../shared/practices/practices";

import { ListGroup } from "react-bootstrap";
import { CallStatus } from "../../App";
import { CallHandlerPopUp } from "./components/CallHandlerPopUp";
import { CallModal } from "./components/CallModal";
import { CallData } from "../Dashboard";
import { Booking } from "../../types/booking";

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
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  showPopup: boolean;
  setChosenPractice: React.Dispatch<React.SetStateAction<string>>;
  chosenPractice: string;
  setCurrentBooking: React.Dispatch<React.SetStateAction<Booking | undefined>>;
  currentBooking: Booking | undefined;
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
  setShowPopup,
  showPopup,
  setChosenPractice,
  chosenPractice,
  setCurrentBooking,
  currentBooking,
}) => {
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(
    null
  );
  const [showCallModal, setShowCallModal] = useState(false);
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
                onClick={() => handleCardClick(index, practice.name)}
                practice={practice}
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
            practice={chosenPractice}
            currentBooking={currentBooking}
            setCurrentBooking={setCurrentBooking}
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
          currentBooking={currentBooking}
          setCurrentBooking={setCurrentBooking}
        />
      </div>
      <NavigationBar />
    </>
  );
};
