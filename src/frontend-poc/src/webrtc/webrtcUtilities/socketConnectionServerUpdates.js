import { io } from 'socket.io-client';
const signalingServerServerUpdatesURL = import.meta.env.VITE_SIGNALING_SERVER_SERVER_UPDATES_URL;

let socket;
const socketConnectionServerUpdates = (userName) =>{
    //check to see if the socket is already connected
    if(socket && socket.connected){
        //if so, then just return it so whoever needs it, can use it
        return socket;
    }else{
        console.log("socketConnectionServerUpdates. trying to connect from user: " + userName + " to URL: " + signalingServerServerUpdatesURL);
        //its not connected... connect!
         //socket = io.connect('http://localhost:8181',{
         socket = io.connect(signalingServerServerUpdatesURL,{
            //'https://4.177.9.39',{ chatgpt mentioned this but with wss:// instead of https://
            //transports: ['websocket'],
            //secure: true,
            auth: {
                // jwt,
                password: "x",
                userName, 
            }
        });
        if(userName == 'test'){
            console.log("Testing...")
            const ping = socket.emitWithAck('test').then(resp=>{
                console.log(resp)
            })
        }
        
        return socket;
    }
}

const disconnectSocket = () => {
  if (socket) {
    console.log("Disconnecting socket...");
    socket.disconnect();
    socket = null;
  }
};

const getCurrentSocket = () => socket;

export {
  socketConnectionServerUpdates,
  disconnectSocket,
  getCurrentSocket
};