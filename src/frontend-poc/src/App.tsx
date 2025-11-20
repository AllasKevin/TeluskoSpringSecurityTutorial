import { useState, useRef, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
//import LoginForm from "./components/LoginForm";
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

function App() {
  const [callStatus, updateCallStatus] = useState<CallStatus>();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();
  const [offerData, setOfferData] = useState<CallData>();
  const remoteFeedEl = useRef<HTMLVideoElement>(null); //this is a React ref to a dom element, so we can interact with it the React way
  const localFeedEl = useRef<HTMLVideoElement>(null); //this is a React ref to a dom element, so we can interact with it the React way
  //const [gatheredAnswerIceCandidates, setGatheredAnswerIceCandidates] = useState<RTCIceCandidateInit[]>([]);
  const gatheredAnswerIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const [iceCandidatesReadyTrigger, setIceCandidatesReadyTrigger] = useState(0);
  const [remoteDescAddedForOfferer, setRemoteDescAddedForOfferer] =
    useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [chosenPractice, setChosenPractice] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking>();

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

  // Get current username for booking reminders
  useEffect(() => {
    const username = sessionStorage.getItem("username");
    setCurrentUsername(username);
  }, []);

  return (
    <div>
      {/* Global booking reminder popup */}
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
          path="/practices"
          element={
            <ProtectedRoute>
              <PracticesPage
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
                setShowPopup={setShowPopup}
                showPopup={showPopup}
                setChosenPractice={setChosenPractice}
                chosenPractice={chosenPractice}
                setCurrentBooking={setCurrentBooking}
                currentBooking={currentBooking}
                bookingReminderRef={BookingReminderRef}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <PracticesPage
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
                setShowPopup={setShowPopup}
                showPopup={showPopup}
                setChosenPractice={setChosenPractice}
                chosenPractice={chosenPractice}
                setCurrentBooking={setCurrentBooking}
                currentBooking={currentBooking}
                bookingReminderRef={BookingReminderRef}
              />
            </ProtectedRoute>
          }
        />
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
                //                localStream={localStream}
                setLocalStream={setLocalStream}
                remoteStream={remoteStream}
                setRemoteStream={setRemoteStream}
                peerConnection={peerConnection}
                setPeerConnection={setPeerConnection}
                //                offerData={offerData}
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
