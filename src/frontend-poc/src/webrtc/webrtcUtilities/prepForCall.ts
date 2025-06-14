//Share this function for both sides, answer and caller
// because both sides need to do this same thing before
// we can move forward
import { CallStatus } from "../../App";

interface PrepForCallProps {
    callStatus: CallStatus | undefined; 
    updateCallStatus: React.Dispatch<React.SetStateAction<CallStatus | undefined>>;
    setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  }

  const defaultCallStatus: CallStatus = {
    haveMedia: false,
    videoEnabled: false,
    audioEnabled: false,
    callInitiated: false,
  };

const prepForCall = ({callStatus,updateCallStatus,setLocalStream}: PrepForCallProps)=>{
    return new Promise<void>(async (resolve, reject) => {
        //can bring constraints in as a param
        const constraints = {
            video: true, //must have one constraint, dont have to show it yet
            audio: {
                sampleRate: 48000,         // match WebRTC's preferred rate
                channelCount: 2,           // stereo
                echoCancellation: true,    // good for calls
                noiseSuppression: true,    // good for calls
                autoGainControl: true,     // helps normalize volume
              },
        }
        try{
            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            //update bools
            const copyCallStatus = callStatus === undefined ? defaultCallStatus : {...callStatus};
            copyCallStatus.haveMedia = true //signals to the app that we have media
            copyCallStatus.videoEnabled = false //init both to false, you can init to true
            copyCallStatus.audioEnabled = false
            copyCallStatus.current = "initialized"
            updateCallStatus(copyCallStatus)
            setLocalStream(stream)
            resolve()
        }catch(err){
            console.log(err);
            reject(err)
        }
    })
}

export default prepForCall