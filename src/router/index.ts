import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/admin/user',
    name: 'adminuser',
    component: () => import('../views/admin/AdminUserView.vue')
  },
  {
    path: '/admin/ebook',
    name: 'adminebook',
    component: () => import('../views/admin/AdminEBookView.vue')
  },
  {
    path: '/admin/category',
    name: 'admincategory',
    component: () => import('../views/admin/AdminCategoryView.vue')
  },
  {
    path: '/admin/doc',
    name: 'admindoc',
    component: () => import('../views/admin/AdminDocView.vue')
  },
  {
    path: '/doc',
    name: 'doc',
    component: () => import('../views/DocView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
