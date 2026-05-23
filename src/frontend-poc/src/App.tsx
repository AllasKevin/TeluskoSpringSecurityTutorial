import { useState, useRef, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard, { CallData } from "./components/Dashboard";
import CallerVideo from "./webrtc/Components/CallerVideo";
import AnswerVideo from "./webrtc/Components/AnswerVideo";
import { useCallManager } from "./webrtc/hooks/useCallManager";
import { LoginPage } from "./components/LoginPage";
import LandingPage from "./components/LandingPage/LandingPage";
import { RegisterPage } from "./components/RegisterPage";
import { PracticesPage } from "./components/PracticesPage";
import BookingReminder, {
  BookingReminderNewHandle,
} from "./components/BookingReminder";
import { Booking } from "./types/booking";
import { InviteCodesPage } from "./components/InviteCodesPage/InviteCodesPage";
import { PracticeAppLayout } from "./components/PracticeAppLayout";
import { PracticeDetailPage } from "./components/PracticePages/PracticeDetailPage";
import { PracticeJoinPage } from "./components/PracticePages/PracticeJoinPage";
import { PracticeSchedulePage } from "./components/PracticePages/PracticeSchedulePage";
import { MyBookingsPage } from "./components/PracticePages/MyBookingsPage";
import { HomeInspirationPage } from "./components/PracticePages/HomeInspirationPage";
import { UserProgressPage } from "./components/PracticePages/UserProgressPage";

export interface CallStatus {
  haveMedia: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
  callInitiated: boolean;
  current?: string;
  answer?: RTCSessionDescriptionInit;
  myRole?: "offer" | "answer";
  otherCallerUserName?: string | null | undefined;
}

const practiceAppLayoutProps = (
  callStatus: CallStatus | undefined,
  updateCallStatus: React.Dispatch<
    React.SetStateAction<CallStatus | undefined>
  >,
  localStream: MediaStream | undefined,
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>,
  remoteStream: MediaStream | undefined,
  setRemoteStream: React.Dispatch<
    React.SetStateAction<MediaStream | undefined>
  >,
  peerConnection: RTCPeerConnection | undefined,
  setPeerConnection: React.Dispatch<
    React.SetStateAction<RTCPeerConnection | undefined>
  >,
  offerData: CallData | undefined,
  setOfferData: React.Dispatch<React.SetStateAction<CallData | undefined>>,
  remoteFeedEl: React.RefObject<HTMLVideoElement | null>,
  localFeedEl: React.RefObject<HTMLVideoElement | null>,
  gatheredAnswerIceCandidatesRef: React.RefObject<RTCIceCandidateInit[]>,
  setIceCandidatesReadyTrigger: React.Dispatch<React.SetStateAction<number>>,
  remoteDescAddedForOfferer: boolean,
  setRemoteDescAddedForOfferer: React.Dispatch<React.SetStateAction<boolean>>,
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>,
  showPopup: boolean,
  setChosenPractice: React.Dispatch<React.SetStateAction<string>>,
  chosenPractice: string,
  setCurrentBooking: React.Dispatch<React.SetStateAction<Booking | undefined>>,
  currentBooking: Booking | undefined,
  bookingReminderRef: React.RefObject<BookingReminderNewHandle | null>,
  currentlyOnlineUsers: number,
  setCurrentlyOnlineUsers: React.Dispatch<React.SetStateAction<number>>
) => ({
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
});

function App() {
  const [callStatus, updateCallStatus] = useState<CallStatus>();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();
  const [offerData, setOfferData] = useState<CallData>();
  const remoteFeedEl = useRef<HTMLVideoElement>(null);
  const localFeedEl = useRef<HTMLVideoElement>(null);
  const gatheredAnswerIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const [iceCandidatesReadyTrigger, setIceCandidatesReadyTrigger] = useState(0);
  const [remoteDescAddedForOfferer, setRemoteDescAddedForOfferer] =
    useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [chosenPractice, setChosenPractice] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking>();
  const [currentlyOnlineUsers, setCurrentlyOnlineUsers] = useState(0);

  const { hangupCall } = useCallManager({
    peerConnection,
    setPeerConnection,
    callStatus,
    updateCallStatus,
    localFeedEl,
    remoteFeedEl,
    localStream,
    setLocalStream,
    remoteStream,
    setRemoteStream,
    offerData,
  });
  const BookingReminderRef = useRef<BookingReminderNewHandle>(null);

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    setCurrentUsername(username);
  }, []);

  const layoutProps = practiceAppLayoutProps(
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
    BookingReminderRef,
    currentlyOnlineUsers,
    setCurrentlyOnlineUsers
  );

  return (
    <div>
      <BookingReminder
        ref={BookingReminderRef}
        currentUsername={currentUsername}
        setShowPopup={setShowPopup}
        setChosenPractice={setChosenPractice}
        setCurrentBooking={setCurrentBooking}
        currentBooking={currentBooking}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/registerpage" element={<RegisterPage />} />
        <Route
          path="/askingpractice"
          element={<Navigate to="/app/practice/askingpractice" replace />}
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <PracticeAppLayout {...layoutProps} />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeInspirationPage />} />
          <Route
            path="home-inspiration"
            element={<Navigate to="/app" replace />}
          />
          <Route path="discover" element={<PracticesPage />} />
          <Route path="practice/:practiceSlug" element={<PracticeDetailPage />} />
          <Route path="practice/:practiceSlug/join" element={<PracticeJoinPage />} />
          <Route
            path="practice/:practiceSlug/schedule"
            element={<PracticeSchedulePage />}
          />
          <Route path="my-bookings" element={<MyBookingsPage />} />
          <Route path="user-progress" element={<UserProgressPage />} />
        </Route>
        <Route path="/practices" element={<Navigate to="/app/discover" replace />} />
        <Route
          path="/invitecodes"
          element={
            <ProtectedRoute>
              <InviteCodesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard
                callStatus={callStatus}
                updateCallStatus={updateCallStatus}
                setLocalStream={setLocalStream}
                remoteStream={remoteStream}
                setRemoteStream={setRemoteStream}
                peerConnection={peerConnection}
                setPeerConnection={setPeerConnection}
                setOfferData={setOfferData}
                remoteFeedEl={remoteFeedEl}
                localFeedEl={localFeedEl}
                gatheredAnswerIceCandidatesRef={gatheredAnswerIceCandidatesRef}
                setIceCandidatesReadyTrigger={setIceCandidatesReadyTrigger}
                remoteDescAddedForOfferer={remoteDescAddedForOfferer}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offer"
          element={
            <ProtectedRoute>
              <CallerVideo
                callStatus={callStatus}
                updateCallStatus={updateCallStatus}
                localStream={localStream}
                setLocalStream={setLocalStream}
                remoteStream={remoteStream}
                setRemoteStream={setRemoteStream}
                peerConnection={peerConnection}
                setPeerConnection={setPeerConnection}
                remoteFeedEl={remoteFeedEl}
                localFeedEl={localFeedEl}
                offerData={offerData}
                gatheredAnswerIceCandidatesRef={gatheredAnswerIceCandidatesRef}
                iceCandidatesReadyTrigger={iceCandidatesReadyTrigger}
                remoteDescAddedForOfferer={remoteDescAddedForOfferer}
                setRemoteDescAddedForOfferer={setRemoteDescAddedForOfferer}
                hangupCall={hangupCall}
                chosenPractice={chosenPractice}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/answer"
          element={
            <ProtectedRoute>
              <AnswerVideo
                callStatus={callStatus}
                updateCallStatus={updateCallStatus}
                localStream={localStream}
                setLocalStream={setLocalStream}
                remoteStream={remoteStream}
                setRemoteStream={setRemoteStream}
                peerConnection={peerConnection}
                setPeerConnection={setPeerConnection}
                offerData={offerData}
                remoteFeedEl={remoteFeedEl}
                localFeedEl={localFeedEl}
                hangupCall={hangupCall}
                chosenPractice={chosenPractice}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
export default App;
