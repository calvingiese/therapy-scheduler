import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginPage.vue";

const routes = [
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      return next({ name: "Login" });
    } else if (to.meta.role && to.meta.role !== userRole) {
      return next({ name: "Login" });
    }
  }
  next();
});

export default router;
