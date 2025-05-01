import React, { RefObject, useEffect, useState } from "react";
import "./VideoPage.css";
//import { useNavigate } from "react-router-dom";
import socketConnection from "../webrtcUtilities/socketConnection";
import ActionButtons from "./ActionButtons/ActionButtons";
import VideoMessageBox from "./VideoMessageBox";
import { CallStatus } from "../../App";
import { CallData } from "../../components/Dashboard";

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
  hangupCall: () => void;
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
  const [offerCreated, setOfferCreated] = useState(false);
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
      console.log("notify hangUp to: " + offerData?.answererUserName);
      socketConnection(username).emit("notify", {
        receiver: offerData?.answererUserName,
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
        // Setting local stream to only have video tracks
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

  // Step 4: Create an offer
  //once the user has shared video, start WebRTC'ing :)
  useEffect(() => {
    const shareVideoAsync = async () => {
      console.log("Step 4: Making offer");
      const offer = await peerConnection?.createOffer();
      peerConnection?.setLocalDescription(offer);

      //we can now start collecing ice candidates!
      // we need to emit the offer to the server
      const socket = socketConnection(username);
      socket.emit("newOffer", offer);
      setOfferCreated(true); //so that our useEffect doesn't make an offer again
      setVideoMessage("Awaiting answer..."); //update our videoMessage box
    };
    if (!offerCreated && callStatus?.videoEnabled) {
      shareVideoAsync();
    }
  }, [callStatus?.videoEnabled, offerCreated]);

  // Step 5: Set the remote description (answer)
  useEffect(() => {
    const addAnswerAsync = async () => {
      console.log("Step 5: Recieved and setting answer.");

      if (callStatus?.answer === undefined) {
        console.error("Answer is undefined!");
        return;
      }

      await peerConnection?.setRemoteDescription(callStatus.answer);
      setRemoteDescAddedForOfferer(true);
    };
    if (callStatus?.answer) {
      addAnswerAsync();
    }
  }, [callStatus]);

  // Step 6: Add ICE candidates That are received after the answer is set
  useEffect(() => {
    if (remoteDescAddedForOfferer) {
      console.log(
        "Step 6: Adding more Ice.C's. from answerer after the call is connected."
      );

      gatheredAnswerIceCandidatesRef.current.forEach((iceCandidate) => {
        peerConnection?.addIceCandidate(iceCandidate).catch((err) => {
          console.log("Chrome thinks there is an error. There isn't...");
          console.log(err);
        });
      });

      gatheredAnswerIceCandidatesRef.current = []; //clear the array
    }
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
