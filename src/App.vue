<template>
  <Toaster/>

  <div>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
<script setup>
import {Toaster} from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import {RouterView} from 'vue-router';
</script>
<style></style>
