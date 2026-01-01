import { defineStore } from 'pinia'
import { ref, inject } from 'vue'
import { toast } from 'vue-sonner'
import { useAPIStore } from './api'
import { useAuthStore } from './auth'
import { useGameStore } from './game'

const BISCA_TYPE = '9'

const COIN_BASE_WIN = 3
const COIN_CAPOTE_MULTIPIER = 4
const COIN_BANDEIRA_MULTIPIER = 6

const ID_COIN_MATCH_PAYOUT = 6

const SKIP_SLEEPS = false

export const useMatchStore = defineStore('match', () => {

    const apiStore = useAPIStore()
    const authStore = useAuthStore()
    const gameStore = useGameStore()
    const socket = inject('socket')
    if (authStore.anonymous) return
    // Estado (Placar da Partida 0-4)
    const marks = ref({ player1: 0, player2: 0 })
    const status = ref('idle') // 'idle', 'ongoing', 'finished'
    const gamesHistory = ref([])
    const isRanked = ref(false)
    const searching_player = ref(false)

    const player1_id = ref(null)
    const player2_id = ref(null)
    const currentUserId = authStore.currentUser?.id ?? -1
    const BOT_ID = authStore.BOT_ID
    const type = ref(9)
    const stake = ref(3)

    const opponent = ref({})
    const opponent_found = ref(false)

    const match_began = ref(false)

    const matchBeganAt = ref(undefined)
    const matchEndedAt = ref(undefined)
    const showStakeNegotiation = ref(false);

    let p1TotalPoints = 0
    let p2TotalPoints = 0

    let p1TotalAchievements = { capote: 0, bandeira: 0 }

    const multiplayerMatch = ref({})

    const calculateStake = () => {
        return (p1TotalAchievements.capote * COIN_CAPOTE_MULTIPIER + p1TotalAchievements.bandeira * COIN_BANDEIRA_MULTIPIER) + COIN_BASE_WIN
    }

    // Iniciar uma partida do zero
    const initMatch = async () => {
        console.log('Init match')
        
        player1_id.value = authStore.currentUser.id
        player2_id.value = BOT_ID 
        
        marks.value = { player1: 0, player2: 0 }
        status.value = 'ongoing'
        gamesHistory.value = []
        matchBeganAt.value = new Date()

        //multiplayer
        searching_player.value = true
    }

    // Adicionar pontos de vitória (1, 2 ou 4)
    const addScore = (winnerId, marksArgument, exactGameScore, gameMoves, gameBeganAt, gameEndedAt, trumpCard, coinsWonByPlayer) => {
        let p1Marks = 0
        let p2Marks = 0
        let p1CoinsWon = 0

        if (winnerId === 1) {
            marks.value.player1 += marksArgument
            p1Marks = marksArgument
            p1CoinsWon = coinsWonByPlayer
            winnerId = player1_id.value

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
            marksAwarded: { player1: p1Marks, player2: p2Marks }, //0, 1, 2 ou 4
            scoreDetail: { ...exactGameScore },   // Ex: { p1: 120, p2: 0 }
            trickByTrick: {  tricks: movesSnapshot, trump: trumpCard },
            began_at: gameBeganAt,
            ended_at: gameEndedAt,
            coinsWon: { player1: coinsWonByPlayer, player2: 0 },
        })


    }

    const saveMatch = async () => {
        let coinsWonByPlayer = 0
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
            console.log(game)
            const movesSnapshot = game.trickByTrick ? JSON.parse(JSON.stringify(game.trickByTrick)) : {};

            coinsWonByPlayer += game.coinsWon.player1

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
        }

        await saveCoinsUpdate(matchPostResult.id, coinsWonByPlayer)

    }

    const saveCoinsUpdate = async (matchId, coinsWonByPlayer) => {

        // Atualizar as coins do jogador
        const coinsObj = {
            transaction_datetime: new Date(),
            user_id: authStore.currentUser.id,
            match_id: matchId,
            coin_transaction_type_id: ID_COIN_MATCH_PAYOUT,
            coins: coinsWonByPlayer,
        }
        authStore.currentUser.coins += coinsWonByPlayer
        const user = await apiStore.updateCoinsUser(coinsWonByPlayer)
        apiStore.postCoinsTransaction(coinsObj)

        authStore.currentUser = user.data
    }

    const checkMatchWinner = () => {
        if (marks.value.player1 >= 4) {
            status.value = 'finished'
            toast.success("Match Won!")
            
        } else if (marks.value.player2 >= 4) {
            status.value = 'finished'
            toast.error("Match Lost")
        }

        if (isRanked.value && (marks.value.player1 >= 4 || marks.value.player2 >= 4)) {
            console.log("Guardar match!")
            matchEndedAt.value = new Date()
            saveMatch()
        }
    }

    //Multiplayer

    const resetState = () => {
        console.log('A limpar estado da Match...')

        marks.value = { player1: 0, player2: 0 }
        gamesHistory.value = []
        status.value = 'idle'
        player1_id.value = null
        player2_id.value = null
        multiplayerMatch.value = {}
        showStakeNegotiation.value = true;

        //Reset de sistema de procura do Rúben
        searching_player.value = false
        match_began.value = false
    }

    const setMultiplayerMatch = (serverMatch) => {
        console.log('[MatchStore] Recebi update do servidor:', serverMatch);
        if (!serverMatch) return
        player1_id.value = serverMatch.player1_id || serverMatch.player1
        player2_id.value = serverMatch.player2_id || serverMatch.player2

        multiplayerMatch.value = serverMatch

        const amIPlayer1 = player1_id.value === currentUserId;

        opponent.value = amIPlayer1 ? serverMatch.player2Data : serverMatch.player1Data;

        if (amIPlayer1) {
            marks.value = { 
                player1: serverMatch.marks.player1, 
                player2: serverMatch.marks.player2 
            };
        } else {
            marks.value = { 
                player1: serverMatch.marks.player2,
                player2: serverMatch.marks.player1
            };
        }
        status.value = serverMatch.status // 'ongoing', 'finished'
        matchBeganAt.value = serverMatch.created_at
        
        if (serverMatch.gamesHistory) {
            gamesHistory.value = serverMatch.gamesHistory
        }
    }

    socket.on('match-started', (data) => {
        console.log('[Bisca] Match created:', data)
        const game = data.game
        const match = data.match
        try {
            if (!window.matchFoundAudio) {
                window.matchFoundAudio = new Audio('/assets/Match_Found.mp3');
                window.matchFoundAudio.volume = 0.7;
                window.matchFoundAudio.preload = 'auto';
            }
            window.matchFoundAudio.currentTime = 0;
            const playPromise = window.matchFoundAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch((err) => console.warn('Audio play blocked:', err));
            }
        } catch (err) {
            console.warn('Error playing match found audio:', err);
        }

        setMultiplayerMatch(match);

        searching_player.value = false
        opponent_found.value = true
        // opponent.value = game.player1Data.id === currentUserId ? game.player2Data : game.player1Data
        gameStore.setMultiplayerGame(game)

        setTimeout(() => {
            match_began.value = true
        }, SKIP_SLEEPS ? 0 : 5000);
    });

    socket.on("match-update", (updatedMatch) => {
        console.log("[Match] Atualização da match:", updatedMatch)

        setMultiplayerMatch(updatedMatch)

        // Feedback visual para o utilizador
        // toast.info("A ronda terminou! Pontuação atualizada.")
    })

    socket.on("match-ended", (finalMatch) => {
        console.log("[Match] FIM DA PARTIDA:", finalMatch)

        setMultiplayerMatch(finalMatch, currentUserId)

        // const amIWinner = finalMatch.winner === currentUserId
    })
    socket.on("negotiation-update", ({ match }) => {
        console.log("[Match] negotiation-update recebido:", match);

        if (!match) return;

        multiplayerMatch.value = {
            ...match
        };
    });

    socket.on("stake-finalized", (accordedStake) => {
        console.log("[Match] stake-finalized recebido", accordedStake);
        showStakeNegotiation.value = false;
        stake.value = accordedStake
    });


    return {
        marks,
        status,
        gamesHistory,
        isRanked,
        opponent,
        type,
        stake,
        COIN_BASE_WIN,
        COIN_CAPOTE_MULTIPIER,
        COIN_BANDEIRA_MULTIPIER,
        initMatch,
        addScore,

        //Mutliplayer
        searching_player,
        opponent_found,
        match_began,
        multiplayerMatch,
        player1_id,
        showStakeNegotiation,
        resetState,
        setMultiplayerMatch,
    }
})