<script setup>
import { onMounted, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { useTodoStore } from "../stores/todo";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Loading from "@/components/Loading.vue";
import TimeCountDown from "@/components/TimeCountDown.vue";

const todoStore = useTodoStore();
const todoName = ref("");
const searchName = ref("");
const todoEnd = ref(new Date());
const isLoading = ref(false);
const selectedStatus = ref("In Progress");

onMounted(async () => {
  isLoading.value = true;
  await todoStore.loadTodoList();
  isLoading.value = false;
});

const createTodo = async () => {
  isLoading.value = true;
  try {
    await todoStore.createTodo({ name: todoName.value, endAt: todoEnd.value });
    await todoStore.loadTodoList();
  } catch (err) {
    console.log(err);
  }
  isLoading.value = false;
};

const deleteTodo = async (id) => {
  isLoading.value = true;
  try {
    await todoStore.deleteTodo(id);
    await todoStore.loadTodoList();
  } catch (err) {
    console.log(err);
  }
  isLoading.value = false;
};

const todoFilter = computed(() => {
  return todoStore.todoList.filter(
    (todo) =>
      todo.isDone === (selectedStatus.value === "Done" ? true : false) &&
      todo.name.toLowerCase().includes(searchName.value.toLowerCase())
  );
});

const changeSelectedStatus = (newStatus) => {
  selectedStatus.value = newStatus;
};

const updateStatus = async (isDone, id) => {
  isLoading.value = true;
  try {
    await todoStore.updateTodo({ isDone }, id);
    await todoStore.loadTodoList();
  } catch (err) {
    console.log(err);
  }
  isLoading.value = false;
};

const changeDoneStatus = async (event, id) => {
  try {
    await updateStatus(event.target.checked, id);
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <div>
    <div class="py-5 flex justify-between items-center gap-x-5">
      <input
        type="text"
        placeholder="Todo..."
        class="input input-bordered w-full max-w-xl"
        v-model="todoName"
      />
      <VueDatePicker v-model="todoEnd"></VueDatePicker>
      <button
        :disabled="todoName === '' || todoEnd === '' || !todoEnd"
        @click="createTodo"
        class="btn btn-active btn-accent text-white"
      >
        Create
      </button>
    </div>
    <div class="tabs tabs-boxed my-2 w-full md:max-w-lg">
      <a
        v-for="status in todoStore.statuses"
        :key="status"
        :class="status === selectedStatus ? 'tab tab-active' : 'tab'"
        @click="changeSelectedStatus(status)"
      >
        {{ status }}
      </a>
    </div>
    <div>
      <Loading v-if="isLoading"></Loading>
      <label class="input input-bordered flex items-center gap-2 my-5">
        <input
          type="text"
          class="grow"
          placeholder="Search"
          v-model="searchName"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-4 h-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </label>
      <div
        class="flex justify-between items-center px-10 py-3"
        v-for="todo in todoFilter"
        :key="todo.id"
      >
        <input
          type="checkbox"
          :checked="todo.isDone"
          class="checkbox"
          @change="changeDoneStatus($event, todo.id)"
        />
        <div class="tooltip tooltip-accent" :data-tip="todo.name">
          <div :class="todo.isDone ? 'line-through' : ''">
            {{
              todo.name.length > 20
                ? todo.name.substring(0, 20) + "..."
                : todo.name
            }}
          </div>
        </div>
        <div class="md:block hidden"><TimeCountDown :endAt="todo.endAt" /></div>
        <div class="flex gap-x-5">
          <RouterLink :to="{ name: 'edit-todo-list', params: { id: todo.id } }">
            <button class="btn btn-square">
              <svg
                class="w-[18px] h-[18px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </RouterLink>
          <button
            @click="deleteTodo(todo.id)"
            class="btn btn-square btn-error text-white"
          >
            <svg
              class="w-[18px] h-[18px] text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
