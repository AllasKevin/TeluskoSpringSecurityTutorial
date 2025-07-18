import { set } from "react-hook-form";

const clientSocketListeners = (setStep5AnswerReceivedExecuted,socket,typeOfCall,setTypeOfCall,callStatus,updateCallStatus,peerConnection,setPeerConnection,
    remoteFeedEl,localFeedEl,gatheredAnswerIceCandidatesRef,setIceCandidatesReadyTrigger,
    remoteDescAddedForOfferer, setRemoteDescAddedForOfferer,setOfferData,setClientSocketListenersInitiated, setMatchMutuallyAccepted,
     setAvailableMatches,setOfferCreated,setAvailableCallsFromServer,setRemoteStream,setLocalStream,socketMatchmaking)=>{

    socket.on('answerResponse',entireOfferObj=>{
        console.log("Recieved and setting answer. answererUserName: " + entireOfferObj.answererUserName);
        setOfferData(entireOfferObj);
        const copyCallStatus = {...callStatus}
        copyCallStatus.answer = entireOfferObj.answer
        copyCallStatus.myRole = typeOfCall
        copyCallStatus.otherCallerUserName = entireOfferObj.answererUserName;
        updateCallStatus(copyCallStatus)
        setStep5AnswerReceivedExecuted(true);
        console.log(copyCallStatus);
    })

    socket.on('receivedIceCandidateFromServer',iceC=>{
        if(iceC){
            if(remoteDescAddedForOfferer === false && typeOfCall === "offer"){
                gatheredAnswerIceCandidatesRef.current.push(iceC);
                setIceCandidatesReadyTrigger(prev=> prev + 1);
                return;
            }

            peerConnection.addIceCandidate(iceC).catch(err=>{
                console.log("Chrome thinks there is an error. There isn't...")
            })
        }
    })


    socket.on('notification',message=>{
        console.log("notification: " + message)
        if(message === "hangUp"){
            remoteFeedEl = null;
            socket.disconnect();
            socket = null;
            setTypeOfCall(null);
            updateCallStatus(null);
            setPeerConnection(null);
            remoteFeedEl = null;
            localFeedEl = null;
            gatheredAnswerIceCandidatesRef = [];
            setIceCandidatesReadyTrigger(null);
            setRemoteDescAddedForOfferer(false)
            setOfferData(null);
            setClientSocketListenersInitiated(null); 
            setMatchMutuallyAccepted(null); 
            //setAvailableMatches(null);
            setOfferCreated(null);
            setAvailableCallsFromServer(null);
            setRemoteStream(null);
            setLocalStream(null);
            socketMatchmaking.disconnect();
            socketMatchmaking = null;
        }

    })
    console.log("clientSocketListeners initialized!!!!");
    setClientSocketListenersInitiated(true);
}

export default clientSocketListeners