<template>
    <div class="summary-graph">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
  
  // Chart.js 기본 요소 등록
  Chart.register(DoughnutController, ArcElement, Tooltip, Legend)
  
  const chartCanvas = ref(null)
  
  onMounted(() => {
    const ctx = chartCanvas.value.getContext('2d')
  
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['완료', '미완료'],
        datasets: [{
          data: [70, 30], // 예시로 70% 완료, 30% 미완료
          backgroundColor: ['#AEE1F7', '#F2F2F2'],
          borderWidth: 2,
          cutout: '40%'  // 가운데 뚫린 정도
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
  })
  </script>
  
  <style scoped>
  .summary-graph {
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }
  canvas {
    width: 100%;
    height: 100%;
  }
  </style>
  