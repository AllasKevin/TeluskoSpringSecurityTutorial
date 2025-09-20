//Share this function for both sides, answer and caller
// because both sides need to do this same thing before
// we can move forward
import { CallStatus } from "../../App";

interface PrepForCallProps {
    callStatus: CallStatus | undefined; 
    updateCallStatus: React.Dispatch<React.SetStateAction<CallStatus | undefined>>;
    setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
    foundMatch?: string; // Optional, used for answerer to set the other user name
  }



const prepForCall = ({callStatus,updateCallStatus,setLocalStream, foundMatch}: PrepForCallProps)=>{
    console.log("prepForCall called and fucking up callstatus");
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

            console.log("prepForCall. : " + foundMatch ? foundMatch : null);
            console.log("prepForCall. : " + foundMatch);
            updateCallStatus((prev) => ({
                ...prev,
                haveMedia: true,
                videoEnabled: false,
                audioEnabled: false,
                callInitiated: true,
                current: "initialized",
                otherCallerUserName: foundMatch ? foundMatch : null,
            }));
           /* //update bools
            const copyCallStatus = {...callStatus};
            copyCallStatus.haveMedia = true //signals to the app that we have media
            copyCallStatus.videoEnabled = false //init both to false, you can init to true
            copyCallStatus.audioEnabled = false
            copyCallStatus.current = "initialized"
            copyCallStatus.otherCallerUserName = "bajs";
            updateCallStatus(copyCallStatus)*/
            setLocalStream(stream)
            resolve()
        }catch(err){
            console.log(err);
            reject(err)
        }
    })
}

export default prepForCall