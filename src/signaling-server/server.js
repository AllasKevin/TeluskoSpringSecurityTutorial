const dotenv = require('dotenv');
const Queue = require('./utils/Queue');
const fs = require('fs');
const https = require('https')
const http = require('http')
const express = require('express');
const app = express();
const socketio = require('socket.io');
const path = require("path");
console.log("Server is starting...");
app.use(express.static(__dirname))

////**MAJOR CHANGE**////

//we need a key and cert to run https
//we generated them with mkcert
// $ mkcert create-ca
// $ mkcert create-cert
const key = fs.readFileSync('./certs/192.168.0.110-key.pem');
const cert = fs.readFileSync('./certs/192.168.0.110.pem');


const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'local'
    ? '.env.local'
    : '.env';

dotenv.config({ path: envFile });
console.log(`Loaded environment file: ${envFile}`);

// 🧩 Dynamically choose shared path based on environment
const sharedPath =
  process.env.NODE_ENV === "production"
    ? "./shared/practices/practices.cjs"
    : "../shared/practices/practices.cjs";
const { practices } = require(path.resolve(__dirname, sharedPath));


//we changed our express setup so we can use https
//pass the key and cert to createServer on https
const expressServer =
  process.env.NODE_ENV === 'local'
    ? https.createServer({ key, cert }, app)
    : http.createServer(app);

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : [];

console.log('Allowed origins:', allowedOrigins);
//create our socket.io server... it will listen to our express port
const io = socketio(expressServer,{
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});


expressServer.listen(process.env.PORT);

//offers will contain {}
const offers = [
    // offererUserName
    // offer
    // offerIceCandidates
    // answererUserName
    // answer
    // answererIceCandidates
];
const connectedSockets = [
    //username, matchingSocketId, defaultSocketId, practice
]

const serverUpdates = io.of("/server-updates");
// Example POST endpoint (if you need it)
app.use(express.json());
app.post("/createbooking", (req, res) => {
  console.log("POST /createbooking called");
  //console.log("req.body: " + JSON.stringify(req.body));
  
  updateMyBookingsTab(req);
  updateAvailableBookingsTab(req);

  res.status(201).json({ message: "createbooking received, emitting it to all connected clients." });
});

app.post("/bookingresponse", (req, res) => {
  console.log("POST /bookingresponse called");
  //console.log("req.body: " + JSON.stringify(req.body));
  
  updateMyBookingsTab(req);

  res.status(201).json({ message: "bookingresponse received, emitting it to all connected clients." });
});

app.post("/acceptbookingresponse", (req, res) => {
  console.log("POST /acceptbookingresponse called");
  //console.log("req.body: " + JSON.stringify(req.body));
  
  updateMyBookingsTab(req);
  updateAvailableBookingsTab(req);

  res.status(201).json({ message: "acceptbookingresponse received, emitting it to all connected clients." });
});

app.post("/declinebookingresponse", (req, res) => {
  console.log("POST /declinebookingresponse called");
  //console.log("req.body: " + JSON.stringify(req.body));
  
  updateMyBookingsTab(req);
  updateAvailableBookingsTab(req);

  res.status(201).json({ message: "declinebookingresponse received, emitting it to all connected clients." });
});

app.post("/withdrawbookingresponse", (req, res) => {
  console.log("POST /withdrawbookingresponse called");
  //console.log("req.body: " + JSON.stringify(req.body));
  
  updateMyBookingsTab(req);
  updateAvailableBookingsTab(req);

  res.status(201).json({ message: "withdrawbookingresponse received, emitting it to all connected clients." });
});

app.post("/withdrawacceptbookingresponse", (req, res) => {
  console.log("POST /withdrawacceptbookingresponse called");
  //console.log("req.body: " + JSON.stringify(req.body));
  
  updateMyBookingsTab(req);
  updateAvailableBookingsTab(req);
  
  res.status(201).json({ message: "withdrawacceptbookingresponse received, emitting it to all connected clients." });
});

app.post("/cancelbooking", (req, res) => {
  console.log("POST /cancelbooking called");
  //console.log("req.body: " + JSON.stringify(req.body));
  
  updateMyBookingsTab(req);
  updateAvailableBookingsTab(req);

  res.status(201).json({ message: "cancelbooking received, emitting it to all connected clients." });
});

