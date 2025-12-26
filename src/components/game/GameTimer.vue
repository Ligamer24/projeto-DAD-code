<template>
  <div class="flex flex-col items-center justify-center w-fit h-fit bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-xl">
    <div 
      class="relative w-20 h-20 md:w-28 md:h-28 transition-all duration-500"
      :class="timerColor.glow"
    >
      <svg viewBox="0 0 120 120" class="transform -rotate-90 w-full h-full">
        <circle 
          cx="60" cy="60" r="54" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="8" 
          class="text-slate-200/50" 
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
          class="transition-all duration-1000 ease-linear shadow-sm"
          :class="timerColor.stroke"
        />
      </svg>

      <div class="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span 
          class="text-2xl md:text-3xl font-black transition-all duration-300"
          :class="[timerColor.text, { 'animate-pulse scale-110': timeLeft <= 5 }]"
        >
          {{ timeLeft }}
        </span>
        <span class="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">seg</span>
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

// Lógica de cores baseada na percentagem do tempo
const timerColor = computed(() => {
  const percentage = (timeLeft.value / props.duration) * 100;
  
  if (percentage > 50) {
    return { 
      stroke: 'text-emerald-500', 
      text: 'text-emerald-600', 
      glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
    };
  } else if (percentage > 20) {
    return { 
      stroke: 'text-amber-400', 
      text: 'text-amber-600', 
      glow: 'drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]' 
    };
  } else {
    return { 
      stroke: 'text-red-500', 
      text: 'text-red-600', 
      glow: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]' 
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