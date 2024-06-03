import { defineStore } from "pinia";
import axios from "axios";

const BASE_URL = "https://665b381c003609eda460387b.mockapi.io";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todoList: [],
    selectedTodo: {},
    statuses: ["In Progress", "Done"],
  }),
  actions: {
    async loadTodoList() {
      try {
        const response = await axios.get(`${BASE_URL}/todo`);
        this.todoList = response.data;
      } catch (err) {
        console.log(err);
      }
    },
    async loadTodo(id) {
      try {
        const response = await axios.get(`${BASE_URL}/todo/${id}`);
        this.selectedTodo = response.data;
      } catch (err) {
        console.log(err);
      }
    },
    async createTodo(formData) {
      try {
        await axios.post(`${BASE_URL}/todo`, formData);
      } catch (err) {
        console.log(err);
      }
    },
    async updateTodo(formData, id) {
      try {
        await axios.put(`${BASE_URL}/todo/${id}`, formData);
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    async deleteTodo(id) {
      try {
        await axios.delete(`${BASE_URL}/todo/${id}`);
      } catch (err) {
        console.log(err);
      }
    },
  },
});
