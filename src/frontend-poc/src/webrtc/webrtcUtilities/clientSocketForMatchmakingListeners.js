import { set } from "react-hook-form";

const clientSocketForMatchmakingListeners = (socket, setMatchMutuallyAccepted, setAvailableMatches, chosenPractice)=>{

    socket.on('foundMatch',availableMatch=>{
        console.log("availableMatch: " + availableMatch)
        setAvailableMatches((prevMatches) => [
          ...prevMatches,
          { userName: availableMatch, practice: chosenPractice },
        ]);    })

    socket.on('matchMutuallyAccepted', role=>{
        console.log("matchMutuallyAccepted: " + role)
        setMatchMutuallyAccepted(role);
    })

    console.log("clientSocketForMatchmakingListeners initialized");
}

export default clientSocketForMatchmakingListeners