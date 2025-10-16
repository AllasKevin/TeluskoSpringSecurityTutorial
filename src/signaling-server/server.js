const Queue = require('./utils/Queue');
console.log("Server is starting...");

const fs = require('fs');
const https = require('https')
const http = require('http')
const express = require('express');
const app = express();
const socketio = require('socket.io');
app.use(express.static(__dirname))

////**MAJOR CHANGE**////

//we need a key and cert to run https
//we generated them with mkcert
// $ mkcert create-ca
// $ mkcert create-cert
const key = fs.readFileSync('./certs/192.168.0.110-key.pem');
const cert = fs.readFileSync('./certs/192.168.0.110.pem');

//we changed our express setup so we can use https
//pass the key and cert to createServer on https
 const expressServer = https.createServer({key, cert}, app);

//const expressServer = http.createServer(app);
//create our socket.io server... it will listen to our express port
const io = socketio(expressServer,{
    cors: {
        origin: [
            "https://localhost:3000",
            "https://localhost:3001",
            "https://192.168.0.110:3000",            
            "https://192.168.0.110:5173",            
            "https://192.168.0.110",            
            "http://localhost:3000",
            "http://localhost:3001",
            "http://192.168.0.110:3000",
            //"https://4.177.9.28", this is the old public IP of the server unning on AKS
            // 'https://LOCAL-DEV-IP-HERE' //if using a phone or another computer
        ],
        methods: ["GET", "POST"]
    }
});


expressServer.listen(8181);

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
    //username, socketId
]





