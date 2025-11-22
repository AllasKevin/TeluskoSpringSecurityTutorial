import React, { RefObject, useEffect, useRef, useState } from "react";
import { PracticeCard, PracticeCardHandle } from "./components/PracticeCard";
import { FilterHeader } from "./components/FilterHeader";
import { NavigationBar } from "./components/NavigationBar";
import "./PracticesPage.css";
import { practices } from "../../../../shared/practices/practices";

import { ListGroup } from "react-bootstrap";
import { CallStatus } from "../../App";
import { CallHandlerPopUp } from "./components/CallHandlerPopUp";
import { CallModal } from "./components/CallModal";
import { CallData } from "../Dashboard";
import { Booking } from "../../types/booking";
import {
  socketConnectionServerUpdates,
  disconnectSocket,
} from "../../webrtc/webrtcUtilities/socketConnectionServerUpdates";
import clientSocketForServerUpdatesListeners from "../../webrtc/webrtcUtilities/clientSocketForServerUpdatesListeners";
import { BookingReminderNewHandle } from "../BookingReminder";
import { useBookings } from "../../hooks/useBookings";
import { UsersOnlineCounter } from "./components/UsersOnlineCounter/UsersOnlineCounter";

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
  bookingReminderRef: RefObject<BookingReminderNewHandle | null>;
  currentlyOnlineUsers: number;
  setCurrentlyOnlineUsers: React.Dispatch<React.SetStateAction<number>>;
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
  bookingReminderRef,
  currentlyOnlineUsers,
  setCurrentlyOnlineUsers,
}) => {
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(
    null
  );
  const [showCallModal, setShowCallModal] = useState(false);
  const [availableCalls, setAvailableCalls] = useState<CallData[]>([]);

  const {
    selectedBookings,
    availableBookings,
    myBookings,
    loading,
    error,
    loadBookingsForDate,
    loadAllFreeBookings,
    loadMyBookings,
    setSelectedBookings,
    setAvailableBookings,
    setMyBookings,
    allBookings,
  } = useBookings();
  // TODO myBookingsRef används inte just nu. Ta bort vid tillfälle
  const myBookingsRef = useRef<Booking[]>(myBookings);

  useEffect(() => {
    console.log(
      "myBookings updated and setting myBookingsRef: " +
        JSON.stringify(myBookings)
    );
    myBookingsRef.current = myBookings;
  }, [myBookings]);

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
    const username = sessionStorage.getItem("username");

    const socket = socketConnectionServerUpdates(username);
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      clientSocketForServerUpdatesListeners(
        socket,
        bookingReminderRef,
        myBookingsRef,
        myBookings,
        setMyBookings,
        availableBookings,
        setAvailableBookings,
        setCurrentlyOnlineUsers
      );
    });

    loadMyBookings();

    return () => {
      console.log("PracticesPage-Component unmounted → disconnecting socket");
      disconnectSocket;
    };
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
            setChosenPractice={setChosenPractice}
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
          selectedBookings={selectedBookings}
          availableBookings={availableBookings}
          myBookings={myBookings}
          loading={loading}
          error={error}
          loadBookingsForDate={loadBookingsForDate}
          loadAllFreeBookings={loadAllFreeBookings}
          loadMyBookings={loadMyBookings}
          setSelectedBookings={setSelectedBookings}
          setAvailableBookings={setAvailableBookings}
          setMyBookings={setMyBookings}
          allBookings={allBookings}
        />
      </div>
      <UsersOnlineCounter currentlyOnlineUsers={currentlyOnlineUsers} />

      <NavigationBar />
    </>
  );
};
