<template>
  <div class="echarts">
    <IEcharts :option="chart"></IEcharts>
  </div>
</template>

<script>
  import IEcharts from 'vue-echarts-v3/src/full.vue'

  const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
    '7a', '8a', '9a', '10a', '11a',
    '12p', '1p', '2p', '3p', '4p', '5p',
    '6p', '7p', '8p', '9p', '10p', '11p']

  export default {
    name: 'donut',
    components: {IEcharts},
    props: ['seriesData', 'yLabels'],
    watch: {
      seriesData: function (data) {
        // dirty hack, because chart don't draw on first data update
        this.chart.series[0].data = data
        this.chart.visualMap.max = Math.max(...data.map((a) => a[2])) || 100
      },
      yLabels: function (data) {
        this.chart.yAxis.data = data
      }
    },
    data: function () {
      return {
        items: this.seriesName,
        loading: false,
        chart: {
          tooltip: {
            position: 'top'
          },
          animation: false,
          grid: {
            height: '50%',
            y: '10%'
          },
          xAxis: {
            type: 'category',
            data: hours,
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
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
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
    height: 700px;
    position: relative;
  }
</style>
