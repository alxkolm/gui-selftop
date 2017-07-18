<template>
  <div>
    <Donut v-bind:series-data="processDonut" title="Processes"></Donut>
    <Donut v-bind:series-data="mclClusterDonut" title="Markov Clusters"></Donut>
    <Donut v-bind:series-data="titleClusterDonut" title="Title Clusters"></Donut>
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
        records: state => state.records,
        mclClusters: state => state.mclClusters,
        titleClusters: state => state.titleClusters
      }),
      processDonut: function () {
        const durations = this.records.reduce((sum, value) => {
          if (sum[value.process_id] === undefined) {
            sum[value.process_id] = {value: 0, name: value.process_name}
          }
          sum[value.process_id].value += value.duration
          return sum
        }, {})
        return Object.values(durations).sort((a, b) => {
          return b.value - a.value
        })
      },
      mclClusterDonut: function () {
        const durations = this.records.reduce((sum, value) => {
          let clusterLabel = this.mclClusters[value.window_id]
          if (sum[clusterLabel] === undefined) {
            sum[clusterLabel] = {value: 0, name: clusterLabel}
          }
          sum[clusterLabel].value += value.duration
          return sum
        }, {})
        return Object.values(durations).sort((a, b) => {
          return b.value - a.value
        })
      },
      titleClusterDonut: function () {
        const durations = this.records.reduce((sum, value) => {
          let clusterLabel = this.titleClusters[value.window_id]
          if (sum[clusterLabel] === undefined) {
            sum[clusterLabel] = {value: 0, name: clusterLabel}
          }
          sum[clusterLabel].value += value.duration
          return sum
        }, {})
        return Object.values(durations).sort((a, b) => {
          return b.value - a.value
        })
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