function updateMyBookingsTab(req) {
  const updatedBooking = JSON.parse(JSON.stringify(req.body));
  for (const response of updatedBooking.bookingResponses || []) {
    const responderUserSocket = serverUpdatesConnectedSockets.find(
      (s) => s.userName === response.responder.username
    );

    if (responderUserSocket) {
      console.log("Emitting updateMyBookingsTab to responder: " + responderUserSocket.userName);

      // Create a filtered copy of updatedBooking that only includes the response for this responder
      const filteredBooking = {
        ...updatedBooking,
        bookingResponses: updatedBooking.bookingResponses.filter(
          (r) => r.responder.username === response.responder.username
        ),
      };

      // If the overall booking status is CONFIRMED but this response is not ACCEPTED, that means another response has been ACCEPTED and we should set this status to CANCELLED 
      if (updatedBooking.status === "CONFIRMED" && response.responseStatus !== "ACCEPTED") {
        filteredBooking.status = "CANCELLED";
      }

      serverUpdates
        .to(responderUserSocket.socketId)
        .emit("updateMyBookingsTab", filteredBooking);
    }
  }  

  const initialBookerUserSocket = serverUpdatesConnectedSockets.find(s=>s.userName === updatedBooking.initialBookerUser?.username);
  if (initialBookerUserSocket)
  {
    console.log("Emitting updateMyBookingsTab to initialBookerUser: " + initialBookerUserSocket.userName);
    serverUpdates.to(initialBookerUserSocket.socketId).emit("updateMyBookingsTab", updatedBooking);
  }
}

function updateAvailableBookingsTab(req) {
  serverUpdatesConnectedSockets
    .filter(s => s.userName !== req.body.initialBookerUser?.username)
    .forEach(s => {
      const updatedBooking = JSON.parse(JSON.stringify(req.body));

      const filteredResponses = updatedBooking.bookingResponses?.filter(r => r.responder.username === s.userName);
      updatedBooking.responses = filteredResponses;

      if (updatedBooking.status === "CONFIRMED" && (!filteredResponses || filteredResponses.length === 0 || filteredResponses[0].responseStatus !== "ACCEPTED")) {
        console.log("Setting updatedBooking.status to CANCELLED for user: " + s.userName);

        updatedBooking.status = "CANCELLED";
      }
      console.log("Emitting updateAvailableBookingsTab to: " + s.userName + " filteredResponses: " + JSON.stringify(filteredResponses));
      console.log(updatedBooking);
      serverUpdates.to(s.socketId).emit("updateAvailableBookingsTab", updatedBooking);
    });
}



