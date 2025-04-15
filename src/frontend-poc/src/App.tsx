import { useState, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
//import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard, { CallData } from "./components/Dashboard";
import Header from "./components/Header";
import CallerVideo from "./webrtc/Components/CallerVideo";
import AnswerVideo from "./webrtc/Components/AnswerVideo";

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
  const [userName, setUserName] = useState<string | null>(null);
  const [offerData, setOfferData] = useState<CallData>();
  const remoteFeedEl = useRef<HTMLVideoElement>(null); //this is a React ref to a dom element, so we can interact with it the React way
  const localFeedEl = useRef<HTMLVideoElement>(null); //this is a React ref to a dom element, so we can interact with it the React way
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/loginpage"
          element={
            <Dashboard
              callStatus={callStatus}
              updateCallStatus={updateCallStatus}
              //                localStream={localStream}
              setLocalStream={setLocalStream}
              remoteStream={remoteStream}
              setRemoteStream={setRemoteStream}
              peerConnection={peerConnection}
              setPeerConnection={setPeerConnection}
              userName={userName}
              setUserName={setUserName}
              //                offerData={offerData}
              setOfferData={setOfferData}
              remoteFeedEl={remoteFeedEl}
              localFeedEl={localFeedEl}
            />
          }
        />
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
                userName={userName}
                setUserName={setUserName}
                //                offerData={offerData}
                setOfferData={setOfferData}
                remoteFeedEl={remoteFeedEl}
                localFeedEl={localFeedEl}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offer"
          element={
            <CallerVideo
              callStatus={callStatus}
              updateCallStatus={updateCallStatus}
              localStream={localStream}
              remoteStream={remoteStream}
              peerConnection={peerConnection}
              userName={userName}
              remoteFeedEl={remoteFeedEl}
              localFeedEl={localFeedEl}
            />
          }
        />
        <Route
          path="/answer"
          element={
            <AnswerVideo
              callStatus={callStatus}
              updateCallStatus={updateCallStatus}
              localStream={localStream}
              remoteStream={remoteStream}
              peerConnection={peerConnection}
              userName={userName}
              offerData={offerData}
              remoteFeedEl={remoteFeedEl}
              localFeedEl={localFeedEl}
            />
          }
        />
      </Routes>
    </div>
  );
}
export default App;
