<template>
  <div class="echarts">
    <IEcharts :option="chart" @mouseover="mouseOver"></IEcharts>
    <div class="total">{{total}}</div>
  </div>
</template>

<script>
  import IEcharts from 'vue-echarts-v3/src/full.vue'
  import Helpers from '../helpers'

  export default {
    name: 'donut',
    components: {IEcharts},
    props: ['seriesData', 'seriesName', 'title'],
    watch: {
      seriesData: function (data) {
        // dirty hack, because chart don't draw on first data update
        this.chart.series[0].data = data
      }
    },
    computed: {
      total: function () {
        let total = this.seriesData.reduce((sum, value) => {
          return sum + value.value
        }, 0)
        return Helpers.formatDuration(total)
      },
      chart: function () {
        return {
          title: {
            text: this.title,
            textStyle: {
              color: '#bbb'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              let duration = Helpers.formatDuration(params.value)
              let label = params.data.textLabel || params.name
              return `${label}: ${duration} (${params.percent}%)`
            }
          },
          series: [{
            name: this.seriesName,
            type: 'pie',
            radius: ['40%', '70%'],
            data: this.seriesData,
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                position: 'inner',
                formatter: (params) => {
                  return params.percent > 10 ? params.data.textLabel || params.name : ''
                }
              },
              emphasis: {
                show: true
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            }
          }]
        }
      }
    },
    data: function () {
      return {
        loading: false
      }
    },
    methods: {
      mouseOver (ev, b, c) {
        this.$emit('mouseover', ev)
      }
    }
  }
</script>

<style scoped>
  .echarts {
    width: 300px;
    height: 300px;
    position: relative;
  }
  .total {
    position: absolute;
    top:134px;
    left: 100px;
    width: 100px;
  }
</style>
