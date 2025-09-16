import { set } from "react-hook-form";

const clientSocketListeners = (step5AnswerReceivedExecuted,setStep5AnswerReceivedExecuted,socket,typeOfCall,setTypeOfCall,callStatus,updateCallStatus,peerConnection,setPeerConnection,
    remoteFeedEl,localFeedEl,gatheredAnswerIceCandidatesRef,setIceCandidatesReadyTrigger,
    remoteDescAddedForOfferer, setRemoteDescAddedForOfferer,setOfferData,setClientSocketListenersInitiated, setMatchMutuallyAccepted,
     setAvailableMatches,setOfferCreated,setAvailableCallsFromServer,setRemoteStream,setLocalStream,socketMatchmaking,disconnectSocket)=>{

    socket.on('answerResponse',entireOfferObj=>{

        if (step5AnswerReceivedExecuted) {
            console.warn("🔁 Duplicate answerResponse received, ignoring.");
            return;
        }

        console.log("✅ Recieved and setting answer. answererUserName: " + entireOfferObj.answererUserName);
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
            disconnectSocket();
                        console.log("notification: " + message + " 1handled");

            setTypeOfCall(null);
            updateCallStatus(null);
            setPeerConnection(null);
                        console.log("notification: " + message + " 2handled");

            remoteFeedEl = null;
            localFeedEl = null;
            gatheredAnswerIceCandidatesRef = [];
                        console.log("notification: " + message + " 3handled");

            setIceCandidatesReadyTrigger(null);
            setRemoteDescAddedForOfferer(false);

            console.log("notification: " + message + " 4handled");

            setOfferData(null);
                                    console.log("notification: " + message + " 5handled");

            setClientSocketListenersInitiated(null); 
                        console.log("notification: " + message + " 6handled");

            setMatchMutuallyAccepted(null); 
            //setAvailableMatches(null);
                        console.log("notification: " + message + " 7handled");
            setOfferCreated(null);
                        console.log("notification: " + message + " 7handled");
            setAvailableCallsFromServer(null);
                        console.log("notification: " + message + " 8handled");
            setRemoteStream(null);
                        console.log("notification: " + message + " 9handled");

            setLocalStream(null);
            socketMatchmaking.disconnect();
            socketMatchmaking = null;
        }
        console.log("notification: " + message + " handled");

    })
    console.log("clientSocketListeners initialized!!!!");
    setClientSocketListenersInitiated(true);
}

export default clientSocketListeners