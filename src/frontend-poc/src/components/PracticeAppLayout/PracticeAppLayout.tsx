import React, { RefObject, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { CallHandlerPopUp } from "../PracticesPage/components/CallHandlerPopUp";
import { UsersOnlineCounter } from "../PracticesPage/components/UsersOnlineCounter";
import "../PracticesPage/PracticesPage.css";
import { CallStatus } from "../../App";
import { CallData } from "../Dashboard";
import { Booking } from "../../types/booking";
import {
  socketConnectionServerUpdates,
  disconnectSocket,
} from "../../webrtc/webrtcUtilities/socketConnectionServerUpdates";
import clientSocketForServerUpdatesListeners from "../../webrtc/webrtcUtilities/clientSocketForServerUpdatesListeners";
import { BookingReminderNewHandle } from "../BookingReminder";
import { useBookings } from "../../hooks/useBookings";
import { BottomNav } from "../BottomNav";
import { DesktopAppChrome } from "../DesktopAppChrome/DesktopAppChrome";
import type { PracticeAppOutletContext } from "../../types/practiceAppOutlet";
import { practices } from "../../../../shared/practices/practices";

export interface PracticeAppLayoutProps {
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

export const PracticeAppLayout: React.FC<PracticeAppLayoutProps> = ({
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

  const myBookingsRef = useRef<Booking[]>(myBookings);

  useEffect(() => {
    myBookingsRef.current = myBookings;
  }, [myBookings]);

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const socket = socketConnectionServerUpdates(username);
    socket.on("connect", () => {
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
      disconnectSocket();
    };
  }, []);

  const outletContext: PracticeAppOutletContext = {
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
    setChosenPractice,
    setCurrentBooking,
    currentBooking,
    bookingReminderRef,
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
    setAvailableCalls,
  };

  const handleDesktopStartPractice = () => {
    const slug = chosenPractice || practices[0]?.name || "askingpractice";
    setChosenPractice(slug);
    setShowPopup(true);
  };

  return (
    <>
      <DesktopAppChrome onStartPractice={handleDesktopStartPractice} />
      <div className="practice-app-shell">
        <Outlet context={outletContext} />
      </div>
      <BottomNav />
      <UsersOnlineCounter currentlyOnlineUsers={currentlyOnlineUsers} />
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
    </>
  );
};
