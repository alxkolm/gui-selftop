<template>
  <div>
    <v-layout row wrap>
      <v-flex xs2>
        <Donut v-bind:series-data="processDonut" title="Processes" @mouseover="onProcessMouseOver"></Donut>
        <Donut v-bind:series-data="mclClusterDonut" title="Markov Clusters" @mouseover="onMclClusterMouseOver"></Donut>
        <Donut v-bind:series-data="titleClusterDonut" title="Title Clusters" @mouseover="onTitleClusterMouseOver"></Donut>
      </v-flex>
      <v-flex xs3>
        <div id="title-list">
          <div v-for="win in titleList" class="title-item">
            <div class="duration">{{formatDuration(win.time)}}</div>
            <div class="win-title">{{win.title}}</div>
          </div>
        </div>
      </v-flex>
      <v-flex xs3>

      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import Donut from './Donut.vue'
  import Helpers from '../helpers'

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
            sum[value.process_id] = {value: 0, name: value.process_id, textLabel: value.process_name}
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
      onProcessMouseOver (d) {
        console.log('d.data.name', d.data.name)
        let windowIds = this.windows.filter((a) => a.process_id === d.data.name).map((a) => a.id)
        this.setWindowsList(windowIds)
      },
      ...mapMutations([
        'setWindowsList'
      ]),
      formatDuration: (seconds) => Helpers.formatDuration(seconds)
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

  #title-list {
    text-align: left;
    font-size: 10px;
  }

  #title-list > div:nth-child(even) {
    background-color: #444;
  }
  .title-item:after {
    content: "";
    display: table;
    clear: both;
  }
  #title-list .duration {
    width: 10%;
    float: left;
    display: inline-block;
  }
  #title-list .win-title {
    width: 87%;
    float: right;
  }
</style>
