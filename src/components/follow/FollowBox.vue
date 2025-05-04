<template>
    <div class="follow-box" @click="goToProfile">
      <img :src="image" alt="프로필 이미지" class="profile-img" />
      <span class="nickname">{{ nickname }}</span>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  const props = defineProps({
    image: String,
    nickname: String,
    clientId: String,
    clientNum: {
    type: Number,
    required: true
  }  })
  const router = useRouter()
  function goToProfile() {
    console.log('➡️ 이동할 clientNum:', props)

    router.push(`/personal-page/${props.clientNum}`)
  }
  </script>
  
  <style scoped>
  .follow-box {
    width: 300px;
    height: 70px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 0 15px;
  }
  
  .profile-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 24px;
  }
  
  .nickname {
    font-size: 16px;
    font-weight: bold;
  }
  </style>
  