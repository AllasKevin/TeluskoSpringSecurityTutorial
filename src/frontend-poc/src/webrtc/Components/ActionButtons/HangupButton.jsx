import { useCallManager }  from "../../hooks/useCallManager";

const HangupButton = ({remoteFeedEl, localFeedEl,peerConnection,setPeerConnection, callStatus, updateCallStatus,localStream,setLocalStream,remoteStream,setRemoteStream})=>{

    const { hangupCall } = useCallManager({
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
      });

    if(callStatus?.current === "complete"){
        return <></>
    }

    return(
        <button 
            onClick={hangupCall} 
            className="btn btn-danger hang-up"
        >Hang Up</button>
    )
}

export default HangupButton