io.on('connection', (socket) => {

    const userName = socket.handshake.auth.userName;
    const password = socket.handshake.auth.password;
    const practice = socket.handshake.auth.practice;
    console.log(`${userName} connected with socketId: ${socket.id} default NS for practice: ${practice}`);

    if(password !== "x"){
        socket.disconnect(true);
        return;
    }
    addDefaultSocketId(userName, socket.id, practice);
    if(practice === "anypractice") {
      practices
        .filter(p => p.name !== "anypractice") // TODO: detta finna på många ställen, ersätt det med en hjälpfunktion (obs. vissa har forEach och and some)
        .forEach(p => socket.join(p.name));
    } else {
      socket.join(practice);
    }

    //test connectivity
    socket.on('test',ack=>{
        ack('pong')
    })

    //This is used to send hangUp notifications
    socket.on('notify',({ receiver, message })=>{
        if(connectedSockets.find(s=>s.userName === receiver))
        {
        console.log("socket.on() notify called by: " +  userName + " with message: " + message + ". Sending it both to: " + receiver + " and : " + userName);
        const socketToAnswer = connectedSockets.find(s=>s.userName === receiver)
        
        // Send to receiver
        socket.to(socketToAnswer.defaultSocketId).emit('notification', message);
        // Send to sender (yourself)
        socket.emit('notification', message);
        } else {
            console.log("Could not find socket to send notify to: " + receiver)
        }
    })

    socket.on('newOffer',newOffer=>{
        offers.push({
            offererUserName: userName,
            offer: newOffer,
            offerIceCandidates: [],
            answererUserName: null,
            answer: null,
            answererIceCandidates: []
        })
        // console.log(newOffer.sdp.slice(50))
        //send out to all connected sockets EXCEPT the caller
        console.log("newOffer. Recieved. Practice: " + practice + " from user: " + userName + ". Emmiting newOfferAwaiting.");

        const socketOfMatch = connectedSockets.find(s=>s.acceptedMatchFinal === userName); // TODO vill man optimera här hade man kunnat tidigare kunnat spara socketId istället för username som acceptedMatchFinal så slipper man kalla find() här
        //console.log("newOffer. Emitting newOfferAwaiting to: " + socketOfMatch.userName + " with socketId: " + socketOfMatch.defaultSocketId + " by user: " + userName);
        socket.to(socketOfMatch.defaultSocketId).emit('newOfferAwaiting',offers.slice(-1))
    })

    socket.on('newAnswer',(offerObj,ackFunction)=>{
        //emit this answer (offerObj) back to CLIENT1
        //in order to do that, we need CLIENT1's socketid
        const socketToAnswer = connectedSockets.find(s=>s.userName === offerObj.offererUserName)
        if(!socketToAnswer){
            console.log("No matching socket")
            return;
        }
        //we found the matching socket, so we can emit to it!
        const socketIdToAnswer = socketToAnswer.defaultSocketId;
        //we find the offer to update so we can emit it
        const offerToUpdate = offers.find(o=>o.offererUserName === offerObj.offererUserName)
        if(!offerToUpdate){
            console.log("No OfferToUpdate")
            return;
        }
        //send back to the answerer all the iceCandidates we have already collected
        //console.log(offerToUpdate.offerIceCandidates)
        ackFunction(offerToUpdate.offerIceCandidates);
        offerToUpdate.answer = offerObj.answer
        offerToUpdate.answererUserName = userName
        //socket has a .to() which allows emiting to a "room"
        //every socket has it's own room
        console.log("newAnswer. Sending back ice candidates to answerer. Requested offerer: " + offerObj.offererUserName+ " with socketIdToAnswer: " + socketIdToAnswer + " answerer: " + userName + " with socketId: " + socket.id);
        io.to(socketIdToAnswer).emit('answerResponse',offerToUpdate) // TODO ändra detta till socket.to istället för io.to
    })

    socket.on('sendIceCandidateToSignalingServer',iceCandidateObj=>{
        const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj;
        if(didIOffer){
            //this ice is coming from the offerer. Send to the answerer
            const offerInOffers = offers.find(o=>o.offererUserName === iceUserName);
            if(offerInOffers){
                console.log("Received ice C. from offerer: " + offerInOffers.offererUserName);
                offerInOffers.offerIceCandidates.push(iceCandidate)
                // 1. When the answerer answers, all existing ice candidates are sent
                // 2. Any candidates that come in after the offer has been answered, will be passed through
                if(offerInOffers.answererUserName){
                    console.log("Found the answerer username: " + offerInOffers.answererUserName);
                    //pass it through to the other socket
                    const socketToSendTo = connectedSockets.find(s=>s.userName === offerInOffers.answererUserName);
                    if(socketToSendTo){
                        socket.to(socketToSendTo.defaultSocketId).emit('receivedIceCandidateFromServer',iceCandidate)
                    }else{
                        console.log("Ice candidate recieved but could not find answere")
                    }
                }
            }
        }else{
            //this ice is coming from the answerer. Send to the offerer
            //pass it through to the other socket
            const offerInOffers = offers.find(o=>o.answererUserName === iceUserName);
            const socketToSendTo = connectedSockets.find(s=>s.userName === offerInOffers.offererUserName);
            if(socketToSendTo){
                socket.to(socketToSendTo.defaultSocketId).emit('receivedIceCandidateFromServer',iceCandidate)
            }else{
                console.log("Ice candidate recieved but could not find offerer")
            }
        }
    })

    socket.on('disconnect',()=>{
        console.log("Client disconnected from default NS: " + userName + " with socketId: " + socket.id)
        const offerToClear = offers.findIndex(o=>o.offererUserName === userName)
        offers.splice(offerToClear,1)
        socket.emit('availableOffers',offers);

        const socketIndex = connectedSockets.findIndex(s => s.userName === userName);
        if (socketIndex !== -1) {
          connectedSockets.splice(socketIndex, 1);
        }
    })
})

