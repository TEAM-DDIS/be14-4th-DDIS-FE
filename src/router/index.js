import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/todo/personal',
            component: () => import('@/pages/PersonalTodoPage.vue')
        },
        {
            path: '/report',
            component: () => import('@/pages/ReportPage.vue')
        },
        { 
            path: '/notice',
            component: () => import('@/pages/NoticePage.vue')
        },
        {
            path: '/notice/:id',
            component: () => import('@/components/notice/NoticeDetailPage.vue')
        },
    
        {
            path: '/sharetodopage',
            component: () => import('@/pages/ShareRoomPage.vue')
        },
        {
            path: '/login',
            component: () => import('@/pages/LoginPage.vue')
        },
        { 
            path: '/inquiry',
            component: () => import('@/pages/InquiryPage.vue')
        },
        {
            path: '/inquiry/:id',
            component: () => import('@/components/inquiry/InquiryDetailPage.vue')
        },   
        {
            path: '/room',
            component: () => import('@/pages/RoomListPage.vue')
        },
        {
            path: '/chat',
            component: () => import('@/pages/ChatRoomPage.vue')
        },
        {
            path: '/signup',
            component: () => import('@/pages/SignUpPage.vue')
        },
        {
            path: '/login/find-Id',
            component: () => import('@/pages/FindIdPage.vue')
        },
        {
            path: '/ModifyProfilePage',
            component: () => import('@/pages/ModifyProfilePage.vue')
        },
        {
            path: '/login/ModifyPassword',
            component: () => import('@/pages/ModifyPasswordPage.vue')
        },
        {
            path: '/post',
            component: () => import('@/pages/post/BackPostPage.vue')
        },
        {
            path: '/mypage',
            component: () => import('@/pages/Mypage.vue'),
            meta: { requiresAuth: true } // 인증 필요 시
        },
        {
            path: '/post/:id',
            component: () => import('@/pages/post/BackPostDetail.vue')
        }
    ]
})

export default router