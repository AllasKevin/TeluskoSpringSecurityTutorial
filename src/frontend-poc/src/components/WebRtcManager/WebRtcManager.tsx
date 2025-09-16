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
import {
  socketConnection,
  disconnectSocket,
} from "../../webrtc/webrtcUtilities/socketConnection";
import { CallData } from "../Dashboard";
import { ca } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import clientSocketListeners from "../../webrtc/webrtcUtilities/clientSocketListeners";
import peerConfiguration from "../../webrtc/webrtcUtilities/stunServers";
import clientSocketForMatchmakingListeners from "../../webrtc/webrtcUtilities/clientSocketForMatchmakingListeners";
import socketConnectionMatchmaking from "../../webrtc/webrtcUtilities/socketConnectionMatchmaking";
import { set } from "date-fns";

export interface WebRtcManagerNewHandle {
  initCall: (typeOfCall: string) => void;
  findMatch: (chosenPractice: string) => Promise<void>;
  acceptMatch: (
    chosenPractice: string,
    otherCallerUserName: string | null | undefined
  ) => void;
  startNewCall: (chosenPractice: string) => Promise<void>;
  joinCall: (
    chosenPractice: string,
    otherCallerUserName: string | null | undefined
  ) => void;
}

interface WebRtcManagerNewProps {
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
  offerData: CallData | undefined;
  setOfferData: React.Dispatch<React.SetStateAction<any>>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
  localFeedEl: RefObject<HTMLVideoElement | null>;
  gatheredAnswerIceCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
  setIceCandidatesReadyTrigger: React.Dispatch<React.SetStateAction<number>>;
  remoteDescAddedForOfferer: boolean;
  setRemoteDescAddedForOfferer: React.Dispatch<React.SetStateAction<boolean>>;
  setAvailableCalls: React.Dispatch<React.SetStateAction<CallData[]>>;
  setAvailableMatches: React.Dispatch<
    React.SetStateAction<
      {
        userName: string;
        practice: string;
      }[]
    >
  >;
  practice: string; // Optional prop to pass the practice name
}

export const WebRtcManager = forwardRef<
  WebRtcManagerNewHandle,
  WebRtcManagerNewProps
