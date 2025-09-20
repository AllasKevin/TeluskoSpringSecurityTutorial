import React, { RefObject, useEffect, useState } from "react";
import "./VideoPage.css";
//import { useNavigate } from "react-router-dom";
import { CallStatus } from "../../App";
import { CallData } from "../../components/Dashboard";
import ActionButtons from "./ActionButtons/ActionButtons";
import VideoMessageBox from "./VideoMessageBox";
import {
  addAnswer,
  addIceCandidatesAfterAnswerBeenSet,
  createOffer,
  setStreamsLocally,
  WebRtcManager,
} from "../../components/WebRtcManager/WebRtcManager";
import { ca } from "date-fns/locale";

interface CallerVideoProps {
  callStatus: CallStatus | undefined;
  updateCallStatus: React.Dispatch<
    React.SetStateAction<CallStatus | undefined>
  >;
  localStream: MediaStream | undefined;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  setRemoteStream: React.Dispatch<
    React.SetStateAction<MediaStream | undefined>
  >;
  remoteStream: MediaStream | undefined;
  peerConnection: RTCPeerConnection | undefined;
  setPeerConnection: React.Dispatch<
    React.SetStateAction<RTCPeerConnection | undefined>
  >;
  localFeedEl: RefObject<HTMLVideoElement | null>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
  offerData: CallData | undefined;
  gatheredAnswerIceCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
  iceCandidatesReadyTrigger: number;
  remoteDescAddedForOfferer: boolean;
  setRemoteDescAddedForOfferer: React.Dispatch<React.SetStateAction<boolean>>;
  hangupCall: (callStatus: CallStatus | undefined) => void;
}

const CallerVideo = ({
  remoteStream,
  setRemoteStream,
  localStream,
  setLocalStream,
  peerConnection,
  setPeerConnection,
  callStatus,
  updateCallStatus,
  remoteFeedEl,
  localFeedEl,
  gatheredAnswerIceCandidatesRef,
  iceCandidatesReadyTrigger,
  remoteDescAddedForOfferer,
  setRemoteDescAddedForOfferer,
  hangupCall,
}: CallerVideoProps) => {
  //const navigate = useNavigate();
  const [videoMessage, setVideoMessage] = useState(
    "Please enable video to start!"
  );
  const username = sessionStorage.getItem("username");

  console.log("CallerVideo component mounted, peerConnection:", peerConnection);
  console.log(peerConnection?.ontrack);

  console.log("CallerVideo component mounted, callstatus:", callStatus);
  // Clean on route/component change
  useEffect(() => {
    console.log("Before calling hangupCall in CallerVideo");
    console.log(callStatus);
    return () => hangupCall(callStatus);
  }, []);

  // Step 5: Set the local stream to the local video element
  //send back to home if no localStream
  useEffect(() => {
    if (localStream && localFeedEl?.current) {
      console.log("Calling setStreamsLocally...");
      setStreamsLocally(localStream, localFeedEl, remoteFeedEl, remoteStream);
    }
  }, [localStream, remoteStream, localFeedEl, remoteFeedEl]);

  // Clean on browser unload
  useEffect(() => {
    console.log("Cleaning up on browser unload, callstatus:", callStatus);
    console.log(callStatus);

    const handleUnload = () => hangupCall(callStatus);
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  /*
  // end the call
  useEffect(() => {
    if (callStatus?.current === "complete") {
      console.log("notify hangUp to: " + offerData?.answererUserName);
      socketConnection(username).emit("notify", {
        receiver: offerData?.answererUserName,
        message: "hangUp",
      });
      //navigate(`/`)
    }
  }, [callStatus]);
*/

  //set video tags
  // useEffect(()=>{
  //     remoteFeedEl.current.srcObject = remoteStream
  //     localFeedEl.current.srcObject = localStream
  // },[])

  //if we have tracks, disable the video message
  useEffect(() => {
    console.log("Before setting video message.");
    if (peerConnection) {
      console.log("Actually setting video message.");

      peerConnection.ontrack = (e) => {
        if (e?.streams?.length) {
          setVideoMessage("");
        } else {
          setVideoMessage("Disconnected...");
        }
      };
    }
  }, [peerConnection]);
  /*
  // Step 4: Create an offer
  //once the user has started this component, start WebRTC'ing :)
  createOffer(
    peerConnection,
    username,
    offerCreated,
    callStatus,
    updateCallStatus,
    setOfferCreated,
    setVideoMessage,
    localStream
  );
*/

  /*
  // Step 5: Set the remote description (answer)
  useEffect(() => {
    addAnswer(callStatus, peerConnection, setRemoteDescAddedForOfferer);
  }, [callStatus]);
*/
  // Step 6: Add ICE candidates That are received after the answer is set
  useEffect(() => {
    addIceCandidatesAfterAnswerBeenSet(
      gatheredAnswerIceCandidatesRef,
      peerConnection,
      remoteDescAddedForOfferer
    );
  }, [iceCandidatesReadyTrigger, remoteDescAddedForOfferer]);

  return (
    <div>
      <div className="videos">
        <VideoMessageBox message={videoMessage} />
        <video
          id="local-feed"
          ref={localFeedEl}
          autoPlay
          controls
          playsInline
        ></video>
        <video
          id="remote-feed"
          ref={remoteFeedEl}
          autoPlay
          controls
          playsInline
        ></video>
      </div>
      <ActionButtons
        localFeedEl={localFeedEl}
        remoteFeedEl={remoteFeedEl}
        callStatus={callStatus}
        localStream={localStream}
        setLocalStream={setLocalStream}
        remoteStream={remoteStream}
        setRemoteStream={setRemoteStream}
        updateCallStatus={updateCallStatus}
        peerConnection={peerConnection}
        setPeerConnection={setPeerConnection}
      />
    </div>
  );
};

export default CallerVideo;
