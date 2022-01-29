<template>
  <div>
    <img v-bind:src="this.data.camera"/>
  </div>
</template>

<script>
//import SocketioService from './services/socketio.service.js';
import io from 'socket.io-client'


export default {
  name: 'App',
  components: {},
  data() {
    return{
      data: {},
      socket : io('188.63.53.11:3000')
    }
  },
  mounted() {
    //this.socket.connect()
    //this.socket.connect('188.63.53.11')
    /*
    this.socket.on('test', (foo)=> {
      console.log(foo);
    })
    */
    this.socket.on('data', (data)=> {
      this.data = JSON.parse(data)
      this.data.camera = "data:image/jpeg;base64, " + this.data.camera
      console.log(this.data.camera)
      console.log(this.data.telemetry.TEMPERATURE)
    })
  }
}
</script>

<style>


</style>
