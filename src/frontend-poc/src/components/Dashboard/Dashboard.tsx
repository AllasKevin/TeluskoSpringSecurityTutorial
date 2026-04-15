import { RefObject } from "react";
import { CallStatus } from "../../App";

export interface CallData {
  offererUserName?: string | null;
  offer: RTCSessionDescriptionInit;
  offerIceCandidates: RTCIceCandidateInit[];
  answer: RTCSessionDescriptionInit;
  answererUserName?: string | null;
  answererIceCandidates: RTCIceCandidateInit[];
}

interface DashboardProps {
  callStatus: CallStatus | undefined;
  updateCallStatus: React.Dispatch<React.SetStateAction<CallStatus | undefined>>;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  remoteStream: MediaStream | undefined;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  peerConnection: RTCPeerConnection | undefined;
  setPeerConnection: React.Dispatch<React.SetStateAction<RTCPeerConnection | undefined>>;
  setOfferData: React.Dispatch<React.SetStateAction<CallData | undefined>>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
  localFeedEl: RefObject<HTMLVideoElement | null>;
  gatheredAnswerIceCandidatesRef: React.RefObject<RTCIceCandidateInit[]>;
  setIceCandidatesReadyTrigger: React.Dispatch<React.SetStateAction<number>>;
  remoteDescAddedForOfferer: boolean;
}

/**
 * Legacy dashboard component - currently unused but kept for the /dashboard route.
 * The CallData interface exported here is used across the application.
 */
const Dashboard = (_props: DashboardProps) => {
  return <></>;
};

export default Dashboard;
