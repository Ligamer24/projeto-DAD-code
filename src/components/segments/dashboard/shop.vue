<script setup>
import Button from '@/components/ui/button/Button.vue';
import { useShopStore } from '@/stores/shop';
import {inject, onMounted, ref} from "vue";
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const shopStore = useShopStore();
const baseURL = inject('baseURL');

const isModalOpen = ref(false);
const itemToBuy = ref(null);

function selectCard(id) {
  shopStore.setSelectedDeck(id);
}

function openBuyModal(item) {
  itemToBuy.value = item;
  isModalOpen.value = true;
}

function closeBuyModal() {
  isModalOpen.value = false;
  itemToBuy.value = null;
}

async function confirmBuy() {
  if (!itemToBuy.value) return;
  
  try {
    await shopStore.purchaseItem(itemToBuy.value.id, itemToBuy.value.price);
    toast.success(`Successfully purchased ${itemToBuy.value.name}!`);
    closeBuyModal();
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to purchase item');
    closeBuyModal();
  }
}

function goToAddItem() {
  router.push('/shop/add');
}

onMounted(() => {
  shopStore.fetchItems();
  shopStore.getSelectedDeck();
});
</script>

<template>
  <div class="min-h-screen bg-lime-300 p-4">
    <ConfirmationModal 
      :isOpen="isModalOpen"
      title="Confirm Purchase"
      :message="itemToBuy ? `Are you sure you want to buy ${itemToBuy.name} for ${itemToBuy.price} coins?` : ''"
      @confirm="confirmBuy"
      @cancel="closeBuyModal"
    />

    <div class="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl mx-auto">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-widest text-rose-800 w-full text-center">SHOP</h2>
    </div>

    <div v-if="isAdmin" class="flex justify-center mt-4">
        <RouterLink to="/shop/add" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add New Item
        </RouterLink>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-4">
      <div v-for="item in shopStore.items" :key="item.id"
           class="bg-white/10 rounded-lg p-4 m-2 flex flex-col items-center shadow">
        <div class="flex flex-wrap justify-center p-2 -space-x-10 overflow-visible">
          <!-- Using the same image for back/front for now as placeholder or if backend provided multiple images we would use them -->
          <img :src="item.isLocal ? item.image : baseURL + item.image" alt="Back 1" class="w-20 -rotate-12"/>
          <img src="/src/assets/cards/default/c2.png" alt="Front" class="w-20 z-10 bg-white rounded"/>
          <img :src="item.isLocal ? item.image : baseURL + item.image" alt="Back 2" class="w-20 rotate-12 z-20"/>
        </div>
        <div class="text-center mt-2 font-bold text-rose-800">{{ item.name }}</div>
        <div class="text-center text-sm text-gray-700">{{ item.price }} Coins</div>
        
        <div v-if="item.owned">
            <Button @click="selectCard(item.id)"
                    :class="[
              'px-4 py-1 rounded-full border text-black font-bold min-w-24 text-center cursor-pointer mt-2',
              'transition-colors duration-150',
              'focus:outline-none',
              shopStore.selectedDeck === item.id
                ? 'bg-yellow-400 hover:bg-yellow-400'
                : 'bg-white border hover:bg-gray-100'
            ]">
              {{ shopStore.selectedDeck === item.id ? 'Selected' : 'Select' }}
            </Button>
        </div>
        <div v-else>
            <Button @click="openBuyModal(item)"
                    class="px-4 py-1 rounded-full border text-white font-bold min-w-24 text-center cursor-pointer mt-2 bg-green-500 hover:bg-green-600 focus:outline-none">
              Buy
            </Button>
        </div>
      </div>
    </div>
  </div>
</template>