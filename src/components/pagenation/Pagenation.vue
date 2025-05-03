<template>
    <div class="pagination">
        <!-- 맨 처음 페이지 이동 -->
        <button class="arrow" @click="goFirst">
        <img src="../../assets/icons/double-left-icon.svg" alt="맨 처음" />
        </button>
        <!-- 이전 페이지 이동 -->
        <button class="arrow" @click="goPrev">
        <img src="../../assets/icons/left-icon.svg" alt="이전" />
        </button>
        <!-- 페이지 번호들 -->
        <div class="page-numbers">
        <button
            v-for="page in totalPages"
            :key="page"
            :class="['page-button', { active: page === currentPage }]"
            @click="movePage(page)">
            {{ page }}
        </button>
        </div>
        <!-- 다음 페이지 이동 -->
        <button class="arrow" @click="goNext">
        <img src="../../assets/icons/right-icon.svg" alt="다음" />
        </button>
        <!-- 맨 마지막 페이지 이동 -->
        <button class="arrow" @click="goLast">
        <img src="../../assets/icons/double-right-icon.svg" alt="맨 마지막" />
        </button>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const props = defineProps({
        totalPages: {
            type: Number,
            required: true
        }
    });

    const emit = defineEmits(['change']);

    const currentPage = ref(1);

    function movePage(page) {
        currentPage.value = page;
        emit('change', currentPage.value);
    }

    function goFirst() {
        if (currentPage.value !== 1) {
            currentPage.value = 1;
            emit('change', currentPage.value);
        }
    }

    function goPrev() {
        if (currentPage.value > 1) {
            currentPage.value--;
            emit('change', currentPage.value);
        }
    }

    function goNext() {
        if (currentPage.value < props.totalPages) {
            currentPage.value++;
            emit('change', currentPage.value);
        }
    }

    function goLast() {
        if (currentPage.value !== props.totalPages) {
            currentPage.value = props.totalPages;
            emit('change', currentPage.value);
        }
    }
</script>

<style scoped>
    .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-top: 40px;
    }

    .arrow {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    .arrow img {
        width: 20px;
        height: 20px;
    }

    .page-numbers {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .page-button {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background-color: transparent;
        border: none;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        color: #000;
    }

    .page-button.active {
        background-color: #000; 
        color: #fff;
    }
</style>
