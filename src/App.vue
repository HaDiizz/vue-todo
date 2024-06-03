<script setup>
import { RouterView, RouterLink } from "vue-router";
</script>

<template>
  <div class="flex justify-start items-center gap-x-10 px-5 py-10">
    <div class="text-4xl font-bold">
      <RouterLink to="/">TODO 👻</RouterLink>
    </div>
  </div>
  <main class="px-5 py-3"><RouterView /></main>
</template>

<style scoped></style>
