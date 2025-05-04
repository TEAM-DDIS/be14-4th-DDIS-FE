<template>
    <div class="notice-page">
        <!-- 상단 메뉴 -->
        <header class="main-header">
        <Header></Header>
        </header>
  
        <!-- 공지사항 메인 -->
        <main class="content">
            <h1 class="title">서비스 공지 사항</h1>
    
            <table class="notice-table">
            <thead>
                <tr>
                <th>번호</th>
                <th>제목</th>
                <th>등록일</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(notice, index) in paginatedNotices" :key="notice.id">
                    <td>{{ notice.id }}</td>
                    <td>
                    <RouterLink :to="`/notice/${notice.id}`" class="link">
                        {{ notice.title }}
                    </RouterLink>
                    </td>
                    <td>{{ notice.date }}</td>
                </tr>
                </tbody>

            </table>
    
            <!-- 페이지네이션 -->
            <div class="pagination">
                <button @click="goToPage(1)" :disabled="currentPage === 1">«</button>
                <button @click="prevPage" :disabled="currentPage === 1">‹</button>
                
                <button
                    v-for="page in totalPages"
                    :key="page"
                    :class="{ active: page === currentPage }"
                    @click="goToPage(page)"
                >
                    {{ page }}
                </button>

                <button @click="nextPage" :disabled="currentPage === totalPages">›</button>
                <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">»</button>
            </div>
        </main>
    </div>
</template>
  
<script setup>
    import { ref, computed, onMounted } from 'vue'
    import Header from '@/components/header/Header.vue'
    import axios from '@/utils/axios'

    // 공지사항 목록 상태
    const notices = ref([])
    const currentPage = ref(1)
    const perPage = 8


    // 데이터 불러오기
    onMounted(async () => {
        try {
            const res = await axios.get('http://localhost:3001/notices')
            // 최신순으로 정렬 (id 기준)
            notices.value = res.data.sort((a, b) => b.id - a.id)
            
            // const res = await fetch('http://localhost:8080/notices/all')
            // let data = await res.json();
            //  // 날짜 최신순 정렬 (백엔드에서 date 필드 기준 정렬 필요시)
            //  console.log('받아온 공지사항:', data) // ✅ 로그 확인
            // data.sort((a, b) => new Date(b.date) - new Date(a.date))
            
            notices.value = data;

        } catch (err) {
            console.error('공지사항 불러오기 실패:', err)
        }
    })

    // 페이지 계산
    const paginatedNotices = computed(() => {
        const start = (currentPage.value - 1) * perPage
        return notices.value.slice(start, start + perPage)
    })
    const totalPages = computed(() => Math.ceil(notices.value.length / perPage))

    // 페이지 이동 메서드
    function goToPage(page) {
      currentPage.value = page
    }
    function prevPage() {
        if (currentPage.value > 1) currentPage.value--
    }

    function nextPage() {
        if (currentPage.value < totalPages.value) currentPage.value++
    }
    
</script>
  
<style scoped>

    /* 본문 */
    .content {
        background: white;
        margin: 80px auto;
        padding: 30px;
        border-radius: 10px;
        max-width: 800px;
        text-align: center;
    }
    
    .title {
        font-size: 30px;
        font-weight: bold;
        margin-top: 40px;
        margin-bottom: 20px;
    }
    
    /* 테이블 */
    .notice-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 80px;
        margin-bottom: 20px;
    }
    
    .notice-table td {
        border-bottom: 1px solid #ddd;
        padding: 20px;
        text-decoration: none;
        text-align: center;
    }
    
    .notice-table th {
        background: white;
        border-bottom: 2px solid black;
        padding: 20px;
        font-size: 20px;
    }
    
    .link {
        text-decoration: none; /* 밑줄 제거 */
        color: black; /* 기본 색상 */
        transition: color 0.2s;
    }

    .link:hover {
        color: #50D4C6; /* 호버 시 색상 변경 */
        font-weight: bold;
    }

    
    /* 페이지네이션 */
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin-top: 80px;
    }

    .pagination button {
        border: none;
        background: none;
        font-size: 18px;
        cursor: pointer;
        padding: 6px 10px;
        border-radius: 30%;
        transition: background 0.2s, color 0.2s;
    }

    .pagination button:hover:not(:disabled) {
        background: #ddd;
    }

    .pagination button:disabled {
        color: #ccc;
        cursor: default;
    }

    .pagination .active {
        background: black;
        color: white;
        font-weight: bold;
    }

</style>
  