import { io } from 'socket.io-client';


class SocketioService {
  constructor() {}

  async setupSocketConnection() {
    let socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
    var test
    socket.on('frame', (data)=> {
      console.log(data)
    })
    console.log(test);
    
  }
 


  
}

export default new SocketioService();

