import { useCallback } from "react";
import { CallStatus } from "../../App";
import { CallData } from "../../components/Dashboard";
import socketConnection from "../webrtcUtilities/socketConnection";

interface UseCallManagerProps {
  peerConnection: RTCPeerConnection | undefined;
  setPeerConnection: React.Dispatch<React.SetStateAction<RTCPeerConnection | undefined>>;
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
      console.log("Hanging up...");
      updateCallStatus((prev) => {
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

      const username = sessionStorage.getItem("username");
      console.log("notify hangUp to: " + offerData?.answererUserName);
      socketConnection(username).emit("notify", {
        receiver: offerData?.answererUserName,
        message: "hangUp",
      });
    }
  }, [peerConnection, updateCallStatus, localFeedEl, remoteFeedEl]);

  return {
    hangupCall,
  };
}
