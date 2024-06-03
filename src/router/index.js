import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/ToDoView.vue";
import EditToDoView from "@/views/EditToDoView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "todo-list",
      component: HomeView,
    },
    {
      path: "/edit/:id",
      name: "edit-todo-list",
      component: EditToDoView,
    },
  ],
});

export default router;