const findMatchMap = {};
for (const practice of practices) {
  findMatchMap[practice.name] = {
    practice: practice.name,
    queue: new Queue(),
  };
}
var namespaceSocketServer;
const matchedPairs = []; // This will hold pairs of users who have accepted each other

io.of("/matching").on("connection", socket => {

    const userName = socket.handshake.auth.userName;
    const password = socket.handshake.auth.password;
    const practice = socket.handshake.auth.practice;
    console.log(`${userName} connected with socketId: ${socket.id} matching NS`);

    const senderSocketId = socket.id;
    namespaceSocketServer = io.of("/matching");

    if(password !== "x")
    {
        socket.disconnect(true);
        return;
    }

    addMatchingSocketId(userName, socket.id);

    if(practice === "anypractice") {
      practices
        .filter(p => p.name !== "anypractice")
        .forEach(p => socket.join(p.name));
    } else {
      socket.join(practice);
    }    

    socket.on('findMatch', (data, ackFunction) => {
        if(practice === "anypractice") {
          practices
            .filter(p => p.name !== "anypractice")
            .some(p => findMatch(userName, socket.id, p.name, ackFunction));
        } else {
          findMatch(userName, socket.id, practice, ackFunction);
        }
        // if theackFunction has already been called then this will never reach the client which is desired here.
        ackFunction(false);  
    })

    socket.on('acceptMatch', (answerResponse, ackFunction) => {
        if(!userIsPairedInMatch(userName))
        {
            console.log("acceptMatch. User " + userName + " is not matched with anyone, cannot accept or decline match.");
            return;
        }
        if (answerResponse === true)
        {
            const currentPractice = acceptCall(userName);
            if (bothAcceptedCall(userName)) 
              {
                const currentSocket = connectedSockets.find(s=>s.userName === userName);
                const socketOfMatch = connectedSockets.find(s=>s.userName === getPairedUserOf(userName));
                const socketIdOfMatch = socketOfMatch.matchingSocketId;
                console.log("acceptMatch. called by: " + userName + " with answerResponse: " + answerResponse + ". Both users have accepted the match. Emitting matchMutuallyAccepted to both users: " + userName +  " " + senderSocketId +" who will be offerer and " + socketOfMatch.userName + " " + socketIdOfMatch + " who will be answerer.");

                namespaceSocketServer.to(senderSocketId).emit('matchMutuallyAccepted', {role: "Offerer", practice: currentPractice});
                namespaceSocketServer.to(socketIdOfMatch).emit('matchMutuallyAccepted', {role: "Answerer", practice: currentPractice});

                currentSocket.acceptedMatchFinal = socketOfMatch.userName;  // TODO vill man optimera här hade man kunnat spara socketId istället för username så slipper man kalla find() igen senare
                socketOfMatch.acceptedMatchFinal = userName;

                removePairByUsernameInMatchedPairs(userName);

                if(practice === "anypractice") {
                  practices
                    .filter(p => p.name !== "anypractice")
                    .forEach(p => findMatchMap[p.name].queue.removeByUserName(userName));
                } else {
                  findMatchMap[practice].queue.removeByUserName(userName);
                }  
  /*
              socket.disconnect(true);


              const socketToDisconnect = io.of("/matching").sockets.get(socketIdOfMatch).disconnect(true);

              if (socketToDisconnect) {
                socketToDisconnect.disconnect(true);
                console.log(`✅ Disconnected ${userToKick.userName} from ${userToKick.namespace}`);
              } else {
                console.warn(`⚠️ No socket found in ${userToKick.namespace} for ID ${userToKick.socketId}`);
              }


              console.log("disconnected both sockets after match accepted");*/
              }
              else
              {
                console.log("acceptMatch. Both users have not yet accepted the match, only one has: " + userName);
              }
        }
        else
        {
            const socketOfMatch = connectedSockets.find(s=>s.userName === getPairedUserOf(userName));

            namespaceSocketServer.to(senderSocketId).emit('matchDeclined');
            namespaceSocketServer.to(socketOfMatch.matchingSocketId).emit('matchDeclined');

            console.log("findMatch. Match got declined by: " + userName);
            const otherUsername = getPairedUserOf(userName);
            if (practice === "anypractice") {
              practices
                .filter(p => p.name !== "anypractice")
                .some(p => {
                  declineCall(userName, otherUsername, p.name);
                  return findMatch(userName, socket.id, p.name)});
                  
              if (socketOfMatch.practice === "anypractice") {
                practices
                  .filter(p => p.name !== "anypractice")
                  .some(p => findMatch(otherUsername, socketOfMatch.matchingSocketId, p.name));
              }
              else {
                findMatch(otherUsername, socketOfMatch.matchingSocketId, socketOfMatch.practice);
              }
            } else {
              declineCall(userName, otherUsername, practice);
              findMatch(userName, socket.id, practice);
              if (socketOfMatch.practice === "anypractice") {
                practices
                  .filter(p => p.name !== "anypractice")
                  .some(p => findMatch(otherUsername, socketOfMatch.matchingSocketId, p.name));
              }
              else {
                findMatch(otherUsername, socketOfMatch.matchingSocketId, practice);
              }
              
            }  


        }
    })

    socket.on('disconnect',()=>{
        console.log("Client disconnected from matching NS: " + userName + " with socketId: " + socket.id + " practice: " + practice);
        if(practice === "anypractice") {
          practices
            .filter(p => p.name !== "anypractice")
            .forEach(p => removeUserFromFindMatchQueue(userName, p.name));
        } else {
          removeUserFromFindMatchQueue(userName, practice);
        } 

        if(userIsPairedInMatch(userName)) 
        {
          const otherUsername = getPairedUserOf(userName);
          const socketOfMatch = connectedSockets.find(s=>s.userName === otherUsername);
          const socketIdOfMatch = socketOfMatch.matchingSocketId;
          const currentPractice = socketOfMatch.practice;
          removePairByUsernameInMatchedPairs(userName);
          namespaceSocketServer.to(socketIdOfMatch).emit('matchDeclined');
          if(currentPractice === "anypractice") {
            practices
              .filter(p => p.name !== "anypractice")
              .some(p => findMatch(otherUsername, socketIdOfMatch, p.name));
          } else {
            findMatch(otherUsername, socketIdOfMatch, currentPractice);          
          }
        }
    })
});


