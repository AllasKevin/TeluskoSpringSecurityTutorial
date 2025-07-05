import {
  forwardRef,
  RefObject,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { CallStatus } from "../../App";
import createPeerConnection from "../../webrtc/webrtcUtilities/createPeerConn";
import prepForCall from "../../webrtc/webrtcUtilities/prepForCall";
import socketConnection from "../../webrtc/webrtcUtilities/socketConnection";
import { CallData } from "../Dashboard";
import { ca } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import clientSocketListeners from "../../webrtc/webrtcUtilities/clientSocketListeners";
import peerConfiguration from "../../webrtc/webrtcUtilities/stunServers";

export interface WebRtcManagerNewHandle {
  initCall: (typeOfCall: string) => void;
  checkMatch: (chosenPractice: string) => Promise<void>;
}

interface WebRtcManagerNewProps {
  callStatus: CallStatus | undefined;
  updateCallStatus: React.Dispatch<
    React.SetStateAction<CallStatus | undefined>
  >;
  //  localStream: MediaStream | undefined;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  remoteStream: MediaStream | undefined;
  setRemoteStream: React.Dispatch<
    React.SetStateAction<MediaStream | undefined>
  >;
  peerConnection: RTCPeerConnection | undefined;
  setPeerConnection: React.Dispatch<
    React.SetStateAction<RTCPeerConnection | undefined>
  >;
  //  offerData: any;
  setOfferData: React.Dispatch<React.SetStateAction<any>>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
  localFeedEl: RefObject<HTMLVideoElement | null>;
  gatheredAnswerIceCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
  setIceCandidatesReadyTrigger: React.Dispatch<React.SetStateAction<number>>;
  remoteDescAddedForOfferer: boolean;
}

export const WebRtcManager = forwardRef<
  WebRtcManagerNewHandle,
  WebRtcManagerNewProps
>(
  (
    {
      callStatus,
      updateCallStatus,
      setLocalStream,
      remoteStream,
      setRemoteStream,
      peerConnection,
      setPeerConnection,
      setOfferData,
      remoteFeedEl,
      localFeedEl,
      gatheredAnswerIceCandidatesRef,
      setIceCandidatesReadyTrigger,
      remoteDescAddedForOfferer,
    },
    ref
  ) => {
    const [foundMatch, setFoundMatch] = useState(false);
    const [callType, setCallType] = useState<String | undefined>(undefined);

    console.log(callStatus);
    const initListeningForCalls = (
      username: string | null,
      setAvailableCalls: (value: React.SetStateAction<never[]>) => void,
      chosenPractice: string
    ) => {
      console.log("Step 0: listening for available calls...");
      const setCalls = (data: []) => {
        setAvailableCalls(data);
      };
      const socket = socketConnection(username, chosenPractice);
      socket.on("availableOffers", setCalls);
      socket.on("newOfferAwaiting", setCalls);
    };

    const checkMatch = async (chosenPractice: string) => {
      console.log("checkMatch CALLED with chosenPractice:", chosenPractice);

      console.log(
        "CHANGED. Step 0.1: Check if there is a match in the queue for the specific practice " +
          chosenPractice
      );
      const foundMatch = await socketConnection(
        username,
        chosenPractice
      ).emitWithAck("checkMatch", {});

      if (foundMatch) {
        console.log(
          "Making answer. Found a match in the queue for " + chosenPractice
        );
        //setFoundMatch(true);
        //setCallType("answer");
        initCall("answer");
        availableCalls.map((callData: CallData) => {
          setOfferData(callData);
        });
      } else {
        console.log(
          "Making Offer. No match found in the queue for " + chosenPractice
        );
        //setCallType("offer");
        initCall("offer");
      }
    };

    const initCall = async (typeOfCall: string) => {
      console.log("Step 1: Initialize call and get GUM access");
      await prepForCall({ callStatus, updateCallStatus, setLocalStream });
      setTypeOfCall(typeOfCall); //offer or answer
    };

    const setupPeerConnection = (
      typeOfCall: string,
      username: string,
      setPeerConnection: (
        value: React.SetStateAction<RTCPeerConnection | undefined>
      ) => void,
      setRemoteStream: (
        value: React.SetStateAction<MediaStream | undefined>
      ) => void
    ) => {
      console.log(
        "Step 2: GUM access granted, now we can set up the peer connection"
      );
      // prepForCall has finished running and updated callStatus
      const result = createPeerConnection(username, typeOfCall);
      if (result) {
        setPeerConnection(result.peerConnection);
        setRemoteStream(result.remoteStream);
      }
    };

    const [typeOfCall, setTypeOfCall] = useState("");
    const [availableCalls, setAvailableCalls] = useState([]);
    const navigate = useNavigate();
    const username = sessionStorage.getItem("username");

    console.log("availableCalls: ", availableCalls);
    // Step 0: Listen for available calls
    useEffect(() => {
      console.log("Step 0: Listen for available calls");
      initListeningForCalls(username, setAvailableCalls, "Hej");
    }, []);

    // Step 2: GUM access granted, now we can set up the peer connection
    //We have media via GUM. setup the peerConnection w/listeners
    useEffect(() => {
      if (callStatus && username && callStatus.haveMedia && !peerConnection) {
        // prepForCall has finished running and updated callStatus
        setupPeerConnection(
          typeOfCall,
          username,
          setPeerConnection,
          setRemoteStream
        );
      }
    }, [callStatus?.haveMedia]);

    //We know which type of client this is and have PC.
    //Add socketlisteners
    useEffect(() => {
      if (typeOfCall && peerConnection) {
        console.log(
          "Step ?: Adding socket listeners for typeOfCall:",
          typeOfCall
        );
        const socket = socketConnection(username);
        clientSocketListeners(
          socket,
          typeOfCall,
          callStatus,
          updateCallStatus,
          peerConnection,
          remoteFeedEl,
          localFeedEl,
          gatheredAnswerIceCandidatesRef,
          setIceCandidatesReadyTrigger,
          remoteDescAddedForOfferer,
          setOfferData
        );
      }
    }, [typeOfCall, peerConnection]);

    //once remoteStream AND pc are ready, navigate
    useEffect(() => {
      if (remoteStream && peerConnection) {
        console.log("navigating to videocall page...");
        if (typeOfCall === "offer") {
          navigate("/offer", { replace: false });
        } else if (typeOfCall === "answer") {
          navigate("/answer", { replace: false });
        }
      }
    }, [remoteStream, peerConnection]);

    useImperativeHandle(ref, () => ({
      initCall,
      checkMatch,
    }));

    return null; // This component does not return any JSX, it is a utility manager
  }
);

export const setStreamsLocally = (
  localStream: MediaStream | undefined,
  localFeedEl: React.RefObject<HTMLVideoElement | null>,
  remoteFeedEl: React.RefObject<HTMLVideoElement | null>,
  remoteStream: MediaStream | undefined
) => {
  if (localFeedEl.current && localStream) {
    console.log("Step 3: Set the local stream to the local video element");
    //set video tags
    if (remoteFeedEl.current && remoteStream) {
      remoteFeedEl.current.srcObject = remoteStream;
    }
    // Setting local stream to only have video tracks
    const localStreamCopy = new MediaStream(localStream.getVideoTracks());
    localFeedEl.current.srcObject = localStreamCopy;
  }
};

export const createOffer = async (
  peerConnection: RTCPeerConnection | undefined,
  username: string | null,
  offerCreated: boolean,
  callStatus: CallStatus | undefined,
  updateCallStatus: React.Dispatch<
    React.SetStateAction<CallStatus | undefined>
  >,
  setOfferCreated: (value: React.SetStateAction<boolean>) => void,
  setVideoMessage: (value: React.SetStateAction<string>) => void,
  localStream: MediaStream | undefined
) => {
  console.log(
    "Trying to Step 4: Making offer  offerCreated: " +
      offerCreated +
      " callStatus?.videoEnabled: " +
      callStatus?.videoEnabled
  );

  if (!offerCreated && callStatus && peerConnection && localStream) {
    console.log("Init video! from createOffer");
    initVideo(peerConnection, callStatus, updateCallStatus, localStream);

    console.log("Step 4: Making offer");
    const offer = await peerConnection?.createOffer();
    peerConnection?.setLocalDescription(offer);

    //we can now start collecing ice candidates!
    // we need to emit the offer to the server
    const socket = socketConnection(username, "practiceOneOne");
    socket.emit("newOffer", offer);

    setOfferCreated(true); //so that our useEffect doesn't make an offer again
    setVideoMessage("Awaiting answer..."); //update our videoMessage box
  }
};

export const addAnswer = async (
  callStatus: CallStatus | undefined,
  peerConnection: RTCPeerConnection | undefined,
  setRemoteDescAddedForOfferer: (value: React.SetStateAction<boolean>) => void
) => {
  if (callStatus?.answer) {
    console.log("Step 5: Recieved and setting answer.");

    if (callStatus?.answer === undefined) {
      console.error("Answer is undefined!");
      return;
    }
    await peerConnection?.setRemoteDescription(callStatus.answer);

    setRemoteDescAddedForOfferer(true);
  }
};

export const addIceCandidatesAfterAnswerBeenSet = (
  gatheredAnswerIceCandidatesRef: React.RefObject<RTCIceCandidateInit[]>,
  peerConnection: RTCPeerConnection | undefined,
  remoteDescAddedForOfferer: boolean
) => {
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
};

/**
 * Adds the received offer and creates an answer if not already created.
 * @param peerConnection The RTCPeerConnection instance.
 * @param offerData The CallData containing the offer.
 * @param answerCreated Boolean indicating if the answer has been created.
 * @param callStatus The current CallStatus.
 */
export const addRecievedOfferAndCreateAnswerAsync = async (
  peerConnection: RTCPeerConnection | undefined,
  offerData: CallData | undefined,
  answerCreated: boolean,
  callStatus: CallStatus | undefined,
  updateCallStatus: React.Dispatch<
    React.SetStateAction<CallStatus | undefined>
  >,
  localStream: MediaStream | undefined
) => {
  if (!peerConnection) {
    console.log("No peerConnection, returning...");
    return;
  } else if (!offerData) {
    console.log("No offerData, returning...");
    return;
  } else if (!localStream) {
    console.log("No localstream, returning...");
    return;
  } else if (!answerCreated && callStatus) {
    console.log("Init video! from addRecievedOfferAndCreateAnswerAsync");
    initVideo(peerConnection, callStatus, updateCallStatus, localStream);

    const username = sessionStorage.getItem("username");

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
  }
};

const initVideo = (
  peerConnection: RTCPeerConnection,
  callStatus: CallStatus,
  updateCallStatus: React.Dispatch<
    React.SetStateAction<CallStatus | undefined>
  >,
  localStream: MediaStream
) => {
  console.log("Init video!");
  const copyCallStatus = callStatus;
  copyCallStatus.videoEnabled = true;
  copyCallStatus.callInitiated = true;
  updateCallStatus(copyCallStatus);
  // we are not adding tracks so they are visible
  // in the video tag. We are addign them
  // to the PC, so they can be sent
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });
};
