import { useState, useRef } from "react";
import { Route, Routes } from "react-router-dom";
//import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard, { CallData } from "./components/Dashboard";
import Header from "./components/Header";
import CallerVideo from "./webrtc/Components/CallerVideo";
import AnswerVideo from "./webrtc/Components/AnswerVideo";
import LoginForm from "./components/LoginForm";
import { useCallManager } from "./webrtc/hooks/useCallManager";
import { LoginTest } from "./scenes/LoginTest";

export interface CallStatus {
  haveMedia: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
  callInitiated: boolean;
  current?: string;
  answer?: RTCSessionDescriptionInit;
  myRole?: "offer" | "answer";
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

  const { hangupCall } = useCallManager({
    peerConnection,
    setPeerConnection,
    updateCallStatus,
    localFeedEl,
    remoteFeedEl,
    localStream,
    setLocalStream,
    remoteStream,
    setRemoteStream,
    offerData,
  });

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<LoginTest />} />
        <Route path="/loginpage" element={<LoginForm />} />
        <Route
          path="/app"
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
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
export default App;
