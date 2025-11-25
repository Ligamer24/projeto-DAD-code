import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

export const useMatchStore = defineStore('match', () => {
    
    // Estado (Placar da Partida 0-4)
    const scores = ref({ player1: 0, player2: 0 })
    const status = ref('idle') // 'idle', 'ongoing', 'finished'
    const gamesHistory = ref([])
    
    // Iniciar uma partida do zero
    const initMatch = () => {
        scores.value = { player1: 0, player2: 0 }
        status.value = 'ongoing'
        gamesHistory.value = []
    }

    // Adicionar pontos de vitória (1, 2 ou 4)
    const addScore = (winnerId, points, exactGameScore, gameMoves) => {
        let p1Points = 0
        let p2Points = 0
        if (winnerId === 1) {
            scores.value.player1 += points
            p1Points = points
        } else {
            scores.value.player2 += points
            p2Points = points
        }
        checkMatchWinner()
        
        gamesHistory.value.push({
            roundNumber: gamesHistory.value.length + 1,
            winner: winnerId,
            pointsAwarded: { player1: p1Points, player2: p2Points}, //0, 1, 2 ou 4
            scoreDetail: {...exactGameScore},   // Ex: { p1: 120, p2: 0 }
            trickByTrick: {...gameMoves}
        })

        console.log(gamesHistory)
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
        gamesHistory,
        initMatch,
        addScore
    }
})