<template>
  <div>
    <div style="width: 300px; float: left;">
      <Donut v-bind:series-data="processDonut" title="Processes"></Donut>
      <Donut v-bind:series-data="mclClusterDonut" title="Markov Clusters" @mouseover="onMclClusterMouseOver"></Donut>
      <Donut v-bind:series-data="titleClusterDonut" title="Title Clusters" @mouseover="onTitleClusterMouseOver"></Donut>
    </div>
    <div>
      <ul>
        <li v-for="win in titleList">{{win.title}} [{{formatDuration(win.time)}}]</li>
      </ul>
    </div>

  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import Donut from './Donut.vue'

  export default {
    name: 'dashboard',
    computed: {
      ...mapState({
        windows: state => state.windows,
        processes: state => state.processes,
        records: state => state.records,
        mclClusters: state => state.mclClusters,
        titleClusters: state => state.titleClusters,
        windowsList: state => state.windowsList
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
      },
      titleList: function () {
        console.log(this.windowsList)
        let a = this.windows.filter((win) => {
          return this.windowsList.includes(win.id)
        }).sort((a, b) => b.time - a.time)
        console.log('titleList', a)
        return a
      }
    },
    methods: {
      onMclClusterMouseOver (d) {
        let windowIds = Object.entries(this.mclClusters).filter((a) => a[1] === d.data.name).map((a) => parseInt(a[0], 10))
        this.setWindowsList(windowIds)
      },
      onTitleClusterMouseOver (d) {
        let windowIds = Object.entries(this.titleClusters).filter((a) => a[1] === d.data.name).map((a) => parseInt(a[0], 10))
        this.setWindowsList(windowIds)
      },
      formatDuration (seconds) {
        let result = ''
        let min, sec, day, hour
        if (seconds < 1) {
          result = '< 1s'
        } else if (seconds < 60) {
          result = Math.floor(seconds) + 's'
        } else if (seconds < 60 * 60) {
          min = Math.floor(seconds / 60)
          sec = Math.floor(seconds - (min * 60))
          result = min + 'm' + sec + 's'
        } else if (seconds < 60 * 60 * 24) {
          hour = Math.floor(seconds / (60 * 60))
          min = Math.floor((seconds - hour * 60 * 60) / 60)
          sec = Math.floor(seconds - (hour * 60 * 60) - (min * 60))
          result = hour + 'h' + min + 'm' + sec + 's'
        } else {
          day = Math.floor(seconds / (60 * 60 * 24))
          hour = Math.floor((seconds - day * 60 * 60 * 24) / 60)
          min = Math.floor((seconds - hour * 60 * 60) / 60)
          sec = Math.floor(seconds - (day * 60 * 60 * 24) - (hour * 60 * 60) - (min * 60))
          result = day + 'd' + hour + 'h' + min + 'm' + sec + 's'
        }
        return result
      },
      ...mapMutations([
        'setWindowsList'
      ])
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
