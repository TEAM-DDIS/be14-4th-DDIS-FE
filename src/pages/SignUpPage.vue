<template>
    <div class="register-container">
      <h2 class="title">회원가입</h2>
      <form class="form" @submit.prevent="handleSubmit">
        <input v-model="form.id" type="text" placeholder="아이디" required />
        <p v-if="errors.id" class="error">{{ errors.id }}</p>
        <p v-else-if="success.id" class="success">{{ success.id }}</p>
  
        <div class="password-wrapper">
          <input :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="비밀번호" required />
          <span class="toggle" @click="togglePassword"><img src="../assets/icons/invisible-icon.svg"></span>
        </div>
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
        <p v-else-if="success.password" class="success">{{ success.password }}</p>
  
        <div class="password-wrapper">
          <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword" placeholder="비밀번호 확인" required />
          <span class="toggle" @click="toggleConfirmPassword"><img src="../assets/icons/invisible-icon.svg"></span>
        </div>
        <p v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</p>
  
        <input v-model="form.name" type="text" placeholder="이름" required />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
  
        <input v-model="form.birth" type="date" placeholder="생년월일" required />
        <p v-if="errors.birth" class="error">{{ errors.birth }}</p>
  
        <input v-model="form.nickname" type="text" placeholder="닉네임" required />
        <p v-if="errors.nickname" class="error">{{ errors.nickname }}</p>
        <p v-else-if="success.nickname" class="success">{{ success.nickname }}</p>
  
        <div class="email-verification" style="display: flex; align-items: center; gap: 8px;">
        <input
            v-model="form.email"
            @input="validateEmail"
            type="email"
            placeholder="이메일"
            required
            style="flex: 1;"
        />
        <button
            type="button"
            @click="sendVerificationCode"
            :disabled="isCodeSent"
            style="background-color: #4dd0e1; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer;"
        >
            인증번호 받기
        </button>
        <span v-if="timer > 0" style="color: #00aa00;">
            {{ Math.floor(timer / 60) }}:{{ (timer % 60).toString().padStart(2, '0') }}
        </span>
        </div>
        <input v-model="form.code" type="text" placeholder="인증번호를 입력하세요." />
        <p v-if="errors.code" class="error">{{ errors.code }}</p>

        <button type="button" @click="verifyCode" class="verify-code-btn">
        인증번호 확인
        </button>
  
        <button type="submit" class="submit-btn">가입하기</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
  name: 'RegisterPage',
  data() {
    return {
    form: {
      id: '',
      password: '',
      confirmPassword: '',
      name: '',
      birth: '',
      nickname: '',
      email: '',
      code: '',
    },
    errors: {},
    success: {},
    showPassword: false,
    showConfirmPassword: false,
    timer: 0,
    timerInterval: null,
    isCodeSent: false, 
    };
  },
  watch: {
    'form.id'(val) {
    if (val.length < 4 || /[^a-zA-Z0-9]/.test(val)) {
      this.errors.id = '아이디는 4자 이상 영문 또는 숫자여야 합니다.';
      this.success.id = '';
    } else {
      this.errors.id = '';
      this.success.id = '사용할 수 있는 아이디입니다.';
    }
    },
    'form.password'(val) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(val)) {
      this.errors.password = '비밀번호는 대소문자, 숫자를 포함한 8자 이상이어야 합니다.';
      this.success.password = '';
    } else {
      this.errors.password = '';
      this.success.password = '사용할 수 있는 비밀번호입니다.';
    }
    this.errors.confirmPassword = val !== this.form.confirmPassword ? '비밀번호가 일치하지 않습니다.' : '';
    },
    'form.confirmPassword'(val) {
      this.errors.confirmPassword = val !== this.form.password ? '비밀번호가 일치하지 않습니다.' : '';
    },
    'form.name'(val) {
      this.errors.name = val ? '' : '이름을 입력해주세요.';
    },
    'form.birth'(val) {
      this.errors.birth = val ? '' : '생년월일을 입력해주세요.';
    },
    'form.nickname'(val) {
        if (!val) {
      this.errors.nickname = '닉네임을 입력해주세요.';
      this.success.nickname = '';
    } else {
      // 중복 체크는 생략 또는 API로
      this.errors.nickname = '';
      this.success.nickname = '사용할 수 있는 닉네임입니다.';
    }
    },
    'form.email'(val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.errors.email = emailRegex.test(val) ? '' : '올바른 이메일 형식이 아닙니다.';
    },
    'form.code'(val) {
      const codeRegex = /^\d{6}$/;
      this.errors.code = codeRegex.test(val) ? '' : '인증번호는 숫자 6자리여야 합니다.';
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async handleSubmit() {
  
    // 유효성 체크 통과한 경우
    const payload = {
      clientName: this.form.name,
      clientId: this.form.id,
      clientPwd: this.form.password,
      clientEmail: this.form.email,
      clientBirth: this.form.birth,
      clientNickname: this.form.nickname,
      clientPhotoUrl: null,
      clientType: "USER"
    };

    try {
      const response = await fetch('http://localhost:8080/clients/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.message === "회원가입이 성공적으로 완료되었습니다.") {
        alert("회원가입이 완료되었습니다.");
        // 라우팅 처리 (예: 로그인 페이지로)
        this.$router.push('/login');
      } else {
        alert(result.message); // 실패 시 백엔드에서 전달한 메시지 출력
      }
    } catch (error) {
      console.error('회원가입 요청 실패:', error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  },

  validateEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(this.form.email)) {
      this.errors.email = "사용할 수 없는 이메일입니다.";
    } else {
      this.errors.email = "";
    }
  },

  async sendVerificationCode() {
  if (!this.form.email || this.errors.email) return;

  try {
    const response = await fetch("http://localhost:8080/email/send-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: this.form.email }),
    });

    if (!response.ok) {
      throw new Error("인증번호 발송 실패");
    }

    this.isCodeSent = true;
    this.timer = 300; // 5분

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.isCodeSent = false;
      }
    }, 1000);

    alert("인증번호가 이메일로 발송되었습니다.");
    } catch (error) {
    console.error(error);
    alert("인증번호 발송 실패");
    }
  },


  async verifyCode() {
  try {
    const response = await fetch("http://localhost:8080/email/verify-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.form.email,
        code: this.form.code,
      }),
    });

    if (!response.ok) {
      throw new Error("인증 실패");
    }

    const result = await response.text();
        alert(result); // "인증 성공" or "인증 실패"
      } catch (error) {
        console.error(error);
        alert("인증 요청 중 오류 발생");
      }
    }
  }
}

</script>
  
  <style scoped>
  .register-container {
    max-width: 400px;
    margin: 40px auto;
    margin-top: 150px;
    padding: 0 20px;
  }
  
  .title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
  }
  
  .form input {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 5px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .success {
  color: #00aa00;
  font-size: 12px;
  margin-top: -5px;
  margin-bottom: 10px;
  }

  .error {
  color: red;
  font-size: 12px;
  margin-top: -5px;
  margin-bottom: 10px;
  }
  
  .password-wrapper {
    position: relative;
  }
  
  .toggle {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
  
  .email-verification {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .send-code-btn {
    padding: 10px 14px;
    background-color: #58d3c8;
    color: white;
    white-space: nowrap;
    border: none;
    border-radius: 5px;
    height: 40px;
    line-height: 20px;
    cursor: pointer;
  }
  
  .submit-btn {
    width: 100%;
    background-color: #58d3c8;
    color: white;
    font-weight: bold;
    padding: 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .verify-code-btn {
  background-color: #4caf50;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  margin-top: 8px;
  cursor: pointer;
  }
  </style>