import { RefObject, useEffect, useState } from "react";
import "./VideoPage.css";
//import { useNavigate } from "react-router-dom";
import ActionButtons from "./ActionButtons/ActionButtons";
import VideoMessageBox from "./VideoMessageBox";
import { CallStatus } from "../../App";
import { CallData } from "../../components/Dashboard";
import {
  addRecievedOfferAndCreateAnswerAsync,
  setStreamsLocally,
} from "../../components/WebRtcManager/WebRtcManager";
import { ca } from "date-fns/locale";
import { usePracticeManager } from "../../hooks/usePracticeManager";
import { useNavigate } from "react-router-dom";
import { practiceConfigs } from "../../practices/practiceConfigs";

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
  hangupCall: (callStatus: CallStatus | undefined) => void;
  chosenPractice: string;
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
  chosenPractice,
}: AnswerVideoProps) => {
  type PracticeType = keyof typeof practiceConfigs;
  //const navigate = useNavigate();
  const [videoMessage, setVideoMessage] = useState(
    "Please enable video to start!"
  );
  const [answerCreated] = useState(false); // TODO: This is never changed and therefore it should be possible to remove it

  const navigate = useNavigate();
  const practiceType = chosenPractice as keyof typeof practiceConfigs;

  usePracticeManager(practiceConfigs[practiceType], () => {
    navigate("/app");
  });
  /*
  console.log("AnswerVideo component mounted offerData:", offerData);
  // Clean on route/component change
  useEffect(() => {
    console.log("Before calling hangupCall in AnswerVideo");
    console.log(callStatus);
    return () => hangupCall(callStatus);
  }, []);

  // Clean on browser unload
  useEffect(() => {
    console.log("Cleaning up on browser unload callStatus:", callStatus);
    console.log(callStatus);

    const handleUnload = () => hangupCall(callStatus);
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);
*/
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
  setStreamsLocally(localStream, localFeedEl, remoteFeedEl, remoteStream);

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
    addRecievedOfferAndCreateAnswerAsync(
      peerConnection,
      offerData,
      answerCreated,
      callStatus,
      updateCallStatus,
      localStream
    );
  }, []);

  return (
    <div>
      <div className="videos">
        <video id="local-feed" ref={localFeedEl} autoPlay playsInline></video>
        <video id="remote-feed" ref={remoteFeedEl} autoPlay playsInline></video>
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
