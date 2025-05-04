<template>
    <header>
      <LoginHeader />
    </header>
    <div class="login-page">
      <!-- 로고 -->
      <img src="/images/logo.png" alt="로고" class="login-logo" />
      <!-- 로그인 폼 -->
      <div class="login-form">
        <!-- 아이디 입력 -->
        <input
          type="text"
          v-model="loginForm.username"
          placeholder="아이디"
          class="input-box"/>
          <!-- 비밀번호 입력 + 눈 아이콘 -->
          <div class="input-wrapper">
            <input
              :type="isPasswordVisible ? 'text' : 'password'"
              v-model="loginForm.password"
              placeholder="비밀번호"
              class="input-box"/>
            <img
              :src="isPasswordVisible ? visibleIcon : invisibleIcon"
              alt="비밀번호 보기 토글"
              class="eye-icon"
              @click="togglePassword"/>
          </div>
          <button class="login-button" @click="handleLogin">로그인</button>
          <div class="login-links">
            <div class="left-login-links">
              <a href="#" @click="goToSignup">회원가입</a>
            </div>
            <div class="right-login-links">
              <a href="#" @click="goToFindId">아이디찾기</a>
              <a href="#" @click="goToFindPassword">비밀번호찾기</a>
            </div>
          </div>
          <div class="social-login-label">간편 로그인</div>
        <div class="social-login">
          <img src="../assets/icons/google-icon.svg" alt="구글 로그인" class="social-icon" />
          <img src="../assets/icons/kakao-icon.svg" alt="카카오 로그인" class="social-icon" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router'; 
  import { useAuthStore } from '@/stores/useAuthStore';
  import LoginHeader from '@/components/header/LoginHeader.vue';
  import visibleIcon from '@/assets/icons/visible-icon.svg';
  import invisibleIcon from '@/assets/icons/invisible-icon.svg';
  
  const authStore = useAuthStore();
  const loginForm = ref({
    username: '',
    password: ''
  });
  
  const isPasswordVisible = ref(false);
  const router = useRouter(); // Vue Router 인스턴스 가져오기
  
  function togglePassword() {
    isPasswordVisible.value = !isPasswordVisible.value;
  }

  function goToFindId() {
  router.push('/login/find-Id');
}

function goToFindPassword() {
  router.push('/login/ModifyPassword');
}

function goToSignup() {
  router.push('/signup');
}

  
  async function handleLogin() {
    try {
      const response = await fetch('http://localhost:8080/clients/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: loginForm.value.username,
          clientPwd: loginForm.value.password,
        }),
      });
  
      const result = await response.json();
  
      if (result.message === "로그인 성공") {
        alert("로그인 성공!");
        
        //pinia에 토큰 저장
        authStore.setTokens(result.accessToken, result.refreshToken);
        authStore.loadTokens()
  
        // 라우팅 처리
        router.push('/'); 
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  }
  </script>
  

<style scoped>
  .login-page {
    width: 100%;
    min-height: calc(100vh - 80px); /* 헤더 높이 제외 */
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 120px;
    box-sizing: border-box;
  }

  .login-logo {
    width: 211px;
    height: auto;
    margin-top: 70px;
    margin-bottom: 45px;
  }

  .login-form {
    width: 100%;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .input-wrapper {
    position: relative;
    width: 100%;
  }

  .input-box {
    width: 100%;
    height: 45px;
    border: 0.5px solid #cdcdcd;
    border-radius: 5px;
    padding: 0 14px;
    padding-right: 40px; 
    margin-bottom: 11px;
    font-size: 15px;
    box-sizing: border-box;
  }

  .eye-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    padding-bottom: 10px;
    transform: translateY(-50%);
    width: 22px;
    height: 22px;
    cursor: pointer;
  }

  .login-button {
    width: 100%;
    height: 45px;
    background-color: #50D4C6;
    border: none;
    border-radius: 5px;
    font-weight: 700;
    color: #ffffff;
    font-size: 20px;
    cursor: pointer;
    margin-top: 20px;
    margin-bottom: 11px;
    transition: background-color 0.2s;
  }

  .login-button:hover {
    background-color: #6ce4dc;
  }

  .login-links {
    width: 100%;
    max-width: 320px;
    display: flex;
    justify-content: space-between; /* 좌우로 벌어지게 */
    align-items: center;
    font-size: 10px;
    margin-top: 11px;
    margin-bottom: 44px;
    color: #626262;
  }

  .left-login-links,
  .right-login-links {
    display: flex;
    align-items: center;
    gap: 10px; /* 링크 사이 간격 */
  }

  .right-login-links {
    justify-content: flex-end;
  }

  .login-links a {
    text-decoration: none;
    color: #626262;
    font-size: 10px;
  }


  .social-login-label {
    font-size: 10px;
    margin-bottom: 30px;
    color: #626262;
  }

  .social-login {
    display: flex;
    gap: 50px;
  }

  .social-icon {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
</style>
