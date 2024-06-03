<script setup>
import { onMounted, onUnmounted, reactive, defineProps } from "vue";
const remainingTime = reactive({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let intervalId;

const props = defineProps({
  endAt: String,
});

onMounted(() => {
  intervalId = setInterval(() => {
    const now = new Date();
    const endAt = new Date(props.endAt);
    const targetTime = endAt.getTime();
    const difference = targetTime - now.getTime();

    if (difference < 0) {
      remainingTime.days = 0;
      remainingTime.hours = 0;
      remainingTime.minutes = 0;
      remainingTime.seconds = 0;
      clearInterval(intervalId);
    } else {
      const seconds = Math.floor(difference / 1000) % 60;
      const minutes = Math.floor(difference / (1000 * 60)) % 60;
      const hours = Math.floor(difference / (1000 * 60 * 60)) % 24;
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      remainingTime.days = String(days).padStart(2, "0");
      remainingTime.hours = String(hours).padStart(2, "0");
      remainingTime.minutes = String(minutes).padStart(2, "0");
      remainingTime.seconds = String(seconds).padStart(2, "0");
    }
  }, 1000);

  onUnmounted(() => clearInterval(intervalId));
});
</script>

<template>
  <div>
    <div class="flex gap-5">
      <div>
        <span class="countdown font-mono text-4xl">
          {{ remainingTime.days }}
        </span>
        days
      </div>
      <div>
        <span class="countdown font-mono text-4xl">
          {{ remainingTime.hours }}
        </span>
        hours
      </div>
      <div>
        <span class="countdown font-mono text-4xl">
          {{ remainingTime.minutes }}
        </span>
        min
      </div>
      <div>
        <span class="countdown font-mono text-4xl">
          {{ remainingTime.seconds }}
        </span>
        sec
      </div>
    </div>
  </div>
</template>
