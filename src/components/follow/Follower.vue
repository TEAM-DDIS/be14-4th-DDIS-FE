<template>
    <div class="overlay" @click.self="close">
      <div class="follower-modal">
        <h2 class="modal-title">팔로워</h2>
        <div class="follower-list">
          <FollowBox
          v-for="f in followers"
          :key="f.followNum"
          :image="'/images/header-profile.png'"
          :nickname="f.clientNickname"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import FollowBox from './FollowBox.vue';
  
  const followers = ref([]);

  onMounted(async () => {
  const token = localStorage.getItem('accessToken');
  const payload = JSON.parse(atob(token.split('.')[1]));
  const clientId = payload.sub;

  const res = await fetch(`http://localhost:8080/follows/${clientId}/followers`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json();
  followers.value = data;
});


const emit = defineEmits(['close']);
const close = () => emit('close');
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: start;
    padding-top: 250px;
    z-index: 999;
  }
  
  .follower-modal {
    width: 330px;
    height: 400px;
    background: white;
    border: 0.5px solid #cdcdcd;
    border-radius: 20px;
    padding: 30px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }
  
  .modal-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  .follower-list {
    overflow-y: auto;
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
    /* 스크롤바 숨기기 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* IE 10+ */
  }
  </style>
  