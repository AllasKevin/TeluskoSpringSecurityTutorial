import type { RefObject } from "react";
import type { CallStatus } from "../App";
import type { CallData } from "../components/Dashboard";
import type { Booking } from "./booking";
import type { BookingReminderNewHandle } from "../components/BookingReminder";

/** Props shared across /app/* routes (Outlet context). */
export interface PracticeAppOutletContext {
  callStatus: CallStatus | undefined;
  updateCallStatus: React.Dispatch<
    React.SetStateAction<CallStatus | undefined>
  >;
  localStream: MediaStream | undefined;
  setLocalStream: React.Dispatch<
    React.SetStateAction<MediaStream | undefined>
  >;
  remoteStream: MediaStream | undefined;
  setRemoteStream: React.Dispatch<
    React.SetStateAction<MediaStream | undefined>
  >;
  peerConnection: RTCPeerConnection | undefined;
  setPeerConnection: React.Dispatch<
    React.SetStateAction<RTCPeerConnection | undefined>
  >;
  offerData: CallData | undefined;
  setOfferData: React.Dispatch<React.SetStateAction<CallData | undefined>>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
  localFeedEl: RefObject<HTMLVideoElement | null>;
  gatheredAnswerIceCandidatesRef: RefObject<RTCIceCandidateInit[]>;
  setIceCandidatesReadyTrigger: React.Dispatch<React.SetStateAction<number>>;
  remoteDescAddedForOfferer: boolean;
  setRemoteDescAddedForOfferer: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenPractice: React.Dispatch<React.SetStateAction<string>>;
  setCurrentBooking: React.Dispatch<React.SetStateAction<Booking | undefined>>;
  currentBooking: Booking | undefined;
  bookingReminderRef: RefObject<BookingReminderNewHandle | null>;
  selectedBookings: Booking[];
  availableBookings: Booking[];
  myBookings: Booking[];
  loading: boolean;
  error: string | null;
  loadBookingsForDate: (startDate: Date | null) => Promise<void>;
  loadAllFreeBookings: () => Promise<void>;
  loadMyBookings: () => Promise<void>;
  setSelectedBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setAvailableBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setMyBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  allBookings: Booking[];
  setAvailableCalls: React.Dispatch<React.SetStateAction<CallData[]>>;
}
