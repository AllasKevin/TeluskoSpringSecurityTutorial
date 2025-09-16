import { io } from 'socket.io-client';

let socket;
const socketConnection = (userName, chosenPractice) =>{
    //check to see if the socket is already connected
    if(socket && socket.connected){
        //if so, then just return it so whoever needs it, can use it
        return socket;
    }else{
        console.log("trying to send: " + chosenPractice + " from user: " + userName);
        //its not connected... connect!
         //socket = io.connect('http://localhost:8181',{
         socket = io.connect('https://192.168.0.110:8181',{
            //'https://4.177.9.39',{ chatgpt mentioned this but with wss:// instead of https://
            //transports: ['websocket'],
            //secure: true,
            auth: {
                // jwt,
                password: "x",
                userName, 
                practice: chosenPractice,
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
  socketConnection,
  disconnectSocket,
  getCurrentSocket
};