>(
  (
    {
      callStatus,
      updateCallStatus,
      localStream,
      setLocalStream,
      remoteStream,
      setRemoteStream,
      peerConnection,
      setPeerConnection,
      offerData,
      setOfferData,
      remoteFeedEl,
      localFeedEl,
      gatheredAnswerIceCandidatesRef,
      setIceCandidatesReadyTrigger,
      remoteDescAddedForOfferer,
      setRemoteDescAddedForOfferer,
      setAvailableCalls,
      setAvailableMatches,
      practice,
    },
    ref
  ) => {
    //const [foundMatch, setFoundMatch] = useState(false);
    const [callType, setCallType] = useState<String | undefined>(undefined);
    const [matchMutuallyAccepted, setMatchMutuallyAccepted] =
      useState<string>();

    const [
      step0InitListeningForMatchesExecuted,
      setStep0InitListeningForMatchesExecuted,
    ] = useState(false);

    const [
      step0InitListeningForCallsExecuted,
      setStep0InitListeningForCallsExecuted,
    ] = useState(false);
    console.log(callStatus);

    const [step1InitCallExecuted, setStep1InitCallExecuted] = useState(false);

    const [
      step2SetupPeerConnectionExecuted,
      setStep2SetupPeerConnectionExecuted,
    ] = useState(false);

    const [
      step3InitSocketListenersExecuted,
      setStep3InitSocketListenersExecuted,
    ] = useState(false);

    const [step4CreateOfferExecuted, setStep4CreateOfferExecuted] =
      useState(false);

    const [step5AnswerReceivedExecuted, setStep5AnswerReceivedExecuted] =
      useState(false);
    console.log(callStatus);

    const findMatch = async (chosenPractice: string) => {
      console.log("findMatch CALLED with chosenPractice:", chosenPractice);

      console.log(
        "CHANGED. Step 0.1: Check if there is a match in the queue for the specific practice " +
          chosenPractice
      );

      let foundMatch: {
        userName: any;
        chosenPractice: any;
      } | null = null;

      try {
        foundMatch = await socketConnectionMatchmaking(
          username,
          chosenPractice
        ).emitWithAck("findMatch", {});
      } catch (err) {
        console.log("Error finding match:", err);
      }

      if (foundMatch) {
        console.log(
          " Found a match " +
            foundMatch?.userName +
            "  in the queue for " +
            chosenPractice
        );

        console.log(
          "before setting availableMatches with foundMatch:",
          foundMatch
        );

        setAvailableMatches((prevMatches) => [
          ...prevMatches,
          { userName: foundMatch.userName, practice: chosenPractice },
        ]);
      } else {
        console.log(
          "No match found in the queue for " +
            chosenPractice +
            ". Waiting for a match..."
        );
      }
    };

    const startNewCall = async (chosenPractice: string) => {
      console.log("startNewCall CALLED with chosenPractice:", chosenPractice);

      console.log(
        "CHANGED. Step 0.1: startNewCall() practice: " + chosenPractice
      );

      console.log(
        "Making Offer. No match found in the queue for " + chosenPractice
      );
      initCall("offer");
    };

    const acceptMatch = async (
      chosenPractice: string,
      otherCallerUserName: string | null | undefined
    ) => {
      console.log("acceptMatch CALLED with chosenPractice:", chosenPractice);

      console.log(
        "CHANGED. Step 0.1: acceptMatch() practice: " +
          chosenPractice +
          " otherCallerUserName: " +
          otherCallerUserName
      );
      if (otherCallerUserName) {
        sessionStorage.setItem("otherCallerUserName", otherCallerUserName);
      }

      console.log("Emitting acceptMatch to the server without ack...");
      await socketConnectionMatchmaking(username, chosenPractice).emit(
        "acceptMatch",
        {}
      );
    };

    const joinCall = async (
      chosenPractice: string,
      otherCallerUserName: string | null | undefined
    ) => {
      console.log("joinCall CALLED with chosenPractice:", chosenPractice);

      if (otherCallerUserName) {
        console.log(
          "Making answer. Found a match " +
            otherCallerUserName +
            "  in the queue for " +
            chosenPractice
        );
        //setFoundMatch(true);
        //setCallType("answer");
        initCall("answer", otherCallerUserName);
        availableCallsFromServer.map((callData: CallData) => {
          setOfferData(callData);
        });
      }
    };

    const [typeOfCall, setTypeOfCall] = useState("");
    const [availableCallsFromServer, setAvailableCallsFromServer] = useState(
      []
    );
    const navigate = useNavigate();
    const username = sessionStorage.getItem("username");

    // Step 0: Listen for available matches
    useEffect(() => {
      initListeningForMatches(username, "Hej");
      initListeningForCalls(username, setAvailableCallsFromServer, practice);
    }, []);

    const initListeningForMatches = (
      username: string | null,
      chosenPractice: string
    ) => {
      console.log("Step 0: listening for available matches...");

      const socketMatchmaking = socketConnectionMatchmaking(
        username,
        chosenPractice
      );

      clientSocketForMatchmakingListeners(
        socketMatchmaking,
        matchMutuallyAccepted,
        setMatchMutuallyAccepted,
        setAvailableMatches,
        chosenPractice
      );
      setStep0InitListeningForMatchesExecuted(true);
    };

    const initListeningForCalls = (
      username: string | null,
      setAvailableCallsFromServer: (
        value: React.SetStateAction<never[]>
      ) => void,
      chosenPractice: string
    ) => {
      console.log("Step 0: listening for available calls...");
      const setCalls = (data: []) => {
        setAvailableCallsFromServer(data);
        setAvailableCalls(data);
      };
      const socket = socketConnection(username, chosenPractice);
      socket.on("availableOffers", setCalls);
      socket.on("newOfferAwaiting", setCalls);
      setStep0InitListeningForCallsExecuted(true);
    };

    // Step 1: initialize call after both have accepted the match
    useEffect(() => {
      console.log(
        "availableCallsFromServer or matchMutuallyAccepted has changed",
        matchMutuallyAccepted
      );
      if (matchMutuallyAccepted === "Offerer") {
        console.log("Offerer role given by matchMutuallyAccepted");
        //initCall("offer");
      } else if (
        matchMutuallyAccepted === "Answerer" &&
        availableCallsFromServer.length > 0
      ) {
        console.log("Answerer role given by matchMutuallyAccepted");
        availableCallsFromServer.map((callData: CallData) => {
          if (callData && callData.offererUserName) {
            console.log(
              "Calling initCall with answer for: ",
              callData.offererUserName
            );
            initCall("answer", callData?.offererUserName);
            setOfferData(callData);
          }
        });
      }
    }, [availableCallsFromServer, matchMutuallyAccepted]);

    const initCall = async (typeOfCall: string, foundMatch?: string) => {
      console.log("Step 1: Initialize call and get GUM access");
      await prepForCall({
        callStatus,
        updateCallStatus,
        setLocalStream,
        foundMatch,
      });
      setTypeOfCall(typeOfCall); //offer or answer
      setStep1InitCallExecuted(true);
    };

    // Step 2: GUM access granted, now we can set up the peer connection
    //We have media via GUM. setup the peerConnection w/listeners
    useEffect(() => {
      console.log("Step 2 (bEFORE): GUM access granted");
      if (step1InitCallExecuted && username) {
        // prepForCall has finished running and updated callStatus
        setupPeerConnection(
          typeOfCall,
          username,
          setPeerConnection,
          setRemoteStream
        );
        setStep2SetupPeerConnectionExecuted(true);
        setStep1InitCallExecuted(false);
      }
    }, [step1InitCallExecuted]);

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
        "Step 2: GUM access granted, now we can set up the peer connection with typeOfCall:",
        typeOfCall
      );
      // prepForCall has finished running and updated callStatus
      const result = createPeerConnection(username, typeOfCall);
      if (result) {
        setPeerConnection(result.peerConnection);
        setRemoteStream(result.remoteStream);
      }
    };

    const [clientSocketListenersInitiated, setClientSocketListenersInitiated] =
      useState(false);

    // Step 3: Adding socket listeners for typeOfCall
    // We know which type of client this is and have PC.
    // Add socketlisteners
    useEffect(() => {
      if (typeOfCall && peerConnection && step2SetupPeerConnectionExecuted) {
        console.log(
          "Step 3: Adding socket listeners for typeOfCall:",
          typeOfCall
        );
        /*const socketMatchmaking = socketConnectionMatchmaking(
          username,
          practice
        );*/
        const socket = socketConnection(username, practice);
        clientSocketListeners(
          step5AnswerReceivedExecuted,
          setStep5AnswerReceivedExecuted,
          socket,
          typeOfCall,
          setTypeOfCall,
          callStatus,
          updateCallStatus,
          peerConnection,
          setPeerConnection,
          remoteFeedEl,
          localFeedEl,
          gatheredAnswerIceCandidatesRef,
          setIceCandidatesReadyTrigger,
          remoteDescAddedForOfferer,
          setRemoteDescAddedForOfferer,
          setOfferData,
          setClientSocketListenersInitiated,
          setMatchMutuallyAccepted,
          setAvailableMatches,
          setOfferCreated,
          setAvailableCallsFromServer,
          setRemoteStream,
          setLocalStream,
          //socketMatchmaking,
          disconnectSocket
        );
        setStep3InitSocketListenersExecuted(true);
        setStep2SetupPeerConnectionExecuted(false);
      }
    }, [typeOfCall, peerConnection, step2SetupPeerConnectionExecuted]);

    const [offerCreated, setOfferCreated] = useState(false);

    // Step 4: Create an offer
    //once the user has started this component, start WebRTC'ing :)
    useEffect(() => {
      console.log("Step 4 (Before): Creating offer typeOfCall:", typeOfCall);

      if (typeOfCall === "offer" && step3InitSocketListenersExecuted) {
        createOffer(
          peerConnection,
          username,
          offerCreated,
          callStatus,
          updateCallStatus,
          setOfferCreated,
          //setVideoMessage,
          offerData,
          localStream
        );
        setStep4CreateOfferExecuted(true);
        setStep3InitSocketListenersExecuted(false);
      }
    }, [step3InitSocketListenersExecuted]);

    // Step 5: Set the remote description (answer)
    useEffect(() => {
      console.log("Step 5 (Before): Setting remote description (answer)");
      console.log(callStatus);
      console.log(offerCreated);
      if (callStatus?.answer && offerCreated && step5AnswerReceivedExecuted) {
        console.log("Step 5: Setting remote description (answer)");
        addAnswer(
          callStatus,
          peerConnection,
          remoteDescAddedForOfferer,
          setRemoteDescAddedForOfferer,
          updateCallStatus,
          offerData
        );
        console.log(
          "After Adding answer, offerdata.answererUserName:" +
            offerData?.answererUserName
        );
        setStep5AnswerReceivedExecuted(false);
      }
    }, [step5AnswerReceivedExecuted]);

    //once remoteStream AND pc are ready, navigate
    useEffect(() => {
      console.log(
        "Before navigating to video page, remoteStream and peerConnection are:",
        remoteStream,
        peerConnection,
        "remoteDescAddedForOfferer:",
        remoteDescAddedForOfferer
      );
      if (remoteStream && peerConnection) {
        if (
          typeOfCall === "offer" &&
          remoteDescAddedForOfferer &&
          step4CreateOfferExecuted
        ) {
          console.log("navigating as offerer to videocall page...");
          setStep4CreateOfferExecuted(false);

          navigate("/offer", { replace: false });
        } else if (typeOfCall === "answer") {
          console.log("navigating as answerer to videocall page...");
          navigate("/answer", { replace: false });
        }
      }
    }, [
      remoteStream,
      peerConnection,
      remoteDescAddedForOfferer,
      step4CreateOfferExecuted,
    ]);

    useImperativeHandle(ref, () => ({
      initCall,
      findMatch,
      acceptMatch,
      startNewCall,
      joinCall,
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
    console.log("Step 4.5: Set the local stream to the local video element");
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
  //setVideoMessage: (value: React.SetStateAction<string>) => void,
  offerData: CallData | undefined,
  localStream: MediaStream | undefined
) => {
  console.log(
    "Trying to Step 4: Making offer  offerCreated: " +
      offerCreated +
      " callStatus?.videoEnabled: " +
      callStatus?.videoEnabled +
      " peerConnection: " +
      peerConnection +
      " localStream: " +
      localStream
  );

  if (!offerCreated && callStatus && peerConnection && localStream) {
    console.log("Init video! from createOffer");
    initVideo(peerConnection, callStatus, localStream);

    console.log("Step 4: Making offer");
    const offer = await peerConnection?.createOffer();
    peerConnection?.setLocalDescription(offer);

    //we can now start collecing ice candidates!
    // we need to emit the offer to the server
    const socket = socketConnection(username, "practiceOneOne");
    socket.emit("newOffer", offer);

    setOfferCreated(true); //so that our useEffect doesn't make an offer again
    //setVideoMessage("Awaiting answer..."); //update our videoMessage box
  }
};

export const addAnswer = async (
  callStatus: CallStatus | undefined,
  peerConnection: RTCPeerConnection | undefined,
  remoteDescAddedForOfferer: boolean,
  setRemoteDescAddedForOfferer: (value: React.SetStateAction<boolean>) => void,
  updateCallStatus: React.Dispatch<
    React.SetStateAction<CallStatus | undefined>
  >,
  offerData?: CallData
) => {
  if (callStatus?.answer && !remoteDescAddedForOfferer) {
    console.log("Step 5: Recieved and setting answer.");
    console.log(callStatus);

    if (callStatus?.answer === undefined) {
      console.error("Answer is undefined!");
      return;
    }
    console.log(
      "Recieved and setting answer. callStatus.answer: " + callStatus.answer
    );
    console.log(callStatus);
    console.log("📡 Setting remote description...");
    console.log(
      "Signaling state before setting:",
      peerConnection?.signalingState
    );
    console.log(
      "Remote description already set?",
      peerConnection?.remoteDescription
    );
    console.log("Remote SDP:", callStatus.answer.sdp);
    if (peerConnection?.signalingState !== "stable") {
      console.log("Setting remote description (answer)...");
      await peerConnection?.setRemoteDescription(callStatus.answer);
      setCallStatusForOfferer(callStatus, updateCallStatus);
      setRemoteDescAddedForOfferer(true);
    } else {
      console.warn(
        "Attempted to setRemoteDescription while in stable state. Skipping."
      );
    }
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
    setCallStatusForAnswerer(callStatus, updateCallStatus);
    console.log("Init video! from addRecievedOfferAndCreateAnswerAsync");
    initVideo(peerConnection, callStatus, localStream);

    const username = sessionStorage.getItem("username");

    console.log("Recieved offer from caller, adding it to peerConnection.");

    console.log(offerData.offer);
    console.log("offererUserName: " + offerData.offererUserName);
    console.log("answererUserName: " + offerData.answererUserName);
    // Step 4: adding the offer from caller
    await peerConnection.setRemoteDescription(offerData.offer);
    console.log("Step 4: Recieved and adding offer from caller");

    // Step 5: creating answer and sending it back to caller
    //now that we have the offer set, make our answer
    // when calling createAnswer, 'icecandidate' event in createPeerConnection is triggered
    const answer = await peerConnection.createAnswer();
    peerConnection.setLocalDescription(answer);
    console.log("Step 5: creating answer and sending it back to caller");
    console.log("settting answererUserName: " + username);

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

const setCallStatusForAnswerer = (
  callStatus: CallStatus,
  updateCallStatus: React.Dispatch<React.SetStateAction<CallStatus | undefined>>
) => {
  console.log("setCallStatusForAnswerer!");
  const copyCallStatus = { ...callStatus };
  copyCallStatus.videoEnabled = true;
  copyCallStatus.callInitiated = true;
  copyCallStatus.otherCallerUserName = sessionStorage.getItem(
    "otherCallerUserName"
  );
  console.log(
    "setCallStatusForAnswerer().otherCallerUserName: " +
      copyCallStatus.otherCallerUserName
  );
  updateCallStatus(copyCallStatus);
};

const setCallStatusForOfferer = (
  callStatus: CallStatus,
  updateCallStatus: React.Dispatch<React.SetStateAction<CallStatus | undefined>>
) => {
  console.log("setCallStatusForOfferer!");
  console.log("before setting otherCallerUserName in callStatus for offerer");
  console.log(callStatus);
  const copyCallStatus = { ...callStatus };
  copyCallStatus.videoEnabled = true;
  copyCallStatus.callInitiated = true;
  copyCallStatus.otherCallerUserName = sessionStorage.getItem(
    "otherCallerUserName"
  );
  console.log(
    "setCallStatusForOfferer().otherCallerUserName: " +
      copyCallStatus.otherCallerUserName
  );
  updateCallStatus(copyCallStatus);
};

const initVideo = (
  peerConnection: RTCPeerConnection,
  callStatus: CallStatus,
  localStream: MediaStream
) => {
  // we are not adding tracks so they are visible
  // in the video tag. We are addign them
  // to the PC, so they can be sent
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });
};
/*
export const safeUpdateCallStatus = (updateFn: React.SetStateAction<CallStatus | undefined>) => {
  updateCallStatus((prev) => {
    const next = typeof updateFn === 'function' ? updateFn(prev) : updateFn;
    console.log("🔍 Updating callStatus");
    console.log("Previous:", prev);
    console.log("Next:", next);
    return next;
  });
};*/
