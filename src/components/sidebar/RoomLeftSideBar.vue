<template>
  <div class="left-sidebar">
    <!-- 방장 프로필 -->
    <div class="owner-info">
      <img :src="owner.profileImage" alt="owner-profile" class="owner-img" />
      <div class="owner-details">
        <p class="owner-name">{{ owner.name }}</p>
        <span class="owner-badge">방장</span>
      </div>
    </div>

    <!-- 공동TODO방 제목 -->
    <h2 class="room-title">{{ title }}</h2>

    <!-- 공동TODO방 내용 -->
    <p class="room-content">{{ content }}</p>

    <!-- 구분선 -->
    <div class="divider"></div>

    <!-- Summary 버튼 -->
    <button class="summary-button"># SUMMARY</button>

    <!-- 도넛 그래프 -->
    <div class="summary-graph">
      <SummaryGraph />
    </div>
  </div>
</template>

<script setup>
import SummaryGraph from '@/components/graph/SummaryGraph.vue'

const props = defineProps({
  title: { type: String, required: true },
  content: { type: String, required: true }
})

const owner = {
  id: 1,
  name: '성준',
  profileImage: '/profile_owner.png'
}
</script>

<style scoped>
.left-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.owner-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.owner-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.owner-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.owner-name {
  font-size: 16px;
  font-weight: bold;
}

.owner-badge {
  font-size: 12px;
  color: #fff;
  background-color: #4b77f7;
  padding: 2px 6px;
  border-radius: 6px;
  margin-top: 4px;
}

.room-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.room-content {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #aaa;
  margin-bottom: 24px;
}

.summary-button {
  width: 100%;
  padding: 12px 0;
  border: 2px solid #000;
  border-radius: 30px;
  background: white;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.summary-button:hover {
  background: #f2f2f2;
}

.summary-graph {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background: #f8f8f8;
  border-radius: 50%;
}
</style>
