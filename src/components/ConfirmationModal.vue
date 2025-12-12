<script setup>
import Button from '@/components/ui/button/Button.vue';

defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
      <h3 class="text-lg font-bold mb-2 text-gray-900">{{ title }}</h3>
      <p class="text-gray-700 mb-6">{{ message }}</p>
      <div class="flex justify-end space-x-4">
        <Button @click="$emit('cancel')" class="bg-gray-300 hover:bg-gray-400 text-gray-800">
          Cancel
        </Button>
        <Button @click="$emit('confirm')" class="bg-blue-600 hover:bg-blue-700 text-white">
          Confirm
        </Button>
      </div>
    </div>
  </div>
</template>