const serverUpdatesConnectedSockets = [
    //username, socketId
]

const serverupdatesRoom = "server-updates-room";
var serverUpdatesSocketServer;

io.of("/server-updates").on("connection", socket => {

    const userName = socket.handshake.auth.userName;
    const password = socket.handshake.auth.password;
    console.log(`${userName} connected with socketId: ${socket.id} server-updates NS`);

    const senderSocketId = socket.id;
    //namespaceSocketServer = io.of("/matching");

    if(password !== "x" || userName === null || userName === "null")
    {
        socket.disconnect(true);
        return;
    }

    serverUpdatesSocketServer = io.of("/server-updates");
    addServerUpdatesSocketId(userName, socket.id);
    socket.join(serverupdatesRoom); // 👈 JOIN ROOM HERE
    serverUpdatesSocketServer.emit('usersCurrentlyOnline', serverUpdatesConnectedSockets.length);

    socket.on('disconnect',()=>{
        console.log("Client disconnected from serverupdates NS: " + userName + " with socketId: " + socket.id );

        const socketIndex = serverUpdatesConnectedSockets.findIndex(s => s.userName === userName);
        if (socketIndex !== -1) {
          serverUpdatesConnectedSockets.splice(socketIndex, 1);
        }
        serverUpdatesSocketServer.emit('usersCurrentlyOnline', serverUpdatesConnectedSockets.length);
    })
});

