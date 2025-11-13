import React from "react";
import { CallStatus } from "../../../App";
import {
  WebRtcManager,
  WebRtcManagerNewHandle,
} from "../../WebRtcManager/WebRtcManager";
import { CallData } from "../../Dashboard";
import { ScheduleCallSection } from "./ScheduleCallSection";
import { Booking } from "../../../types/booking";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  practice: string;
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
  remoteFeedEl: React.RefObject<HTMLVideoElement | null>;
  localFeedEl: React.RefObject<HTMLVideoElement | null>;
  gatheredAnswerIceCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
  setIceCandidatesReadyTrigger: React.Dispatch<React.SetStateAction<number>>;
  remoteDescAddedForOfferer: boolean;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCallModal: React.Dispatch<React.SetStateAction<boolean>>;
  setRemoteDescAddedForOfferer: React.Dispatch<React.SetStateAction<boolean>>;
  setAvailableCalls: React.Dispatch<React.SetStateAction<CallData[]>>;
  currentBooking: Booking | undefined;
  setCurrentBooking: React.Dispatch<React.SetStateAction<Booking | undefined>>;
  // Bookings props from useBookings hook
  selectedBookings: Booking[];
  allBookings: Booking[];
  myBookings: Booking[];
  loading: boolean;
  error: string | null;
  loadBookingsForDate: (startDate: Date | null) => Promise<void>;
  loadAllFreeBookings: () => Promise<void>;
  loadMyBookings: () => Promise<void>;
  setSelectedBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setAllBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setMyBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
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
  currentBooking,
  setCurrentBooking,
  selectedBookings,
  allBookings,
  myBookings,
  loading,
  error,
  loadBookingsForDate,
  loadAllFreeBookings,
  loadMyBookings,
  setSelectedBookings,
  setAllBookings,
  setMyBookings,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="call-modal-overlay" onClick={handleOverlayClick}>
      <div className="call-modal-content">
        <div className="call-modal-header">
          <h2 className="call-modal-title">{practice} - Call Options</h2>
          <button className="call-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="call-modal-body">
          <ScheduleCallSection
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
            currentBooking={currentBooking}
            setCurrentBooking={setCurrentBooking}
            selectedBookings={selectedBookings}
            allBookings={allBookings}
            myBookings={myBookings}
            loading={loading}
            error={error}
            loadBookingsForDate={loadBookingsForDate}
            loadAllFreeBookings={loadAllFreeBookings}
            loadMyBookings={loadMyBookings}
            setSelectedBookings={setSelectedBookings}
            setAllBookings={setAllBookings}
            setMyBookings={setMyBookings}
          />
        </div>
      </div>
    </div>
  );
};
