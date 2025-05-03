<template>
    <div class="inquiry-page">
        <!-- 상단 메뉴 -->
        <header class="main-header">
        <Header></Header>
        </header>
  
        <!-- 문의사항 메인 -->
        <main class="content">
            <h1 class="title">문의 사항</h1>
    
            <table class="inquiry-table">
            <thead>
                <tr>
                <th>번호</th>
                <th>제목</th>
                <th>등록일</th>
                <th>작성자</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(inquiry, index) in paginatedInquiries" :key="inquiry.id">
                    <td>{{ inquiry.id }}</td>
                    <td>
                    <RouterLink :to="`/inquiry/${inquiry.id}`" class="link">
                        {{ inquiry.title }}
                    </RouterLink>
                    </td>
                    <td>{{ inquiry.date }}</td>
                    <td>{{ inquiry.client }}</td>
                </tr>
                </tbody>

            </table>

            <!-- 등록 버튼 추가 위치 -->
            <div class="action-wrap">
                <button class="register-btn" @click="showModal = true">등록</button>
            </div>

    
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

        <InquiryRegisterModal
            v-if="showModal"
            @close="showModal = false"
            @submit="handleSubmit"
        />
    </div>
</template>
  
<script setup>
    import Header from '@/components/header/Header.vue';
    import InquiryRegisterModal from '@/components/inquiry/InquiryRegisterModal.vue'
    import { ref, computed, onMounted } from 'vue'
    import axios from '@/utils/axios'

    const showModal = ref(false)
    const currentPage = ref(1)
    const perPage = 8
    const inquiries = ref([])


    // 🚀 JSON 데이터 가져오기
    onMounted(async () => {
        try {
            const res = await axios.get('http://localhost:3001/inquiries')
            // const res = await axios.get('http://localhost:8080/inquiries/all')
            inquiries.value = res.data.sort((a, b) => b.id - a.id)
        } catch (err) {
            console.error('문의사항 불러오기 실패:', err)
        }
    })

    const paginatedInquiries = computed(() => {
        const start = (currentPage.value - 1) * perPage
        return inquiries.value.slice(start, start + perPage)
    })
    const totalPages = computed(() =>
        Math.ceil(inquiries.value.length / perPage)
    )

    function goToPage(page) {
        currentPage.value = page
    }
    function prevPage() {
        if (currentPage.value > 1) currentPage.value--
    }
    function nextPage() {
        if (currentPage.value < totalPages.value) currentPage.value++
    }

    // 등록된 문의사항을 서버에도 반영
    async function handleSubmit({ title, content }) {
        try {
            const newInquiry = {
            title,
            content,
            date: new Date().toISOString().slice(0, 10),
            client: '현재사용자'
            }

            const res = await axios.post('http://localhost:3001/inquiries/create', newInquiry)

            inquiries.value.unshift({ ...newInquiry, id: res.data.id })
            showModal.value = false
        } catch (err) {
            alert('등록 실패')
            console.error(err)
        }
    }
</script>
  
<style scoped>
    /* 공통 스타일 */
    /* .notice-page {
        background: #f2f2f2;
        min-height: 100vh;
        font-family: 'Arial', sans-serif;
    } */

    
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
    .inquiry-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 80px;
        margin-bottom: 20px;
    }
    
    .inquiry-table td {
        border-bottom: 1px solid #ddd;
        padding: 20px;
        text-decoration: none;
        text-align: center;
    }
    
    .inquiry-table th {
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

    .action-wrap {
        display: flex;
        justify-content: flex-end;
        margin-top: 50px;
    }

    .register-btn {
        background: black;
        color: white;
        padding: 10px 24px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 24px;
        text-decoration: none;
        transition: background 0.2s;
    }

    .register-btn:hover {
        background: #444;
    }

    
    /* 페이지네이션 */
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
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
  