function findMatch(userName, socketId, practice, ackFunction) {
  currentQueue = getQueueForPractice(practice);


  if(currentQueue.containsUserName(userName))
  {
      console.log("findMatch. User " + userName + " is already in the queue for practice: " + practice  + ", not adding again.");
      //if(ackFunction) ackFunction(false);
      return false;
  }

  if (!currentQueue.isEmpty()) 
  {  
    const matchSuggestion = currentQueue.dequeueFirstNotDeclined(userName, connectedSockets);

    if (matchSuggestion) {
      // TODO lägg till practice som parameter här
      addMatchedPair(userName, matchSuggestion.userName, practice);

      const socketIdOfMatch = connectedSockets.find(s=>s.userName === matchSuggestion.userName).matchingSocketId;

      namespaceSocketServer.to(socketIdOfMatch).emit('foundMatch', {userName: userName, chosenPractice: practice});

      if(ackFunction) 
      {
        console.log("findMatch. practice: " + practice + " called by userName: " + userName + ". Emitting foundMatch to " + matchSuggestion.userName + " with socketId: " + socketIdOfMatch + ". Returning matchSuggestion: " + matchSuggestion.userName);

        ackFunction({userName: matchSuggestion.userName, chosenPractice: practice});
        removeFromAllQueues(userName)
        removeFromAllQueues(matchSuggestion.userName)
      }
      else
      {
        console.log("findMatch. practice: " + practice + " alled by userName: " + userName + ". Emitting foundMatch to " + matchSuggestion.userName + " with socketId: " + socketIdOfMatch + ". AckFunction was not available so instead emitting foundMatch to " + userName + " with socketId: " + socketId);
        namespaceSocketServer.to(socketId).emit('foundMatch', {userName: matchSuggestion.userName, chosenPractice: practice});
        removeFromAllQueues(userName)
        removeFromAllQueues(matchSuggestion.userName)
      }
      return true;
    }
  }

  console.log("findMatch. User " + userName + " added to queue because queue was empty or had only users that had been declined. currentQueue size: " + currentQueue.size());
  enqeueForPractice({ userName, socketId: socketId }, practice);

  //if(ackFunction) ackFunction(false);
  return false;
}



function getQueueForPractice(practice) {
  console.log("trying to find queue for: " + practice)
  //console.log(findMatchMap);
  return findMatchMap[practice]?.queue;
}

function enqeueForPractice(queueItem, practice) {
  let currentQueue = getQueueForPractice(practice);
  currentQueue.enqueue(queueItem);
  findMatchMap[practice].queue = currentQueue;
  //console.log(queueItem, "placed in the queue. Current queue for practice", practice + ":", currentQueue.getItems());
}

function addMatchedPair(userA, userB, practice) {
  matchedPairs.push({
    userA,
    userB,
    accepted: {
      [userA]: null,
      [userB]: null,
    },
    practice: practice
  });
}

function acceptCall(acceptingUser) {
  const pair = matchedPairs.find(
    (p) => p.userA === acceptingUser || p.userB === acceptingUser
  );

  if (!pair) return;

  pair.accepted[acceptingUser] = true;

  return pair.practice;
}

function declineCall(decliningUser, otherUsername, practice) {
  removePairByUsernameInMatchedPairs(decliningUser);
  findMatchMap[practice].queue.removeByUserName(decliningUser); // TODO det känns som att dessa users ej borde finnas i kön eftersom dom är matchade vid detta tillfälle.
  findMatchMap[practice].queue.removeByUserName(otherUsername);

  addDeclinedMatch(decliningUser, otherUsername);
  addDeclinedMatch(otherUsername, decliningUser);
}

function bothAcceptedCall(userName) {
  const pair = matchedPairs.find(
    (p) => p.userA === userName || p.userB === userName
  );

  if (!pair) return false;

  const { userA, userB, accepted } = pair;
  return accepted[userA] && accepted[userB];
}

function rejectedCall(callPair) {
  return Object.values(callPair.accepted).some((status) => status === false);
}

function removeFromAllQueues(username) {
  console.log("removeFromAllQueues called for " + username)
  Object.values(findMatchMap)
    .forEach(fm => {fm.queue?.removeByUserName(username);
      //console.log("trying to remove " + username + " from queue of " + fm.practice + " queue: " + fm.queue);
      //console.log(fm.queue?.getItems());
    });
}

