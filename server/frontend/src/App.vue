<template>
  <img v-bind:src="this.camera.frame">
</template>

<script>
import SocketioService from './services/socketio.service.js';

export default {
  name: 'App',
  components: {},
  data() {
    return{
      camera: {
        frame: ''
      }
    }
  },
  created() {
    SocketioService.setupSocketConnection();
  },
  mounted() {

  }
}
</script>

<style>


</style>
