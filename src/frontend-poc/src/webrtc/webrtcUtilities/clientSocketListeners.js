import { set } from "react-hook-form";

const clientSocketListeners = (socket,typeOfCall,callStatus,updateCallStatus,peerConnection,
    remoteFeedEl,localFeedEl,gatheredAnswerIceCandidatesRef,setIceCandidatesReadyTrigger,
    remoteDescAddedForOfferer,setOfferData)=>{

    socket.on('answerResponse',entireOfferObj=>{
        setOfferData(entireOfferObj);
        const copyCallStatus = {...callStatus}
        copyCallStatus.answer = entireOfferObj.answer
        copyCallStatus.myRole = typeOfCall
        updateCallStatus(copyCallStatus)
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
            remoteFeedEl.current.srcObject = null;
        }

    })
}

export default clientSocketListeners