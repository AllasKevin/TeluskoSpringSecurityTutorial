import { RefObject, useEffect, useState } from "react";
import "./VideoPage.css";
//import { useNavigate } from "react-router-dom";
import socketConnection from "../webrtcUtilities/socketConnection";
import ActionButtons from "./ActionButtons/ActionButtons";
import VideoMessageBox from "./VideoMessageBox";
import { CallStatus } from "../../App";
import { CallData } from "../../components/Dashboard";

interface AnswerVideoProps {
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
  localFeedEl: RefObject<HTMLVideoElement | null>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
  offerData: CallData | undefined;
  hangupCall: () => void;
}
const AnswerVideo = ({
  remoteStream,
  setRemoteStream,
  localStream,
  setLocalStream,
  peerConnection,
  setPeerConnection,
  callStatus,
  updateCallStatus,
  offerData,
  remoteFeedEl,
  localFeedEl,
  hangupCall,
}: AnswerVideoProps) => {
  //const navigate = useNavigate();
  const [videoMessage, setVideoMessage] = useState(
    "Please enable video to start!"
  );
  const [answerCreated] = useState(false); // TODO: This is never changed and therefore it should be possible to remove it
  const username = sessionStorage.getItem("username");

  // Clean on route/component change
  useEffect(() => {
    return () => hangupCall();
  }, []);

  // Clean on browser unload
  useEffect(() => {
    const handleUnload = () => hangupCall();
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  /*
  // end the call
  useEffect(() => {
    if (callStatus?.current === "complete") {
      console.log("notify hangUp to: " + offerData?.offererUserName);
      socketConnection(username).emit("notify", {
        receiver: offerData?.offererUserName,
        message: "hangUp",
      });
      //navigate(`/`)
    }
  }, [callStatus]);
*/

  // Step 3: Set the local stream to the local video element
  //send back to home if no localStream
  useEffect(() => {
    if (!localStream) {
      //navigate(`/`);
    } else {
      //set video tags
      if (remoteFeedEl.current && remoteStream) {
        remoteFeedEl.current.srcObject = remoteStream;
      }

      if (localFeedEl.current && localStream) {
        console.log("Step 3: Set the local stream to the local video element");
        const localStreamCopy = new MediaStream(localStream.getVideoTracks());
        localFeedEl.current.srcObject = localStreamCopy;
      }
    }
  }, []);

  //set video tags
  // useEffect(()=>{
  //     remoteFeedEl.current.srcObject = remoteStream
  //     localFeedEl.current.srcObject = localStream
  // },[])

  //if we have tracks, disable the video message
  useEffect(() => {
    if (peerConnection) {
      peerConnection.ontrack = (e) => {
        if (e?.streams?.length) {
          setVideoMessage("");
        } else {
          setVideoMessage("Disconnected...");
        }
      };
    }
  }, [peerConnection]);

  // Step 4 and 5: Recieved and adding offer from caller and handling it and sending back answer and ICE candidates
  //User has enabled video, but not made answer
  useEffect(() => {
    const addOfferAndCreateAnswerAsync = async () => {
      if (!peerConnection) {
        console.log("No peerConnection, returning...");
        return;
      } else if (!offerData) {
        console.log("No offerData, returning...");
        return;
      }

      // Step 4: adding the offer from caller
      await peerConnection.setRemoteDescription(offerData.offer);
      console.log("Step 4: Recieved and adding offer from caller");

      // Step 5: creating answer and sending it back to caller
      //now that we have the offer set, make our answer
      // when calling createAnswer, 'icecandidate' event in createPeerConnection is triggered
      const answer = await peerConnection.createAnswer();
      peerConnection.setLocalDescription(answer);
      console.log("Step 5: creating answer and sending it back to caller");

      const copyOfferData = { ...offerData };
      copyOfferData.answer = answer;
      copyOfferData.answererUserName = username;
      const socket = socketConnection(username);
      const offerIceCandidates = await socket.emitWithAck(
        "newAnswer",
        copyOfferData
      );
      // use the ICE candidates from the offerer
      offerIceCandidates.forEach((c: RTCIceCandidateInit) => {
        peerConnection.addIceCandidate(c);
      });
    };

    if (!answerCreated && callStatus?.videoEnabled) {
      addOfferAndCreateAnswerAsync();
    }
  }, [callStatus?.videoEnabled, answerCreated]);

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

export default AnswerVideo;
