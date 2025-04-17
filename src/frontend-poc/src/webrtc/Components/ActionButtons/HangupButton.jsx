const HangupButton = ({remoteFeedEl, localFeedEl,peerConnection, callStatus, updateCallStatus})=>{

    const hangupCall = ()=>{
        if(peerConnection){
            console.log("Hanging up...")
            const copyCallStatus = {...callStatus}
            copyCallStatus.current = 'complete'
            updateCallStatus(copyCallStatus)
            //user has clicked hang up. pc:
                //close it
                //remove listeners
                //set it to null
                peerConnection.close();
                peerConnection.onicecandidate = null
                peerConnection.onaddstream = null
                peerConnection = null;

            //set both video tags to empty
            localFeedEl.current.srcObject = null;
            remoteFeedEl.current.srcObject = null;
        }
    }

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