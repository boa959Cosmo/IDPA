import { io } from 'socket.io-client';

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection() {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
    let test = this.socket.on('frame', (data)=> {
      console.log(data);
    })
    console.log(test);
    
  }
 


  
}

export default new SocketioService();
