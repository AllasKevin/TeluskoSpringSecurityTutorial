import React, { RefObject, useEffect, useState } from "react";
import "./VideoPage.css";
//import { useNavigate } from "react-router-dom";
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
  localFeedEl: RefObject<HTMLVideoElement | null>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
  gatheredAnswerIceCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
  iceCandidatesReadyTrigger: number;
  remoteDescAddedForOfferer: boolean;
  setRemoteDescAddedForOfferer: React.Dispatch<React.SetStateAction<boolean>>;
}

const CallerVideo = ({
  remoteStream,
  localStream,
  peerConnection,
  callStatus,
  updateCallStatus,
  remoteFeedEl,
  localFeedEl,
  gatheredAnswerIceCandidatesRef,
  iceCandidatesReadyTrigger,
  remoteDescAddedForOfferer,
  setRemoteDescAddedForOfferer,
}: CallerVideoProps) => {
  console.log("CallerVideoComponent rendered");
  console.log(peerConnection);
  //const navigate = useNavigate();
  const [videoMessage, setVideoMessage] = useState(
    "Please enable video to start!"
  );
  const [offerCreated, setOfferCreated] = useState(false);
  const username = sessionStorage.getItem("username");
  //send back to home if no localStream
  useEffect(() => {
    console.log("CallerVideo useEffect: localStream: " + localStream);
    console.log("CallerVideo useEffect: remoteStream: " + remoteStream);
    if (!localStream) {
      //navigate(`/`);
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
      console.log("CREATE OFFER!");
      console.log(peerConnection);
      const offer = await peerConnection?.createOffer();
      console.log("CREATED OFFER!");
      console.log(peerConnection);

      console.log("OFFER!");

      console.log(offer);
      peerConnection?.setLocalDescription(offer);
      console.log("SET LOCAL DESCRIPTION!");
      console.log(peerConnection);
      console.log("username: " + username);
      //we can now start collecing ice candidates!
      // we need to emit the offer to the server
      const socket = socketConnection(username);
      console.log(socket);
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
      console.log(callStatus);
      console.log(peerConnection);
      console.log(peerConnection?.signalingState); //have remote-offer
      setRemoteDescAddedForOfferer(true);
    };
    if (callStatus?.answer) {
      addAnswerAsync();
    }
  }, [callStatus]);

  useEffect(() => {
    if (remoteDescAddedForOfferer) {
      console.log("ice Candidate ready");

      gatheredAnswerIceCandidatesRef.current.forEach((iceCandidate) => {
        console.log(
          "Adding ice candidate from answerer in separate useEffect..."
        );
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
        updateCallStatus={updateCallStatus}
        peerConnection={peerConnection}
      />
    </div>
  );
};

export default CallerVideo;
