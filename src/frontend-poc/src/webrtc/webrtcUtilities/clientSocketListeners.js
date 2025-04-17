
const clientSocketListeners = (socket,typeOfCall,callStatus,
    updateCallStatus,peerConnection,remoteFeedEl,localFeedEl)=>{
    socket.on('answerResponse',entireOfferObj=>{
        console.log(entireOfferObj);
        const copyCallStatus = {...callStatus}
        copyCallStatus.answer = entireOfferObj.answer
        copyCallStatus.myRole = typeOfCall
        updateCallStatus(copyCallStatus)
    })

    socket.on('receivedIceCandidateFromServer',iceC=>{
        if(iceC){
            peerConnection.addIceCandidate(iceC).catch(err=>{
                console.log("Chrome thinks there is an error. There isn't...")
            })
            console.log(iceC)
            console.log("Added an iceCandidate to existing page presence")
            // setShowCallInfo(false);
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