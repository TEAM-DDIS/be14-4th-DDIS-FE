<template>
    <div class="header-wrap"
        @mouseenter="hoverMega"
        @mouseleave="deactivate">
        <header class="main-header" :class="{ open: activeMenu }">
            <div class="inner-header">
                <!-- 좌측 로고 -->
                <div class="header-left">
                    <img src="/images/logo.png" alt="로고" class="logo-img" />
                </div>
                <!-- 중앙 메뉴 -->
                <nav class="header-menu">
                    <div
                        v-for="menu in menus"
                        :key="menu.key"
                        class="menu-item"
                        @mouseenter="activate(menu.key)">
                        <span :class="{ hovered: activeMenu === menu.key }">{{ menu.label }}</span>
                    </div>
                </nav>
                <!-- 우측 DM/닉네임/프로필 -->
                <div class="header-right">
                    <img src="../../assets/icons/dm-icon.svg" alt="DM" class="header-icon dm" />
                    <span class="profile-nickname">{{ profile.nickname }}</span>
                        <img
                            :src="profile.image"
                            alt="프로필"
                            class="profile-img"
                            @click.stop="toggleProfileModal"/>
                    <!-- 프로필 모달 드롭다운 -->
                    <div
                        v-if="showProfileModal"
                        class="profile-modal"
                        @click.stop>
                        <div class="profile-modal-header">
                            <img :src="profile.image" alt="프로필" class="modal-profile-img" />
                            <div class="modal-info">
                                <div class="modal-nickname">{{ profile.nickname }}</div>
                                <div class="modal-email">{{ profile.email }}</div>
                            </div>
                        </div>
                        <div class="profile-modal-menu">
                            <div class="profile-modal-item">
                                <img src="../../assets/icons/profile-setting.svg" alt="개인정보수정" class="modal-icon">
                                <span>개인정보 수정</span>
                            </div>
                            <div class="profile-modal-item" @click="goToReportPage">
                                <img src="../../assets/icons/report-icon.svg" alt="신고관리리" class="modal-icon">
                                <span>신고 관리</span>
                            </div>
                            <div class="profile-modal-item">
                                <img src="../../assets/icons/profile-logout.svg" alt="로그아웃" class="modal-icon">
                                <span>로그아웃</span>
                            </div>
                        </div>
                    </div>
                    <!-- 오버레이(모달 바깥 클릭 시 닫힘) -->
                    <div v-if="showProfileModal" class="modal-overlay" @click="closeProfileModal"></div>
                </div>
            </div>
            <!-- 메가 메뉴 전체 영역 (hover 시 슬라이드다운) -->
            <div v-if="activeMenu" class="mega-menu">
                <div class="mega-menu-row">
                    <!-- 설명 -->
                    <div class="mega-desc">
                        {{ (menus.find(m => m.key === activeMenu) || {}).desc }}
                    </div>
                    <!-- 중앙 서브메뉴: 활성 메뉴의 children만 한 줄 중앙정렬 -->
                    <div class="mega-items-center">
                        <div
                            v-for="item in (menus.find(m => m.key === activeMenu)?.children || [])"
                            :key="item"
                            class="mega-item"
                            >
                            {{ item }}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </div>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import { useRouter } from 'vue-router'

    const profile = ref({
        nickname: '',
        email: '',
        image: ''
    })

    onMounted(async () => {
        const res = await fetch('http://localhost:3001/profiles/1')
        const data = await res.json()
        profile.value = data
    })

    const showProfileModal = ref(false)

    function toggleProfileModal() {
        showProfileModal.value = !showProfileModal.value
    }
    function closeProfileModal() {
        showProfileModal.value = false
    }

    const activeMenu = ref(null)
    const menus = [
    {
        key: 'board',
        label: '게시판',
        desc: '공동 Todo를 함께할 멤버를 모집하는 게시판입니다.\n함께 목표를 이룰 팀원을 찾아보세요!',
        children: ['모집 게시판'],
    },
    {
        key: 'todo',
        label: 'Todo',
        desc: '개인 할 일부터 공동 목표까지 한 곳에서 관리하세요.\n팀원들과 Todo를 공유하고, 진행 현황도 확인할 수 있어요!',
        children: ['개인 Todo', '공동 Todo'],
    },
    {
        key: 'service',
        label: '서비스',
        desc: '중요한 소식과 안내를 놓치지 마세요.\n최신 공지와 문의사항을 한눈에 확인할 수 있습니다.',
        children: ['공지사항', '문의사항'],
    },
    ]

    function activate(key) {
        activeMenu.value = key
    }
    function deactivate() {
        activeMenu.value = null
    }
    function hoverMega() {
    // noop: 래퍼에서 hover 유지용
    }

    const router = useRouter()

    function goToReportPage() {
        router.push('/report')
    }

