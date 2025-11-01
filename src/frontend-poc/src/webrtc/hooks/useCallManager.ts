import { useCallback } from "react";
import { CallStatus } from "../../App";
import { CallData } from "../../components/Dashboard";
import {socketConnection, getCurrentSocket} from "../webrtcUtilities/socketConnection";

interface UseCallManagerProps {
  peerConnection: RTCPeerConnection | undefined;
  setPeerConnection: React.Dispatch<React.SetStateAction<RTCPeerConnection | undefined>>;
  callStatus: CallStatus | undefined;
  updateCallStatus: React.Dispatch<React.SetStateAction<CallStatus | undefined>>;
  localFeedEl: React.RefObject<HTMLVideoElement | null>;
  remoteFeedEl: React.RefObject<HTMLVideoElement | null>;
  localStream: MediaStream | undefined;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  remoteStream: MediaStream | undefined;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  offerData: CallData | undefined;
}

export function useCallManager({
  peerConnection,
  setPeerConnection,
  callStatus,
  updateCallStatus,
  localFeedEl,
  remoteFeedEl,
  localStream,
  setLocalStream,
  remoteStream,
  setRemoteStream,
  offerData,
}: UseCallManagerProps) {
const hangupCall = useCallback(() => {
    if (peerConnection) {

      const otherCallerUserName = sessionStorage.getItem("otherCallerUserName");
      
      console.log("Hanging up...");
      console.log("callStatus before hangUp forreal foreal:");
      console.log(callStatus);
      console.log("1notify hangUp to: " + otherCallerUserName);

      updateCallStatus((prev) => {
        console.log("Updating callStatus to hang up");
        if (!prev) return undefined;
        return {
          ...prev,
          current: "complete",
          haveMedia: false,
          videoEnabled: false,
          audioEnabled:false,
          callInitiated: false,
          answer: undefined,
          myRole: undefined,
          otherCallerUserName: undefined,
        };
      });

      peerConnection.close();
      peerConnection.onicecandidate = null;
      peerConnection.ontrack = null;
      peerConnection = undefined;
      setPeerConnection(peerConnection);

      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(undefined);
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
        setRemoteStream(undefined);
      }

      if (localFeedEl.current) localFeedEl.current.srcObject = null;
      if (remoteFeedEl.current) remoteFeedEl.current.srcObject = null;

      console.log("sessionStorage keys:", Object.keys(sessionStorage));
      console.log("username:", sessionStorage.getItem("username"));

      const username = sessionStorage.getItem("username");
      const socket = getCurrentSocket();
      if(socket === null) {
        console.log("Socket is not connected. Cannot send hangUp notification.");
      }
      else if(socket.connected)
      {
        console.log("new changes are in place.");

        console.log("Socket is connected. Emitting hangUp notification to: " + otherCallerUserName);
        socket.emit("notify", {
                  receiver: otherCallerUserName,
                  message: "hangUp",  
                  });
      }

    }
  }, [peerConnection, updateCallStatus, localFeedEl, remoteFeedEl]);

  return {
    hangupCall,
  };
}
