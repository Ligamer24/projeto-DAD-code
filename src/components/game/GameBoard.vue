<template>
  <div class="flex flex-wrap gap-2 md:gap-8 justify-around items-center py-4 w-full max-w-7xl">

    <div class="flex flex-col gap-2 items-center justify-center">
      <div v-if="opponentPlayedCard">
        <GameCard :card="opponentPlayedCard" />
      </div>
      <div v-else
        class="md:w-28 md:h-40 w-12 h-18 border-2 border-dashed border-neutral-500 text-neutral-500 rounded-md flex items-center justify-center opacity-70">
        <span class="text-xs hidden md:block">Opponent</span>
      </div>

      <div v-if="playerPlayedCard">
        <GameCard :card="playerPlayedCard" />
      </div>
      <div v-else
        class="md:w-28 md:h-40 w-12 h-18 border-2 border-dashed border-neutral-500 text-neutral-500 rounded-md flex items-center justify-center opacity-70">
        <span class="text-xs hidden md:block">You</span>
      </div>
    </div>

    <div class="relative w-28 h-40 md:w-32 md:h-48 flex items-center justify-center">
      <img v-if="trunfo" :src="`/src/assets/cards/default/${trunfo.card}.png`"
        :class="['absolute w-12 md:w-full md:h-full z-0 md:-top-5', { 'opacity-30': trunfo && trunfo.used }]"
        alt="trunfo" />

      <div class="absolute z-10 md:w-full top-8 transition-transform hover:-translate-y-2 w-12">
        <img :src="deckImage" alt="Deck"
          class="w-full h-full rounded-sm shadow-lg rotate-90" />
        <p
          class="absolute inset-0 flex items-center justify-center font-extrabold text-white md:text-6xl text-xl drop-shadow-md">
          {{ deckCount }}
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-2 md:min-w-[120px] items-center justify-center">

      <div
        class="md:w-28 md:h-40 w-12 h-18 flex flex-col items-center justify-center bg-white/50 border-2 border-red-100 rounded-md shadow-sm">
        <span class="text-xs md:font-bold text-gray-400 uppercase tracking-widest mb-2">Score</span>
        <span class="md:text-5xl text-xl font-black text-red-600">{{ opponentScore ?? -1 }}</span>
        <span class="text-xs text-red-400 mt-1 font-medium">pts</span>
      </div>

      <div
        class="md:w-28 md:h-40 w-12 h-18 flex flex-col items-center justify-center bg-white/50 border-2 border-green-100 rounded-md shadow-sm">
        <span class="text-xs md:font-bold text-gray-400 uppercase tracking-widest mb-2">Score</span>
        <span class="md:text-5xl text-xl font-black text-green-600">{{ playerScore ?? -1 }}</span>
        <span class="text-xs text-green-400 mt-1 font-medium">pts</span>
      </div>

    </div>

    <div class="flex flex-col gap-2 md:min-w-[120px] items-center justify-center">

      <div class="md:w-28 md:h-40 w-12 h-18 flex items-center justify-center">
        <div v-if="lastOpponentCard" class="w-full h-full opacity-80 hover:opacity-100 transition-opacity">
          <GameCard :card="lastOpponentCard" />
        </div>
        <div v-else
          class="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-md">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Last<br>Round</span>
        </div>
      </div>

      <div class="md:w-28 md:h-40 w-12 h-18 flex items-center justify-center">
        <div v-if="lastPlayerCard" class="w-full h-full opacity-80 hover:opacity-100 transition-opacity">
          <GameCard :card="lastPlayerCard" />
        </div>
        <div v-else
          class="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-md">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Last<br>Round</span>
        </div>
      </div>


    </div>
    <!-- Área dos Avatares -->
    <div
      class="flex flex-col justify-between items-center bg-white/60 p-3 rounded-xl border border-white/50 shadow-sm min-h-[160px] w-20 md:w-28">

      <!-- OPPONENT -->
      <div class="flex flex-col items-center gap-1">
        <div class="relative">
          <Avatar class="size-10 lg:size-12 border-2 border-red-200 shadow-sm">
            <AvatarImage v-if="opponent?.photo_avatar_filename"
              :src="`${serverBaseURL}/storage/photos_avatars/${opponent.photo_avatar_filename}`"
              :alt="opponent?.name" />
            <AvatarFallback class="bg-red-100 text-red-700 font-bold">
              {{ opponent?.name?.charAt(0).toUpperCase() }}
            </AvatarFallback>
          </Avatar>

          <!-- Emote Bubble for Opponent -->
          <div v-if="showEmote && showEmote.user_id === opponent?.id"
               class="absolute top-0 right-full mr-3 bg-white p-2 rounded-2xl rounded-tr-none shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in duration-300 w-max flex justify-center">
            <img :src="`/assets/emotes/${showEmote.image}`" :alt="showEmote.name" class="w-20 h-20" />
            <div class="absolute top-3 -right-1.5 w-3 h-3 bg-white border-t border-r border-slate-100 transform rotate-45"></div>
          </div>

          <span v-if="currentTurn == opponent?.id" class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <div v-if="botStatus"
            class="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm animate-bounce whitespace-nowrap z-50">
              {{ botStatus }}
          </div>
        </div>
        <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-center">{{ opponent?.nickname ?? opponent?.name}}</span>
      </div>

      <!-- VS Separator -->
      <div class="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>

      <!-- PLAYER (ME) -->
      <div class="flex flex-col items-center gap-1">
        <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">You</span>

        <div class="relative">

          <Avatar class="size-10 lg:size-12 border-2 border-green-200 shadow-sm">
            <AvatarImage v-if="player?.photo_avatar_filename"
              :src="`${serverBaseURL}/storage/photos_avatars/${player?.photo_avatar_filename}`" :alt="player?.name" />
            <AvatarFallback class="bg-green-100 text-green-700 font-bold">
              {{ player?.name?.charAt(0).toUpperCase() ?? 'A' }}
            </AvatarFallback>
          </Avatar>

          <!-- Emote Bubble for Player -->
          <div v-if="showEmote && showEmote.user_id === player?.id"
               class="absolute bottom-0 right-full mr-3 bg-white p-2 rounded-2xl rounded-br-none shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in duration-300 w-max flex justify-center">
            <img :src="`/assets/emotes/${showEmote.image}`" :alt="showEmote.name" class="w-20 h-20" />
            <div class="absolute bottom-3 -right-1.5 w-3 h-3 bg-white border-t border-r border-slate-100 transform rotate-45"></div>
          </div>

          <span v-if="currentTurn === (player?.id ?? -1)" class="absolute -top-1 -right-1 flex h-3 w-3 z-10">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      </div>
    </div>
    <!-- Área do Botão Undo -->
    <div class="flex flex-col items-center justify-center min-w-[60px]">
      <button @click="$emit('undo')" :disabled="!playerPlayedCard || opponentPlayedCard"
        class="group flex flex-col items-center justify-center gap-1 p-3 rounded-full border-2 shadow-sm transition-all duration-200 
               
               /* (Normal) */
               bg-amber-100 text-amber-700 border-amber-200 
               hover:bg-amber-200 hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95
               
               /* (Desativado) */
               disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:transform-none"
        title="Undo Action">
        <!-- Ícone Undo -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          class="transition-transform duration-300 group-hover:rotate-[-45deg] group-disabled:rotate-0">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        <div v-if="isRanked"
          class="flex items-center gap-1 text-xs font-extrabold bg-amber-900/10 px-2 py-0.5 rounded-full text-amber-900 mt-1">
          {{ undoPrice }}
          <Coins />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import GameCard from './GameCard.vue'
import { ref, inject, computed } from "vue";
import { useShopStore } from "@/stores/shop.js";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Coins } from 'lucide-vue-next';

const serverBaseURL = inject("baseURL")
const shopStore = useShopStore()

defineProps({
  trunfo: Object,
  deckCount: Number,
  playerPlayedCard: Object,
  opponentPlayedCard: Object,
  opponentScore: Number,
  playerScore: Number,
  lastOpponentCard: Object,
  lastPlayerCard: Object,
  currentTurn: Number,
  player: Object,
  opponent: Object,
  undoPrice: Number,
  isRanked: Boolean,
  botStatus: String,
  showEmote: Object,
})

defineEmits(['undo'])

const deckImage = computed(() => {
    const selectedItem = shopStore.items.find(item => item.id === shopStore.selectedDeck)
    
    if (selectedItem) {
        if (selectedItem.isLocal) {
            return selectedItem.image
        } else {
            return selectedItem.image.startsWith('http') ? selectedItem.image : serverBaseURL + selectedItem.image
        }
    }
    
    return '/src/assets/cards/semFace_1.png'
})
</script>