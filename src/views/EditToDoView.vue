<script setup>
import { onMounted, ref, reactive } from "vue";
import { useTodoStore } from "../stores/todo";
import { useRoute, RouterLink } from "vue-router";
import VueDatePicker from "@vuepic/vue-datepicker";

const todoStore = useTodoStore();
const isLoading = ref(false);
const isUpdated = ref(false);
const todoStatus = ref("");
const router = useRoute();
const todoData = reactive({
  name: "",
  isDone: "",
  endAt: "",
});
const todoId = ref(-1);

onMounted(async () => {
  isLoading.value = true;
  try {
    todoId.value = parseInt(router.params.id);
    await todoStore.loadTodo(todoId.value);
    todoData.name = todoStore.selectedTodo.name;
    todoStatus.value = todoStore.selectedTodo.isDone ? "Done" : "In Progress";
    todoData.endAt = todoStore.selectedTodo.endAt;
  } catch (err) {
    console.log(err);
  }
  isLoading.value = false;
});

const handleUpdate = async () => {
  try {
    isLoading.value = true;
    todoData.isDone = todoStatus.value === "Done" ? true : false;
    await todoStore.updateTodo(todoData, todoId.value);
    isUpdated.value = true;
    isLoading.value = false;
    setTimeout(() => {
      isUpdated.value = false;
    }, 2000);
  } catch (err) {
    console.log(err);
  }
};
</script>
<template>
  <div>
    <div class="flex flex-col gap-y-6 justify-center items-center h-full">
      <div class="flex flex-col justify-center items-center w-full gap-y-7">
        <input
          type="text"
          placeholder="Todo..."
          class="input input-bordered w-full md:max-w-lg"
          v-model="todoData.name"
        />
        <select
          class="select select-bordered w-full md:max-w-lg"
          v-model="todoStatus"
        >
          <option
            v-for="status in todoStore.statuses"
            :key="status"
            :value="status"
          >
            {{ status }}
          </option>
        </select>
        <VueDatePicker
          class="w-full md:max-w-lg"
          v-model="todoData.endAt"
        ></VueDatePicker>
        <div
          v-if="isUpdated"
          role="alert"
          class="alert alert-success w-full md:max-w-lg text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Updated Successful</span>
        </div>
      </div>
    </div>
    <div class="absolute bottom-5 right-5 flex gap-x-5">
      <RouterLink :to="{ name: 'todo-list' }">
        <button class="btn">Cancel</button>
      </RouterLink>
      <button
        :disabled="
          todoData.name === '' || todoData.endAt === '' || !todoData.endAt
        "
        class="btn btn-accent text-white"
        @click="handleUpdate(todoData, todoId)"
      >
        Update
      </button>
    </div>
  </div>
</template>
<style></style>
