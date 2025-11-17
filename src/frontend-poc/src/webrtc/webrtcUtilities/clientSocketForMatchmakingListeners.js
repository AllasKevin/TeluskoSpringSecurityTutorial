import { set } from "react-hook-form";

const clientSocketForMatchmakingListeners = (socket,matchMutuallyAccepted, setMatchMutuallyAccepted, setAvailableMatches, chosenPractice, setChosenPractice)=>{

    socket.on('foundMatch',availableMatch=>{
        console.log("availableMatch: " + availableMatch)
        setAvailableMatches((prevMatches) => [
          ...prevMatches,
          { userName: availableMatch.userName, practice: availableMatch.chosenPractice },
        ]);    })

    socket.on('matchMutuallyAccepted', matchInfo=>{
        console.log("🔌 matchMutuallyAccepted handler on socket id: " + socket.id + " and given role: " + matchInfo.role);
        setChosenPractice(matchInfo.practice)
        setMatchMutuallyAccepted(matchInfo.role);
        socket.disconnect();
    })

    socket.on('matchDeclined', nothing=>{
        console.log("matchDeclined called from server and setting availableMatches to []");
        setAvailableMatches([]);
    })

    console.log("clientSocketForMatchmakingListeners initialized");
}

export default clientSocketForMatchmakingListeners