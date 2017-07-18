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
    props: ['seriesData', 'seriesName', 'title'],
    watch: {
      seriesData: function (data) {
        // dirty hack, because chart don't draw on first data update
        this.chart.series[0].data = data
      }
    },
    data: function () {
      return {
        items: this.seriesName,
        loading: false,
        chart: {
          title: {
            text: this.title
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [{
            name: this.seriesName,
            type: 'pie',
            radius: ['50%', '60%'],
            data: this.seriesData,
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true,
                position: 'outside'
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
    }
  }
</script>

<style scoped>
  .echarts {
    width: 400px;
    height: 400px;
  }
</style>
