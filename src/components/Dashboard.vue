<template>
  <div>
    <v-layout row wrap>
      <v-flex xs3>
        <v-layout row>
          <v-flex xs6>
            <Donut v-bind:series-data="processDonut" title="Processes" @mouseover="onProcessMouseOver"></Donut>
          </v-flex>
          <v-flex xs6>
            <Donut v-bind:series-data="recordClusterDonut" title="Record Clusters" @mouseover="onRecordClusterMouseOver"></Donut>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs6>
            <Donut v-bind:series-data="mclClusterDonut" title="Markov Clusters" @mouseover="onMclClusterMouseOver"></Donut>
          </v-flex>
          <v-flex xs6>
            <Donut v-bind:series-data="titleClusterDonut" title="Title Clusters" @mouseover="onTitleClusterMouseOver"></Donut>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs4>
        <Heatmap v-bind:series-data="recordClusterHeat.series" v-bind:y-labels="recordClusterHeat.ylabels"/>
        <Heatmap v-bind:series-data="mclClusterHeat.series" v-bind:y-labels="mclClusterHeat.ylabels"/>
      </v-flex>
      <v-flex xs5>
        <div id="title-list">
          <div v-for="win in titleList" class="title-item">
            <div class="duration">{{formatDuration(win.time)}}</div>
            <div class="win-title">{{win.title}} (#{{win.id}})</div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapGetters} from 'vuex'
  import Donut from './Donut.vue'
  import Heatmap from './Heatmap.vue'
  import Helpers from '../helpers'
  import moment from 'moment'

  export default {
    name: 'dashboard',
    computed: {
      ...mapState({
        windows: state => state.windows,
        processes: state => state.processes,
        records: state => state.records,
        mclClusters: state => state.mclClusters,
        titleClusters: state => state.titleClusters,
        windowsList: state => state.windowsList,
        recordsList: state => state.recordsList,
        recordClusters: state => state.recordClusters
      }),
      ...mapGetters([
        'windowsMap'
      ]),
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
      recordClusterDonut: function () {
        const durations = this.records.reduce((sum, value) => {
          let clusterLabel = this.recordClusters[value.id]
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
        console.log('sss', this.$store.getters)
        console.log('this.getWindowsMap', this.windowsMap)
        let winList
        console.log('this.recordsList', this.recordsList)
        winList = this.records.reduce((sum, record) => {
          if (!this.recordsList.includes(record.id)) {
            return sum
          }
          let windowId = record.window_id
          if (!(windowId in sum)) {
            sum[windowId] = { id: windowId, time: 0, title: this.windowsMap && windowId in this.windowsMap ? this.windowsMap[windowId].title : '' }
          }
          sum[windowId].time += record.duration
          return sum
        }, {})
        console.log('winList', winList)
        winList = Object.values(winList)
        winList.sort((a, b) => b.time - a.time)
        console.log('winList', winList)
        return winList
      },
      recordClusterHeat: function () {
        let durations = this.records.reduce((sum, record) => {
          let clusterId = this.recordClusters[record.id]
          let hour = moment(record.start).hour()
          if (sum[clusterId] === undefined) {
            sum[clusterId] = {}
          }

          if (sum[clusterId][hour] === undefined) {
            sum[clusterId][hour] = 0
          }

          sum[clusterId][hour] += record.duration

          return sum
        }, {})
        let clusterList = Object.keys(durations)
        let data = Object.entries(durations).reduce((sum, [cluster, hours]) => {
          Object.entries(hours).reduce((sum, [hour, duration]) => {
            sum.push([parseInt(hour), clusterList.indexOf(cluster), duration])
            return sum
          }, sum)
          return sum
        }, [])
        return {series: data, ylabels: clusterList}
      },
      mclClusterHeat: function () {
        let durations = this.records.reduce((sum, record) => {
          let clusterId = this.mclClusters[record.window_id]
          let hour = moment(record.start).hour()
          if (sum[clusterId] === undefined) {
            sum[clusterId] = {}
          }

          if (sum[clusterId][hour] === undefined) {
            sum[clusterId][hour] = 0
          }

          sum[clusterId][hour] += record.duration

          return sum
        }, {})
        let clusterList = Object.keys(durations)
        let data = Object.entries(durations).reduce((sum, [cluster, hours]) => {
          Object.entries(hours).reduce((sum, [hour, duration]) => {
            sum.push([parseInt(hour), clusterList.indexOf(cluster), duration])
            return sum
          }, sum)
          return sum
        }, [])
        return {series: data, ylabels: clusterList}
      }
    },
    methods: {
      onMclClusterMouseOver (d) {
        let windowIds = Object.entries(this.mclClusters).filter((a) => a[1] === d.data.name).map((a) => parseInt(a[0], 10))
        this.setWindowsList(windowIds)
      },
      onRecordClusterMouseOver (d) {
        let recordsIds = Object.entries(this.recordClusters).filter((a) => a[1] === d.data.name).map((a) => parseInt(a[0], 10))
        console.log(recordsIds)
        this.setRecordsList(recordsIds)
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
        'setWindowsList',
        'setRecordsList'
      ]),
      formatDuration: (seconds) => Helpers.formatDuration(seconds)
    },
    components: {
      Donut,
      Heatmap
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
    font-size: 12px;
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
