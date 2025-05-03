<template>
    <div class="report-row">
      <div class="cell">{{ id }}</div>
      <div class="cell">{{ displayType }}</div>
      <div class="cell">{{ date }}</div>
      <div class="cell">{{ reporter }}</div>
      <div class="cell">{{ content }}</div>
      <div class="cell">{{ currentStatus }}</div>
      <div class="cell"></div>
      <div class="cell">
        <img
          src="../../assets/icons/check-icon.svg"
          alt="승인"
          class="icon clickable"
          :style="{ filter: checkColor, pointerEvents: isClicked ? 'none' : 'auto' }"
          @click="approve"
        />
        <img
          src="../../assets/icons/reject-icon.svg"
          alt="비승인"
          class="icon clickable"
          :style="{ filter: rejectColor, pointerEvents: isClicked ? 'none' : 'auto' }"
          @click="reject"
        />
      </div>
    </div>
  </template>
  
<script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    id: Number,
    type: String,
    date: String,
    reporter: String,
    content: String,
    status: Boolean
  });

  const displayType = computed(() => {
    switch (props.type) {
      case 'post':
        return '게시글';
      case 'client':
        return '회원';
      default:
        return props.type;
    }
  });
  
  const currentStatus = ref(props.status || '처리중');
  const checkColor = ref('');
  const rejectColor = ref('');
  const isClicked = ref(false);
  
  async function approve() {
    if (isClicked.value) return;
    try {
      await fetch(`http://localhost:8080/report/${props.id}/approve`, {
        method: 'PATCH'
      });
      currentStatus.value = '처리완료';
      checkColor.value = 'invert(56%) sepia(92%) saturate(538%) hue-rotate(65deg) brightness(95%) contrast(90%)';
      isClicked.value = true;
    } catch (error) {
      console.error('승인 실패:', error);
    }
  }

  async function reject() {
    if (isClicked.value) return;
    try {
      await fetch(`http://localhost:8080/report/${props.id}/reject`, {
        method: 'PATCH'
      });
      currentStatus.value = '처리완료';
      rejectColor.value = 'invert(19%) sepia(91%) saturate(7468%) hue-rotate(353deg) brightness(104%) contrast(116%)';
      isClicked.value = true;
    } catch (error) {
      console.error('거절 실패:', error);
    }
  }
</script>
  
<style scoped>
  .report-row {
    display: grid;
    grid-template-columns:
      105px    /* 번호 */
      130px   /* 신고유형 */
      130px   /* 신고일 */
      130px   /* 신고자 */
      130px   /* 신고내용 */
      130px   /* 처리상태 */
      40px    /* 빈칸 */
      55px;  /* 승인여부 */
    align-items: center;
    font-size: 16px;
    padding: 12px 0;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }
  
  .cell {
    text-align: center;
  }

  .report-row:hover .cell {
  color: #50D4C6;
}

/* 아이콘 포함한 cell은 색 안 바꾸게 */
.report-row:hover .cell:last-child {
  color: inherit;
}
.report-row:hover .cell:nth-last-child(2) {
  color: inherit;
}
  
  .icon {
    width: 16px;
    height: 16px;
    margin: 0 4px;
  }
  
  .clickable {
    cursor: pointer;
  }
</style>
  