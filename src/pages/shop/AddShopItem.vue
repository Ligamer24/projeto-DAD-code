<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useShopStore } from '@/stores/shop';
import Button from '@/components/ui/button/Button.vue';

const router = useRouter();
const shopStore = useShopStore();

const name = ref('');
const price = ref(0);
const image = ref(null);
const loading = ref(false);

const handleFileChange = (event) => {
    image.value = event.target.files[0];
};

const submit = async () => {
    if (!name.value || !price.value || !image.value) {
        alert('Please fill all fields');
        return;
    }

    loading.value = true;
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('price', price.value);
    formData.append('image', image.value);

    try {
        await shopStore.addItem(formData);
        router.push('/shop');
    } catch (error) {
        console.error(error);
        alert('Failed to add item');
    } finally {
        loading.value = false;
    }
};

const goBack = () => {
    router.back();
};
</script>

<template>
    <div class="min-h-screen bg-lime-300 p-4 flex flex-col items-center">
        <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-bold mb-4 text-center text-rose-800">Add New Shop Item</h2>
            
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                    Name
                </label>
                <input v-model="name" id="name" type="text" placeholder="Item Name"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
                    Price (Coins)
                </label>
                <input v-model="price" id="price" type="number" placeholder="Price"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>

            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="image">
                    Image
                </label>
                <input @change="handleFileChange" id="image" type="file" accept="image/*"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>

            <div class="flex items-center justify-between">
                <Button @click="goBack" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancel
                </Button>
                <Button @click="submit" :disabled="loading" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    {{ loading ? 'Adding...' : 'Add Item' }}
                </Button>
            </div>
        </div>
    </div>
</template>
