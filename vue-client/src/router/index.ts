import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "/signup",
        name: "signup",
        component: Signup,
        meta: {
          showModal: true
        }
      },
      {
        path: "/login",
        name: "login",
        component: Login
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
