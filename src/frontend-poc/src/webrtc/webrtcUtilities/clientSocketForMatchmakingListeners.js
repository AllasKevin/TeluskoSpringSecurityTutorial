import { set } from "react-hook-form";

const clientSocketForMatchmakingListeners = (socket,matchMutuallyAccepted, setMatchMutuallyAccepted, setAvailableMatches, chosenPractice)=>{

    socket.on('foundMatch',availableMatch=>{
        console.log("availableMatch: " + availableMatch)
        setAvailableMatches((prevMatches) => [
          ...prevMatches,
          { userName: availableMatch, practice: chosenPractice },
        ]);    })

    socket.on('matchMutuallyAccepted', role=>{
        console.log("🔌 matchMutuallyAccepted handler on socket id:", socket.id);
        console.log("matchMutuallyAccepted: " + role)
        setMatchMutuallyAccepted(role);
        socket.disconnect();
    })

    console.log("clientSocketForMatchmakingListeners initialized");
}

export default clientSocketForMatchmakingListeners