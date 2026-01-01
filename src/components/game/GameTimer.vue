<template>
  <div class="flex flex-col items-center justify-center w-fit h-fit bg-white rounded-3xl p-2 shadow-2xl border border-slate-100">
    <div 
      class="relative w-20 h-20 md:w-24 md:h-24 transition-all duration-500"
    >
      <svg viewBox="0 0 120 120" class="transform -rotate-90 w-full h-full">
        <circle 
          cx="60" cy="60" r="54" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="6" 
          class="text-slate-100" 
        />
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke="currentColor"
          stroke-width="10"
          stroke-linecap="round"
          :style="{ 
            strokeDasharray: totalDash, 
            strokeDashoffset: offset 
          }"
          class="transition-all duration-1000 ease-linear"
          :class="timerColor.stroke"
        />
      </svg>

      <div class="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span 
          class="text-3xl md:text-4xl font-black transition-all duration-300 tracking-tighter"
          :class="[timerColor.text, { 'animate-pulse': timeLeft <= 5 }]"
        >
          {{ timeLeft }}
        </span>
        <span class="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
          sec
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  duration: { type: Number, default: 20 }
});

const emit = defineEmits(['timeout']);

const timeLeft = ref(props.duration);
const totalDash = 2 * Math.PI * 54;
let timerInterval = null;

// Design-aligned color logic (Emerald -> Amber -> Rose)
const timerColor = computed(() => {
  const percentage = (timeLeft.value / props.duration) * 100;
  
  if (percentage > 50) {
    return { 
      stroke: 'text-emerald-500', 
      text: 'text-slate-900', // Kept slate for better readability on white
    };
  } else if (percentage > 25) {
    return { 
      stroke: 'text-amber-400', 
      text: 'text-slate-900', 
    };
  } else {
    return { 
      stroke: 'text-rose-500', 
      text: 'text-rose-600', 
    };
  }
});

const offset = computed(() => {
  return totalDash - (timeLeft.value / props.duration) * totalDash;
});

const startTimer = () => {
  stopTimer();
  timeLeft.value = props.duration;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      stopTimer();
      emit('timeout');
    }
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
};

onMounted(() => startTimer());
onUnmounted(() => stopTimer());

defineExpose({ reset: startTimer });
</script>