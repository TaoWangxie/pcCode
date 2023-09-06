import {
    createRouter,
    createWebHistory,
    RouteRecordRaw,
    createWebHashHistory,
} from 'vue-router';
const home = () => import('@/views/home.vue');
// 2. 定义路由配置
const routes = [
    {
        path: '/',
        redirect: '/pcCode',
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home.vue'),
    },
    {
        path: '/pcCode',
        name: 'pcCode',
        component: () => import('@/views/createLayout/index.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(), // hash模式:createWebHashHistory，history模式:createWebHistory
    routes,
});

export default router;
