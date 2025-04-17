import { RefObject, useEffect, useState } from "react";
import "./VideoPage.css";
import { useNavigate } from "react-router-dom";
import socketConnection from "../webrtcUtilities/socketConnection";
import ActionButtons from "./ActionButtons/ActionButtons";
import VideoMessageBox from "./VideoMessageBox";
import { CallStatus } from "../../App";

interface CallerVideoProps {
  callStatus: CallStatus | undefined;
  updateCallStatus: React.Dispatch<
    React.SetStateAction<CallStatus | undefined>
  >;
  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  peerConnection: RTCPeerConnection | undefined;
  userName: string | null;
  localFeedEl: RefObject<HTMLVideoElement | null>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
}

const CallerVideo = ({
  remoteStream,
  localStream,
  peerConnection,
  callStatus,
  updateCallStatus,
  userName,
  remoteFeedEl,
  localFeedEl,
}: CallerVideoProps) => {
  const navigate = useNavigate();
  const [videoMessage, setVideoMessage] = useState(
    "Please enable video to start!"
  );
  const [offerCreated, setOfferCreated] = useState(false);

  //send back to home if no localStream
  useEffect(() => {
    console.log("CallerVideo useEffect: localStream: " + localStream);
    console.log("CallerVideo useEffect: remoteStream: " + remoteStream);
    if (!localStream) {
      navigate(`/`);
    } else {
      //set video tags
      if (remoteFeedEl.current && remoteStream) {
        remoteFeedEl.current.srcObject = remoteStream;
      }

      if (localFeedEl.current && localStream) {
        localFeedEl.current.srcObject = localStream;
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
    console.log("CallerVideo useEffect: peerConnection: " + peerConnection);
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

  //once the user has shared video, start WebRTC'ing :)
  useEffect(() => {
    const shareVideoAsync = async () => {
      /* if (!peerConnection) {
        console.error("Peer connection is undefined!");
        return;
      }*/
      const offer = await peerConnection?.createOffer();
      peerConnection?.setLocalDescription(offer);
      //we can now start collecing ice candidates!
      // we need to emit the offer to the server
      const socket = socketConnection(userName);
      socket.emit("newOffer", offer);
      setOfferCreated(true); //so that our useEffect doesn't make an offer again
      setVideoMessage("Awaiting answer..."); //update our videoMessage box
      console.log(
        "created offer, setLocalDesc, emitted offer, updated videoMessage"
      );
    };
    if (!offerCreated && callStatus?.videoEnabled) {
      //CREATE AN OFFER!!
      console.log("We have video and no offer... making offer");
      shareVideoAsync();
    }
  }, [callStatus?.videoEnabled, offerCreated]);

  useEffect(() => {
    console.log("CallerVideo useEffect: callStatus: " + callStatus);
    const addAnswerAsync = async () => {
      if (callStatus?.answer === undefined) {
        console.error("Answer is undefined!");
        return;
      }
      await peerConnection?.setRemoteDescription(callStatus.answer);
      console.log("Answer added!!");
    };
    if (callStatus?.answer) {
      addAnswerAsync();
    }
  }, [callStatus]);

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
        updateCallStatus={updateCallStatus}
        peerConnection={peerConnection}
      />
    </div>
  );
};

export default CallerVideo;
