import Vue from 'vue';
import Router from 'vue-router';
import Todos from '@/components/Todos';
import Login from '@/components/Login';
import Register from '@/components/Register';
import Calendar from '@/components/Calendar';
import firebase from 'firebase';
/* import { Router } from 'express';
 */ Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'todos',
      component: Todos,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  ]
});
router.beforeEach((to, from, next) => {
  //check for requiredAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //check if logged in
    if (!firebase.auth().currentUser) {
      //got to login page
      /* next({
        path: "/login",
        query: {
          redirect: to.fullPath
        }
      }); */
    } else {
      //proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    //check if logged in
    if (firebase.auth().currentUser) {
      //go to login page
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      //proceed to route
      next();
    }
  } else {
    next();
  }
});

export default router;
