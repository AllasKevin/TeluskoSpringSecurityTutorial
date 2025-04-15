import { RefObject, useEffect, useState } from "react";
import apiClient from "../services/api-client";
import socketConnection from "../webrtc/webrtcUtilities/socketConnection";
import createPeerConnection from "../webrtc/webrtcUtilities/createPeerConn";
import { useNavigate } from "react-router-dom";
import { CallStatus } from "../App";
import prepForCall from "../webrtc/webrtcUtilities/prepForCall";
import clientSocketListeners from "../webrtc/webrtcUtilities/clientSocketListeners";

interface Color {
  color: string;
}
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
  userName: string | null;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  //  offerData: any;
  setOfferData: React.Dispatch<React.SetStateAction<any>>;
  remoteFeedEl: RefObject<HTMLVideoElement | null>;
  localFeedEl: RefObject<HTMLVideoElement | null>;
}

const Dashboard = ({
  callStatus,
  updateCallStatus,
  //  localStream,
  setLocalStream,
  remoteStream,
  setRemoteStream,
  peerConnection,
  setPeerConnection,
  userName,
  setUserName,
  //  offerData,
  setOfferData,
  remoteFeedEl,
  localFeedEl,
}: DashboardProps) => {
  const getStudents = () => {
    apiClient
      .get("/students", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Students: ", response.data);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
      });
  };

  const [colorState, setColorState] = useState<Color>();

  const getColor = () => {
    apiClient
      .get<Color>("/color")
      .then((response) => {
        console.log("getcolor: ", response.data);
        setColorState(response.data);
      })
      .catch((err) => {
        console.error("Error fetching changecolor:", err);
      });
  };

  const changeColor = (chosenColor: string) => {
    apiClient
      .post<Color>("/changecolor", { color: chosenColor })
      .then((response) => {
        console.log("changecolor: ", response.data);
        setColorState(response.data);
      })
      .catch((err) => {
        console.error("Error fetching changecolor:", err);
      });
  };

  console.log("Dashboard component rendered");

  const [typeOfCall, setTypeOfCall] = useState("");
  const [joined, setJoined] = useState(false);
  const [availableCalls, setAvailableCalls] = useState([]);
  const navigate = useNavigate();

  //called on "Call" or "Answer"
  const initCall = async (typeOfCall: string) => {
    // set localStream and GUM
    console.log("initCall called");
    console.log(callStatus);
    await prepForCall({ callStatus, updateCallStatus, setLocalStream });
    // console.log("gum access granted!")
    setTypeOfCall(typeOfCall); //offer or answer
  };

  //Test backend connection
  // useEffect(()=>{
  //     const test = async()=>{
  //         const socket = socketConnection("test")
  //     }
  //     test()
  // },[])

  //Nothing happens until the user clicks join
  //(Helps with React double render)
  useEffect(() => {
    console.log("joined changed: " + joined);
    if (joined) {
      const userName = prompt("Enter username");
      setUserName(userName);
      const setCalls = (data: []) => {
        setAvailableCalls(data);
        console.log("Available calls: " + data);
      };
      const socket = socketConnection(userName);
      socket.on("availableOffers", setCalls);
      socket.on("newOfferAwaiting", setCalls);
    }
  }, [joined]);

  //We have media via GUM. setup the peerConnection w/listeners
  useEffect(() => {
    if (callStatus && userName && callStatus.haveMedia && !peerConnection) {
      // prepForCall has finished running and updated callStatus
      const result = createPeerConnection(userName, typeOfCall);
      if (result) {
        setPeerConnection(result.peerConnection);
        setRemoteStream(result.remoteStream);
      }
    }
  }, [callStatus?.haveMedia]);

  //We know which type of client this is and have PC.
  //Add socketlisteners
  useEffect(() => {
    if (typeOfCall && peerConnection) {
      const socket = socketConnection(userName);
      clientSocketListeners(
        socket,
        typeOfCall,
        callStatus,
        updateCallStatus,
        peerConnection,
        remoteFeedEl,
        localFeedEl
      );
    }
  }, [typeOfCall, peerConnection]);

  //once remoteStream AND pc are ready, navigate
  useEffect(() => {
    if (remoteStream && peerConnection) {
      navigate(`/${typeOfCall}?token=${Math.random()}`);
    }
  }, [remoteStream, peerConnection]);

  const call = async () => {
    //call related stuff goes here
    initCall("offer");
  };

  const answer = (callData: CallData) => {
    //answer related stuff goes here
    initCall("answer");
    setOfferData(callData);
  };

  if (!joined) {
    return (
      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <button
          onClick={() => setJoined(true)}
          className="btn btn-primary btn-lg"
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <h1>{userName}</h1>
        <div className="col-6">
          <h2>Make a call</h2>
          <button onClick={call} className="btn btn-success btn-lg hang-up">
            Start Call
          </button>
        </div>
        <div className="col-6">
          <h2>Available Calls</h2>
          {availableCalls.map((callData: CallData, i) => (
            <div className="col mb-2" key={i}>
              <button
                onClick={() => {
                  answer(callData);
                }}
                className="btn btn-lg btn-warning hang-up"
              >
                Answer Call From {callData.offererUserName}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: colorState?.color || "blue",
        height: "100vh",
        color: "white",
      }}
    >
      {" "}
      Dashboard
      <button className="btn btn-secondary" onClick={getStudents}>
        GetStudents
      </button>
      <button className="btn btn-primary" onClick={() => changeColor("green")}>
        changeColorToGreen
      </button>{" "}
      <button className="btn btn-primary" onClick={() => changeColor("blue")}>
        changeColorToBlue
      </button>{" "}
      <button className="btn btn-primary" onClick={getColor}>
        GetColor
      </button>
    </div>
  );
};

export default Dashboard;
