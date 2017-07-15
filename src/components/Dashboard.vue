<template>
  <div>
    <h6>Windows</h6>
    <ul v-for="win in windows">
      <li>{{win.title}}</li>
    </ul>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'dashboard',
    computed: mapState({
      windows: state => state.windows
    })
  }
</script>
