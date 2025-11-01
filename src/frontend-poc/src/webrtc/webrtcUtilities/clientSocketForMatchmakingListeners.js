import { set } from "react-hook-form";

const clientSocketForMatchmakingListeners = (socket,matchMutuallyAccepted, setMatchMutuallyAccepted, setAvailableMatches, chosenPractice)=>{

    socket.on('foundMatch',availableMatch=>{
        console.log("availableMatch: " + availableMatch)
        setAvailableMatches((prevMatches) => [
          ...prevMatches,
          { userName: availableMatch, practice: chosenPractice },
        ]);    })

    socket.on('matchMutuallyAccepted', role=>{
        console.log("🔌 matchMutuallyAccepted handler on socket id: " + socket.id + " and given role: " + role);
        setMatchMutuallyAccepted(role);
        socket.disconnect();
    })

    socket.on('matchDeclined', nothing=>{
        console.log("matchDeclined called from server and setting availableMatches to []");
        setAvailableMatches([]);
    })

    console.log("clientSocketForMatchmakingListeners initialized");
}

export default clientSocketForMatchmakingListeners