<template>
    <header>
      <AdminHeader />
    </header>
    <main>
        <div class="report-container">
            <div class="report-title">신고 관리</div>
            <div class="report-header">
                <div class="cell">번호</div>
                <div class="cell">신고유형</div>
                <div class="cell">신고일</div>
                <div class="cell">신고자</div>
                <div class="cell">신고내용</div>
                <div class="cell">처리상태</div>
                <div class="cell">승인여부</div>
            </div>
            <div>
            <ReportBox
            v-for="report in paginatedReports"
            :key="report.reportNum"
            :id="report.reportNum"
            :type="report.reportType"
            :date="report.reportTime"
            :reporter="report.clientNickname"
            :content="report.reportContent"
            :status="report.reportStatus"/>
            </div>
        </div>
        <div class="pagenation">
          <Pagenation :totalPages="totalPages" @change="handlePageChange"/>
        </div>
    </main>
</template>
  
<script setup>
  import { ref, computed, onMounted } from 'vue';
  import AdminHeader from '@/components/header/AdminHeader.vue';
  import ReportBox from '@/components/report/ReportBox.vue';
  import Pagenation from '@/components/pagenation/Pagenation.vue';
  import axios from '@/utils/axios'

  const reports = ref([]);
  const pageSize = 8;
  const currentPage = ref(1);

  const totalPages = computed(() => Math.ceil(reports.value.length / pageSize));

  const paginatedReports = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    return reports.value.slice(start, end);
  });

  function handlePageChange(newPage) {
    currentPage.value = newPage;
  }

  onMounted(async () => {
    try {
      const res = await fetch('http://localhost:8080/reports');
      let data = await res.json();
      reports.value = data;
    } catch (err) {
      console.error('데이터 로딩 실패:', err);
    }
  });
</script>

<style scoped>
  .report-container {
    max-width: 892px; /* 너비 넉넉히 잡음 */
    margin: 150px auto 0;
    padding: 0 40px; /* 좌우 여백 */
  }

  .report-title {
      color: #000000;
      font-size: 32px;
      text-align: center;
      margin-bottom: 50px;
  }

  .report-header {
    display: grid;
    grid-template-columns:
      105px    /* 번호 */
      130px   /* 신고유형 */
      130px   /* 신고일 */
      130px   /* 신고자 */
      130px   /* 신고내용 */
      130px   /* 처리상태 */
      130px;  /* 승인여부 */
    align-items: center;
    font-weight: bold;
    font-size: 17px;
    padding: 14px 0;
    border-bottom: 1.5px solid #000;
    text-align: center;
  }

  .cell {
    text-align: center;
  }

  .pagenation {
    position: absolute;   /* 또는 fixed */
    top: 900px;
    left: 50%;           
    transform: translateX(-50%);
  }
</style>
