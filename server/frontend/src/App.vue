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
      socket : io('localhost:3000')
    }
  },
  mounted() {
    this.socket.on('data', (data)=> {
      this.data = JSON.parse(data)
      this.data.camera = "data:image/jpg;base64, " + this.data.camera
      console.log(this.data.camera)
      console.log(this.data.telemetry.TEMPERATURE)
    })
  }
}
</script>

<style>


</style>
