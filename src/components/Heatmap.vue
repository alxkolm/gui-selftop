<template>
  <div class="echarts">
    <IEcharts :option="chart"></IEcharts>
  </div>
</template>

<script>
  import IEcharts from 'vue-echarts-v3/src/full.vue'

  export default {
    name: 'donut',
    components: {IEcharts},
    props: ['seriesData', 'yLabels', 'xLabels'],
    computed: {
      minXIndex: function () {
        return Math.min(...this.seriesData.map((a) => a[0])) || 0
      },
      maxXIndex: function () {
        return Math.max(...this.seriesData.map((a) => a[0]))
      },
      chart: function () {
        return {
          tooltip: {
            position: 'top'
          },
          animation: false,
          xAxis: {
            type: 'category',
            data: this.xLabels || [],
            min: this.minXIndex,
            max: this.maxXIndex,
            splitArea: {
              show: true
            },
            axisLine: {
              lineStyle: {
                color: '#eee'
              }
            }
          },
          yAxis: {
            type: 'category',
            data: this.yLabels || [],
            splitArea: {
              show: true
            },
            axisLine: {
              lineStyle: {
                color: '#eee'
              }
            }
          },
          visualMap: {
            min: 0,
            max: 100,
            calculable: true,
            orient: 'vertical',
            left: 'center',
            bottom: 0,
            show: false
          },
          series: [{
            name: 'Punch Card',
            type: 'heatmap',
            data: this.seriesData,
            label: {
              normal: {
                show: true
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
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
    width: 700px;
    height: 500px;
    position: relative;
  }
</style>
