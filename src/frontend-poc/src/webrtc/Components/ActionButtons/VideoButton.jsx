
const VideoButton = ({localFeedEl,callStatus,localStream,updateCallStatus,peerConnection})=>{

    //handle user clicking on video button
    const startStopVideo = ()=>{
        console.log("videoButton clicked")
        console.log(callStatus.callInitiated)
        console.log(callStatus.videoEnabled)
        const copyCallStatus = {...callStatus}
        // useCases:
        if(copyCallStatus?.callInitiated && copyCallStatus?.videoEnabled){
            // 1. Video is enabled, so we need to disable
            //disable
            console.log("Disable video!")
            copyCallStatus.videoEnabled = false
            updateCallStatus(copyCallStatus)
            const tracks = localStream.getVideoTracks()
            tracks.forEach(track=>track.enabled = false)
        }else if(copyCallStatus?.callInitiated && copyCallStatus?.videoEnabled === false){
            // 2. Video is disabled, so we need to enable
            console.log("Enable video!")
            copyCallStatus.videoEnabled = true
            updateCallStatus(copyCallStatus)
            const tracks = localStream.getVideoTracks()
            tracks.forEach(track=>track.enabled = true)
        }else if(copyCallStatus?.callInitiated === false && copyCallStatus?.videoEnabled === false){
            // 3. Video is null, so we need to init
            console.log("Init video!")
            copyCallStatus.videoEnabled = true
            copyCallStatus.callInitiated = true
            updateCallStatus(copyCallStatus)
            // we are not adding tracks so they are visible 
            // in the video tag. We are addign them
            // to the PC, so they can be sent
            localStream.getTracks().forEach(track=>{
                console.log("Adding tracks that will be used in remote stream to peer connection")
                peerConnection.addTrack(track,localStream)
            })
        }
    }

    return(
        <div className="button-wrapper video-button d-inline-block">
            <i className="fa fa-caret-up choose-video"></i>
            <div className="button camera" onClick={startStopVideo}>
                <i className="fa fa-video"></i>
                <div className="btn-text">{callStatus?.video === "enabled" ? "Stop" : "Start"} Video</div>
            </div>
        </div>
    )
}
export default VideoButton;