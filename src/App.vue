<script setup>
import { RouterLink } from 'vue-router';
import LoginPage from './pages/login/LoginPage.vue';


</script>

<template>
  <!-- <NavigationMenuLink>
    <RouterLink to="/login">Login</RouterLink>
  </NavigationMenuLink> -->
  <div>
    <main>
      <LoginPage />
    </main>
  </div>
</template>
<script>
  import { NavigationMenuLink } from '@/components/ui/navigation-menu';
  import { RouterLink, RouterView } from 'vue-router';
import LoginPage from './pages/login/LoginPage.vue';
</script>
<style>

</style>
