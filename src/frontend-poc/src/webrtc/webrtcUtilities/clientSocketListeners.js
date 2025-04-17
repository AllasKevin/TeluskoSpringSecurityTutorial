
const clientSocketListeners = (socket,typeOfCall,callStatus,
    updateCallStatus,peerConnection,remoteFeedEl,localFeedEl,gatheredAnswerIceCandidatesRef,setIceCandidatesReadyTrigger,remoteDescAddedForOfferer)=>{
    socket.on('answerResponse',entireOfferObj=>{
        console.log(entireOfferObj);
        const copyCallStatus = {...callStatus}
        copyCallStatus.answer = entireOfferObj.answer
        copyCallStatus.myRole = typeOfCall
        updateCallStatus(copyCallStatus)
    })

    socket.on('receivedIceCandidateFromServer',iceC=>{
        if(iceC){
            console.log("Received iceCandidate from server. remoteDescAddedForOfferer: " + remoteDescAddedForOfferer + " typeOfCall: " + typeOfCall)
            if(remoteDescAddedForOfferer === false && typeOfCall === "offer"){
                console.log("RemoteDescription not yet added and typeOfCall is offer. Gathering iceCandidate to be added after setRemoteDescription is called.");
                gatheredAnswerIceCandidatesRef.current.push(iceC);
                setIceCandidatesReadyTrigger(prev=> prev + 1);
                return;
            }

            peerConnection.addIceCandidate(iceC).catch(err=>{
                console.log("Chrome thinks there is an error. There isn't...")
            })
            console.log(iceC)
            console.log("Added an iceCandidate to existing page presence")
            
        }
    })


    socket.on('notification',message=>{
        console.log("notification: " + message)
        if(message === "hangUp"){
            remoteFeedEl.current.srcObject = null;
        }

    })
}

export default clientSocketListeners