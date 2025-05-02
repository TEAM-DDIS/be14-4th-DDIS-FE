<template>
  <v-chart class="donut-chart" :option="chartOption" autoresize />
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps({
  doneCount: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    default: 1
  }
})

const percent = computed(() => {
  const done = props.doneCount || 0
  const total = props.totalCount || 1
  return Math.round((done / total) * 100)
})

const chartOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
  series: [
    {
      type: 'pie',
      radius: ['60%', '80%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: `${percent.value}%`,
        fontSize: 20,
        fontWeight: 'bold'
      },
      labelLine: { show: false },
      data: [
        { value: props.doneCount, name: '완료', itemStyle: { color: '#50D4C6' } },
        { value: props.totalCount - props.doneCount, name: '미완료', itemStyle: { color: '#eee' } }
      ]
    }
  ]
}))
</script>

<style scoped>
.donut-chart {
  width: 160px;
  height: 160px;
  margin: auto;
}
</style>
