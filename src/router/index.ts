import store from '@/store';
import { Tool } from '@/util/tool';
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
    component: () => import('../views/admin/AdminUserView.vue'),
    meta: {
      loginRequire: true
    }
  },
  {
    path: '/admin/ebook',
    name: 'adminebook',
    component: () => import('../views/admin/AdminEBookView.vue'),
    meta: {
      loginRequire: true
    }
  },
  {
    path: '/admin/category',
    name: 'admincategory',
    component: () => import('../views/admin/AdminCategoryView.vue'),
    meta: {
      loginRequire: true
    }
  },
  {
    path: '/admin/doc',
    name: 'admindoc',
    component: () => import('../views/admin/AdminDocView.vue'),
    meta: {
      loginRequire: true
    }
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

// 路由登录拦截
router.beforeEach((to, from, next) => {
  // 要不要对meta.loginRequire属性做监控拦截
  if (to.matched.some(function (item) {
    console.log(item, "是否需要登录校验：", item.meta.loginRequire);
    return item.meta.loginRequire
  })) {
    const loginUser = store.state.user;
    if (Tool.isEmpty(loginUser)) {
      console.log("用户未登录！");
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