function getPairedUserOf(username) {
  const pair = matchedPairs.find(
    (p) => p.userA === username || p.userB === username
  );

  if (!pair) return null;

  return pair.userA === username ? pair.userB : pair.userA;
}

function userIsPairedInMatch(username) {
  return matchedPairs.some(
    (p) => p.userA === username || p.userB === username
  );
}

function addDefaultSocketId(userName, socketId, practice) {
  const existing = connectedSockets.find(s => s.userName === userName);
  if (existing) {
    existing.defaultSocketId = socketId;
    existing.practice = practice;
  } else {
    connectedSockets.push({ userName, defaultSocketId: socketId, practice: practice });
  }
}

function addMatchingSocketId(userName, socketId) {
  const existing = connectedSockets.find(s => s.userName === userName);
  if (existing) {
    existing.matchingSocketId = socketId;
  } else {
    connectedSockets.push({ userName, matchingSocketId: socketId });
  }
}

function addServerUpdatesSocketId(userName, socketId) {
  const existing = serverUpdatesConnectedSockets.find(s => s.userName === userName);
  if (existing) {
    existing.socketId = socketId;
  } else {
    serverUpdatesConnectedSockets.push({ userName, socketId: socketId });
  }
}


function addDeclinedMatch(userName, declinedMatch, findMatchMap) {
  const existing = connectedSockets.find(s => s.userName === userName);
  if (existing) {
    // If the property doesn't exist yet, initialize it as an empty array
    if (!existing.declinedMatches) {
      existing.declinedMatches = [];
    }
    // Add the new declined match
    existing.declinedMatches.push(declinedMatch);  
  } 
}

function removePairByUsernameInMatchedPairs(usernameToRemove) {
  for (let i = matchedPairs.length - 1; i >= 0; i--) {
    const pair = matchedPairs[i];
    if (pair.userA === usernameToRemove || pair.userB === usernameToRemove) {
      matchedPairs.splice(i, 1);
    }
  }
}

function removeUserFromFindMatchQueue(usernameToRemove, practice) {
  // TODO här kommer jag behöva göra detta för varje practice
  findMatchMap[practice].queue.items = findMatchMap[practice].queue.items.filter(item => item.userName !== usernameToRemove);
}

function usersHaveDeclinedEachOther(userA, userB) {
  const socketA = connectedSockets.find(s => s.userName === userA);
  const socketB = connectedSockets.find(s => s.userName === userB);
  if (!socketA || !socketB || !socketA.declinedMatches || !socketB.declinedMatches) return false;
  if (socketA.declinedMatches.includes(userB) || socketB.declinedMatches.includes(userA)) {
    return true;
  }
  return false;
}


const readline = require('readline');
const { json } = require('stream/consumers');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.on('line', (input) => {
  if (input.trim() === 'sockets') {
    console.log('connectedSockets:', connectedSockets);
  } else if (input.trim() === 'matches') {
    console.log('matchedPairs:', matchedPairs);
  } else if (input.trim() === 'map') {
    for (const findMatch of Object.values(findMatchMap)) {
      console.log('practice:', findMatch.practice);
      console.log('queue:', findMatch.queue.getItems());
    }
  } else if (input.trim() === 'queue') {
    console.log('No implementation for displaying queues yet.');
  } else if (input.trim() === 'all') {
    console.log('connectedSockets:', connectedSockets);
    console.log('matchedPairs:', matchedPairs);
    console.log('findMatchMap:', findMatchMap);
    console.log('serverUpdatesConnectedSockets:', serverUpdatesConnectedSockets);
  }
  else if (input.trim() === 'server') {
    console.log('serverUpdatesConnectedSockets:', serverUpdatesConnectedSockets);
  } else if (input.trim() === 'count') {
    console.log("Active sockets. io:", io.engine.clientsCount);  
    console.log("Active sockets. serverUpdates:", serverUpdates.engine.clientsCount);  
  } else if (input.trim() === '') {
  } else if (input.trim() === 'exit') {
    console.log('Exiting...');
    rl.close();
    process.exit(0);
  } else {
    console.log(`Unknown command: ${input}`);
  }
});