io.on('connection', (socket) => {
    

    const userName = socket.handshake.auth.userName;
    const password = socket.handshake.auth.password;
    const practice = socket.handshake.auth.practice;
    console.log(`${userName} connected with socketId: ${socket.id} default NS for practice: ${practice}`);


    if(password !== "x"){
        socket.disconnect(true);
        return;
    }
    addDefaultSocketId(userName, socket.id);

    socket.join(practice); // 👈 JOIN ROOM HERE
    //console.log(`${userName} joined practice room: ${practice}`);
    // console.log(connectedSockets)

    //test connectivity
    socket.on('test',ack=>{
        ack('pong')
    })

    //This is used to send hangUp notifications
    socket.on('notify',({ receiver, message })=>{
        if(connectedSockets.find(s=>s.userName === receiver))
        {
        console.log("socket.on() notify called by: " + " username" + " with message: " + message + ". Sending it both to: " + receiver + " and : " + userName);
        const socketToAnswer = connectedSockets.find(s=>s.userName === receiver)
        
        // Send to receiver
        socket.to(socketToAnswer.defaultSocketId).emit('notification', message);
        // Send to sender (yourself)
        socket.emit('notification', message);
        } else {
            console.log("Could not find socket to send notify to: " + receiver)
        }
    })

    //a new client has joined. If there are any offers available,
    //emit them out
    if(offers.length){
        socket.emit('availableOffers',offers);
    }

    


    
    socket.on('newOffer',newOffer=>{
        console.log("newOffer!")
        console.log("Recieved Practice: " + practice);
        // console.log(newOffer)
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
        console.log("Emmiting newOfferAwaiting")
        socket.to(practice).emit('newOfferAwaiting',offers.slice(-1))
    })

    socket.on('newAnswer',(offerObj,ackFunction)=>{
        // console.log(offerObj);
        console.log(connectedSockets)
        console.log("Requested offerer",offerObj.offererUserName)
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
        console.log("Sending back ice candidates to answerer")
        //console.log(offerToUpdate.offerIceCandidates)
        ackFunction(offerToUpdate.offerIceCandidates);
        offerToUpdate.answer = offerObj.answer
        offerToUpdate.answererUserName = userName
        //socket has a .to() which allows emiting to a "room"
        //every socket has it's own room
        console.log(socketIdToAnswer)
        io.to(socketIdToAnswer).emit('answerResponse',offerToUpdate)
    })

    socket.on('sendIceCandidateToSignalingServer',iceCandidateObj=>{
        const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj;
        // console.log(iceCandidate);

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
        // console.log(offers)
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
const findMatchQueue = new Queue(); // TODO Jag kommer behöva en queue för varje practice

const matchedPairs = []; // This will hold pairs of users who have accepted each other

io.of("/matching").on("connection", socket => {


    const userName = socket.handshake.auth.userName;
    const password = socket.handshake.auth.password;
    const practice = socket.handshake.auth.practice;
    console.log(`${userName} connected with socketId: ${socket.id} matching NS`);

    const senderSocketId = socket.id;
    const namespaceSocketServer = io.of("/matching");

    if(password !== "x")
    {
        socket.disconnect(true);
        return;
    }

    addMatchingSocketId(userName, socket.id);


    socket.join(practice); // 👈 JOIN ROOM HERE
    console.log(`${userName} joined practice room: ${practice}`);

    socket.on('findMatch', (data, ackFunction) => {
        
        currentQueue = getQueueForPractice(practice);

        console.log("findMatch called! practice: " + practice + " userName: " + userName);

        if(currentQueue.containsUserName(userName))
        {
            console.log("User " + userName + " is already in the queue, not adding again.");
            ackFunction(false);
            return;
        }

        if (currentQueue.size() < 1) 
        {
            console.log("User " + userName + " added to queue because queue was empty. currentQueue size: " + currentQueue.size());
            enqeueForPractice({ userName, socketId: socket.id }, practice);

            console.log("Returning noMatchFound");
            ackFunction(false);
        }
        else
        {
            console.log("Match found for user: " + userName + "! currentQueue size: " + currentQueue.size());
            const matchSuggestion = currentQueue.dequeue();

            // TODO lägg till practice som parameter här
            addMatchedPair(userName, matchSuggestion.userName);

            const socketIdOfMatch = connectedSockets.find(s=>s.userName === matchSuggestion.userName).matchingSocketId;
            console.log(connectedSockets);

            console.log("Emitting foundMatch to " + matchSuggestion.userName + " with socketId: " + socketIdOfMatch + " and sending it: " + userName);
            namespaceSocketServer.to(socketIdOfMatch).emit('foundMatch', userName);

            console.log("Returning matchSuggestion: " + matchSuggestion.userName);
            ackFunction(matchSuggestion);
        }
    
    //socket.to(practice).emit('newOfferAwaiting',offers.slice(-1))
    })

    socket.on('acceptMatch', (answerResponse, ackFunction) => {
        console.log("acceptMatch called by: " + userName + " with answerResponse: " + answerResponse);
        if(!userIsPairedInMatch(userName))
        {
            console.log("User " + userName + " is not matched with anyone, cannot accept or decline match.");
            return;
        }

        if (answerResponse === true)
        {
            acceptCall(userName);
          
            if (bothAcceptedCall(userName)) 
              {
                console.log("Both users accepted the match: " + userName);

                const socketIdOfMatch = connectedSockets.find(s=>s.userName === getPairedUserOf(userName)).matchingSocketId;
                console.log("Emitting matchMutuallyAccepted to both users: " + userName +  " " + senderSocketId +" who will be offerer and " + getPairedUserOf(userName) + " " + socketIdOfMatch + " who will be answerer.");


                namespaceSocketServer.to(senderSocketId).emit('matchMutuallyAccepted', "Offerer");
                namespaceSocketServer.to(socketIdOfMatch).emit('matchMutuallyAccepted', "Answerer");

                removePairByUsernameInMatchedPairs(userName);

                findMatchQueue.removeByUserName(userName);
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
                console.log("both users have not yet accepted the match, only one has: " + userName);
              }
        }
        else
        {
            const socketIdOfMatch = connectedSockets.find(s=>s.userName === getPairedUserOf(userName)).matchingSocketId;

            console.log("Match got declined by: " + userName);
            declineCall(userName, socket, practice);

            namespaceSocketServer.to(senderSocketId).emit('matchDeclined');
            namespaceSocketServer.to(socketIdOfMatch).emit('matchDeclined');
        }
        

        //socket.to(practice).emit('newOfferAwaiting',offers.slice(-1))
    })

    socket.on('disconnect',()=>{
        console.log("Client disconnected from matching NS: " + userName + " with socketId: " + socket.id)
    })
});


function getQueueForPractice(practice) {
  findMatchMap[practice] = { practice: practice, queue: findMatchQueue };
  return findMatchMap[practice].queue;
}

function enqeueForPractice(queueItem, practice) {
  let currentQueue = getQueueForPractice(practice);
  currentQueue.enqueue(queueItem);
  findMatchMap[practice].queue = currentQueue;
  console.log(queueItem, "placed in the queue. Current queue for practice", practice + ":", currentQueue.getItems());
}

function addMatchedPair(userA, userB) {
  matchedPairs.push({
    userA,
    userB,
    accepted: {
      [userA]: null,
      [userB]: null,
    },
  });
}

function acceptCall(acceptingUser) {
  const pair = matchedPairs.find(
    (p) => p.userA === acceptingUser || p.userB === acceptingUser
  );

  if (!pair) return;

  pair.accepted[acceptingUser] = true;
}

function declineCall(decliningUser, socket, practice) {
  const otherUsername = getPairedUserOf(decliningUser);
  const socketIdOfMatch = connectedSockets.find(s=>s.userName === otherUsername).matchingSocketId;

  removePairByUsernameInMatchedPairs(decliningUser);
  findMatchQueue.removeByUserName(decliningUser);
  findMatchQueue.removeByUserName(otherUsername);

  enqeueForPractice({ userName: otherUsername, socketId: socketIdOfMatch }, practice);
  enqeueForPractice({ userName: decliningUser, socketId: socket.id }, practice);
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

function addDefaultSocketId(userName, socketId) {
  const existing = connectedSockets.find(s => s.userName === userName);
  if (existing) {
    existing.defaultSocketId = socketId;
  } else {
    connectedSockets.push({ userName, defaultSocketId: socketId });
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

function removePairByUsernameInMatchedPairs(usernameToRemove) {
  for (let i = matchedPairs.length - 1; i >= 0; i--) {
    const pair = matchedPairs[i];
    if (pair.userA === usernameToRemove || pair.userB === usernameToRemove) {
      matchedPairs.splice(i, 1);
    }
  }
}

function removeUserFromFindMatchQueue(usernameToRemove) {
  findMatchQueue.items = findMatchQueue.items.filter(item => item.userName !== usernameToRemove);
}