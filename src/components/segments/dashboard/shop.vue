<script setup>
import Button from '@/components/ui/button/Button.vue';
import { useShopStore } from '@/stores/shop';
import { useAPIStore } from '@/stores/api';
import {inject, onMounted, ref, computed} from "vue";
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const shopStore = useShopStore();
const apiStore = useAPIStore();
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

//Add coins script

const mostrarModalAddCoins = ref(false)
const apiErrorMessage = ref('')

// form of payment
const payment = ref({
  type: '',
  reference: '',
  value: null
})

// placeholders dinamicos para cada tipo
const placeholders = {
  MBWAY: 'Ex: 915785345',
  PAYPAL: 'Ex: john.doe@gmail.com',
  IBAN: 'Ex: PT50123456781234567812349',
  MB: 'Ex: 45634-123456789',
  VISA: 'Ex: 4321567812345678'
}

const currentPlaceholder = computed(() => placeholders[payment.value.type] || 'Selecione o tipo primeiro')

// função para submeter o formulário
const submitForm = async () => {
  console.log('Dados a enviar:', payment.value)
  try{
    const response = await apiStore.purchaseCoinsFromPaymentService(payment.value)
  } 
  catch (error){
    console.error(error)
    apiErrorMessage.value = 'Erro ao processar o pedido. Tente novamente.'
    return
  }
  apiErrorMessage.value = ''

  alert('Pedido de moedas enviado!')
  mostrarModalAddCoins.value = false
}


//
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
    <div class="flex justify-end mt-4 mr-50">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" @click="mostrarModalAddCoins = true">
        Add coins to your account
      </button>
    </div>
    <div 
      v-if="mostrarModalAddCoins" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h3 class="text-2xl font-bold mb-6 text-gray-800">Add Coins</h3>

        <form @submit.prevent="submitForm" class="space-y-5">
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Payment Type</label>
            <select v-model="payment.type" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="" disabled>Select payment method</option>
              <option value="MBWAY">MBWAY</option>
              <option value="PAYPAL">PAYPAL</option>
              <option value="IBAN">IBAN</option>
              <option value="MB">MB (Multibanco)</option>
              <option value="VISA">VISA</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Reference</label>
            <input 
              v-model="payment.reference" 
              type="text" 
              required 
              :placeholder="currentPlaceholder"
              class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Value (1-99)</label>
            <input 
              v-model.number="payment.value" 
              type="number" 
              min="1" 
              max="99" 
              step="1" 
              required
              placeholder="Enter amount"
              class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="mostrarModalAddCoins = false" class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">
              Cancel
            </button>
            <button type="submit" class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md">
              Confirm
            </button>
          </div>
        </form>
      </div>
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