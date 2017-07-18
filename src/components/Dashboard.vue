<template>
  <div>
    <Donut v-bind:series-data="processDonut" title="asd"></Donut>
    <h6>Windows</h6>
    <ul v-for="win in windows">
      <li>{{win.title}}</li>
    </ul>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Donut from './Donut.vue'

  export default {
    name: 'dashboard',
    computed: {
      ...mapState({
        windows: state => state.windows,
        processes: state => state.processes,
        records: state => state.records
      }),
      processDonut: function () {
        console.log('get processDonut()')
        const durations = this.records.reduce((sum, value) => {
          if (sum[value.process_id] === undefined) {
            sum[value.process_id] = {value: 0, name: value.process_name}
          }
          sum[value.process_id].value += value.duration
          return sum
        }, {})
        console.log('Dashboard::processDonut durations', Object.values(durations))
        return Object.values(durations)
      }
    },
    components: {
      Donut
    }
  }
</script>

<style scoped>
  .echarts {
    width: 400px;
    height: 400px;
  }
</style>
