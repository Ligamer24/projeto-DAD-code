import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

export const useMatchStore = defineStore('match', () => {
    
    // Estado (Placar da Partida 0-4)
    const scores = ref({ player1: 0, player2: 0 })
    const status = ref('idle') // 'idle', 'ongoing', 'finished'
    
    // Iniciar uma partida do zero
    const initMatch = () => {
        scores.value = { player1: 0, player2: 0 }
        status.value = 'ongoing'
    }

    // Adicionar pontos de vitória (1, 2 ou 4)
    const addScore = (winnerId, points) => {
        if (winnerId === 1) {
            scores.value.player1 += points
        } else {
            scores.value.player2 += points
        }
        checkMatchWinner()
    }

    const checkMatchWinner = () => {
        if (scores.value.player1 >= 4) {
            status.value = 'finished'
            toast.success("Match Won!")
        } else if (scores.value.player2 >= 4) {
            status.value = 'finished'
            toast.error("Match Lost")
        }
    }

    return {
        scores,
        status,
        initMatch,
        addScore
    }
})