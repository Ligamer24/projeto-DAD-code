import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useAPIStore } from './api'
import { useAuthStore } from './auth'

const BISCA_TYPE = '9'

const COIN_BASE_WIN = 3
const COIN_CAPOTE_MULTIPIER = 5
const COIN_BANDEIRA_MULTIPIER = 20

export const useMatchStore = defineStore('match', () => {
    
    const apiStore = useAPIStore()
    const authStore = useAuthStore()
    if (authStore.anonymous) return
    // Estado (Placar da Partida 0-4)
    const marks = ref({ player1: 0, player2: 0 })
    const status = ref('idle') // 'idle', 'ongoing', 'finished'
    const gamesHistory = ref([])
    const player1_id = authStore.currentUser.id

    const BOT_ID = authStore.BOT_ID

    const matchBeganAt = ref(undefined)
    const matchEndedAt = ref(undefined)

    let p1TotalPoints = 0
    let p2TotalPoints = 0

    let p1TotalAchievements = { capote: 0, bandeira: 0}

    const calculateStake = () => {
        return (p1TotalAchievements.capote * COIN_CAPOTE_MULTIPIER + p1TotalAchievements.bandeira * COIN_BANDEIRA_MULTIPIER) + COIN_BASE_WIN
    }
    
    // Iniciar uma partida do zero
    const initMatch = () => {
        marks.value = { player1: 0, player2: 0 }
        status.value = 'ongoing'
        gamesHistory.value = []
        matchBeganAt.value = new Date()
    }

    // Adicionar pontos de vitória (1, 2 ou 4)
    const addScore = (winnerId, marksArgument, exactGameScore, gameMoves, gameBeganAt, gameEndedAt, trumpCard) => {
        let p1Marks = 0
        let p2Marks = 0

        
        
        
        if (winnerId === 1) {
            marks.value.player1 += marksArgument
            p1Marks = marksArgument
            winnerId = player1_id
            
            if (marksArgument == 2) p1TotalAchievements.capote += 1
            else if (marksArgument == 4) p1TotalAchievements.bandeira += 1
        } else if (winnerId === 2) {
            marks.value.player2 += marksArgument
            p2Marks = marksArgument
            winnerId = BOT_ID
        } else {
            winnerId = null
        }
        
        p1TotalPoints += exactGameScore.player1
        p2TotalPoints += exactGameScore.player2

        checkMatchWinner()

        const movesSnapshot = gameMoves ? JSON.parse(JSON.stringify(gameMoves)) : [];
        gamesHistory.value.push({
            roundNumber: gamesHistory.value.length + 1,
            winner: winnerId,
            marksAwarded: { player1: p1Marks, player2: p2Marks}, //0, 1, 2 ou 4
            scoreDetail: {...exactGameScore},   // Ex: { p1: 120, p2: 0 }
            trickByTrick: { tricks: movesSnapshot, trump: trumpCard},
            began_at: gameBeganAt,
            ended_at: gameEndedAt, 
        })

        
    }

    const saveMatch = async () => {
                const player1_id = authStore.currentUser ? authStore.currentUser.id : undefined
                const match = {
                type: BISCA_TYPE,
                player1_user_id: player1_id,
                player2_user_id: BOT_ID,
                winner_user_id: marks.value.player1 >= 4 ? authStore.currentUser.id : BOT_ID,
                loser_user_id: marks.value.player1 < 4 ? authStore.currentUser.id : BOT_ID,
                status: 'Ended',
                stake: calculateStake(),
                began_at: matchBeganAt.value,
                ended_at: matchEndedAt.value,
                total_time: Math.ceil((matchEndedAt.value - matchBeganAt.value) / 1000),
                player1_marks: marks.value.player1,
                player2_marks: marks.value.player2,
                player1_points: p1TotalPoints,
                player2_points: p2TotalPoints,
                }
                const matchPostResult = (await apiStore.postMatch(match)).data
                
                for (const game of gamesHistory.value) {
                    const movesSnapshot = game.trickByTrick ? JSON.parse(JSON.stringify(game.trickByTrick)) : {};

                    const gameObj = {
                        type: BISCA_TYPE,
                        player1_user_id: player1_id,
                        player2_user_id: BOT_ID,
                        is_draw: game.winner ? 0 : 1,
                        winner_user_id: game.winner === player1_id ? player1_id : (game.winner === BOT_ID ? BOT_ID : null),
                        loser_user_id: game.winner === BOT_ID ? player1_id : (game.winner === player1_id ? BOT_ID : null),
                        match_id: matchPostResult.id,
                        status: 'Ended',
                        began_at: game.began_at,
                        ended_at: game.ended_at,
                        total_time: Math.ceil((game.ended_at - game.began_at) / 1000),
                        player1_points: game.scoreDetail.player1,
                        player2_points: game.scoreDetail.player2,
                        custom: movesSnapshot
                    }

                    await apiStore.postGame(gameObj)
                };
        }

    const checkMatchWinner = () => {
        if (marks.value.player1 >= 4) {
            status.value = 'finished'
            toast.success("Match Won!")
            matchEndedAt.value = new Date()
            saveMatch()

        } else if (marks.value.player2 >= 4) {
            status.value = 'finished'
            toast.error("Match Lost")
            matchEndedAt.value = new Date()
            saveMatch()
        }
    }

    

    return {
        marks,
        status,
        gamesHistory,
        initMatch,
        addScore
    }
})