</script>
  
<style scoped>
    .main-header {
        position: fixed;
        top: 0; left: 0;
        width: 100vw;
        min-width: 1024px;
        background: #ffffff;
        border-bottom: 1px solid #cdcdcd;
        z-index: 100;
        transition: background 0.22s;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
    .main-header.open {
        background: #cdcdcd;
    }
    .inner-header {
        width: 100%;
        max-width: 1440px;
        margin: 0 auto;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
        box-sizing: border-box;
    }
    .header-left {
        display: flex;
        align-items: center;
        min-width: 120px;
    }
    .logo-img {
        margin-left: 6px;
    }
    .header-center {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .header-menu {
        display: flex;
        gap: 130px;
        align-items: center;
        flex: 1;
        justify-content: center;
    }
    .menu-item {
        position: relative;
        min-width: 110px;
        text-align: center;
        border-radius: 10px 10px 0 0;
        cursor: pointer;
    }
    .menu-item span {
        display: inline-block;
        font-size: 16px;
        font-weight: 700;
        color: #000000;
        padding: 10px 0;
        border-radius: 8px 8px 0 0;
        transition: color 0.18s;
    }
    .menu-item span.hovered {
        color: #ffffff;
    }
    .header-right {
        position: relative;
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 170px;
        justify-content: flex-end;
    }
    .header-icon.dm {
        width: 28px;
        height: 28px;
    }
    .profile-nickname {
        font-size: 15px;
        font-weight: 600;
        color: #000000;
        margin-right: 2px;
    }
    .profile-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        border: 1.5px solid #cdcdcd;
        cursor: pointer;
    }

    .profile-modal {
        position: absolute;
        top: 60px;
        right: 0;
        min-width: 260px;
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 2px 15px 0 rgba(0,0,0,0.15);
        padding: 24px 0 18px 0;
        z-index: 999;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        animation: modalDown 0.18s;
    }

    @keyframes modalDown {
        from { opacity: 0; transform: translateY(-12px);}
        to   { opacity: 1; transform: translateY(0);}
    }

    .profile-modal-header {
        display: flex;
        align-items: center;
        padding: 0 24px 10px 24px;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 12px;
    }

    .modal-profile-img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 13px;
        border: 1px solid #ddd;
    }

    .modal-info {
        display: flex;
        flex-direction: column;
    }

    .modal-nickname {
        font-size: 17px;
        font-weight: 700;
        margin-bottom: 3px;
        color: #222;
    }

    .modal-email {
        font-size: 14px;
        color: #888;
        font-weight: 500;
    }

    /* 메뉴 리스트 */
    .profile-modal-menu {
        display: flex;
        flex-direction: column;
        gap: 11px;
        margin-top: 6px;
        padding: 0 24px;
    }

    .profile-modal-item {
        display: flex;
        align-items: center;
        gap: 9px;
        font-size: 16px;
        color: #111;
        cursor: pointer;
        padding: 7px 0 4px 0;
        transition: background 0.15s, color 0.15s;
        border-radius: 8px;
    }

    .profile-modal-item:hover {
        background: #f2f2f2;
    }

    .modal-icon {
        font-size: 18px;
    }

    .modal-overlay {
        /* 전체 화면 클릭시 닫힘 (투명) */
        position: fixed;
        left: 0; top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 998;
    }

    /* 🟦 메가 메뉴 영역 전체 스타일 */
    .mega-menu {
        position: absolute;
        left: 0;
        top: 80px;
        width: 100%;
        background: #cdcdcd;
        border-bottom: 1px solid #cdcdcd;
        animation: megaDown 0.23s cubic-bezier(0.4,0.4,0.3,1.1);
        padding: 24px 0 32px 0;
        z-index: 99;
        box-shadow: 0 8px 18px rgba(0,0,0,0.07);
    }

    @keyframes megaDown {
        from { opacity: 0; transform: translateY(-15px);}
        to   { opacity: 1; transform: translateY(0);}
    }

    .mega-menu-row {
        display: flex;
        flex-direction: row;
        max-width: 1440px;
        margin: 0 auto;
        align-items: flex-start;
    }

    .mega-desc {
        width: 300px;
        color: #000000;
        font-size: 12px;
        font-weight: 500;
        padding-left: 50px;
        line-height: 1.6;
        white-space: pre-line;
    }

    .mega-items-center {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 80px;
        justify-content: center;
        min-height: 54px;
    }

    .mega-item {
        font-size: 16px;
        padding: 4px 0;
        color: #000000;
        cursor: pointer;
        transition: color 0.18s, font-weight 0.18s;
    }
    
    .mega-item:hover {
        color: #ffffff;
        font-weight: 600;
    }
</style>