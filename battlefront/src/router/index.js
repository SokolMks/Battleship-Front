import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/game/:id",
    name: "Grid",
    props: true,
    component: () => import("../views/Game")
  },
  {
    path: "/leaderboard",
    name: "Board",
    component: () => import("../views/LeaderBoard")
  },
  {
    path: "/login",
    name: "Login Page",
    component: () => import("../views/Login")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Registration")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
