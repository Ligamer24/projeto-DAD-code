import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { useAuthStore } from './auth'
import { useGameStore } from './game'
import { useMatchStore } from './match'

export const useSocketStore = defineStore('socket', () => {
  const socket = inject('socket')
  const authStore = useAuthStore()
  const gameStore = useGameStore()
  const matchStore = useMatchStore()
  const joined = ref(false)

  const emitJoin = (user) => {
    if (joined.value) return
    console.log(`[Socket] Joining Server`)
    socket.emit('join', user)
    joined.value = true
  }

  const emitLeave = () => {
    socket.emit('leave')
    console.log(`[Socket] Leaving Server`)
    joined.value = false
  }

  const handleConnection = () => {
    socket.on('connect', () => {
      console.log(`[Socket] Connected -- ${socket.id}`)
      if (authStore.isLoggedIn && !joined.value) {
        emitJoin(authStore.currentUser)
      }
    })

    socket.on('disconnect', () => {
      joined.value = false
      console.log(`[Socket] Disconnected -- ${socket.id}`)
    })
  }

  const emitGetGames = () => {
    socket.emit('get-games')
  }

  const handleGameEvents = () => {
    socket.on('games', (games) => {
      console.log(`[Socket] server emited games | game count ${games.length}`)
      gameStore.setGames(games) // Import and instantiate the game store
    })

    // socket.on('game-change', (game) => {
    //   console.log("Who the freak")
    //     gameStore.setMultiplayerGame(game)
    // })

    socket.on('negotiation-update', ({ match }) => {
      console.log('[Socket] negotiation-update', match);
      matchStore.multiplayerMatch.value = { ...match }
    });

  }

  const emitJoinGame = (game) => {
    console.log(`[Socket] Joining Game ${game.id}`)
    socket.emit('join-game', game.id, authStore.currentUser.id)
  }

  const emitRemoveUserSearchingGame = () => {
    socket.emit('leave')
  }

  const emitPlayCard = (matchId, gameId, card, userId) => {
    if (!socket || !socket.connected) return
      socket.emit('play-card', {
      matchID: matchId, 
      gameID: gameId, 
      card: card,
      userId: userId
  })
  }

  const emitPlayerTimeout = (matchId, gameId, userId) => {
    if (!socket || !socket.connected) return
      console.log('Emitting player-timeout via socket')
      socket.emit('player-timeout', { 
        matchId : matchId, 
        gameId : gameId, 
        userId : userId 
      })   
  }
  
  const emitForfeitMatch = (matchId, gameId, userId) => {
    if (!socket || !socket.connected) return
      console.log('Emitting forfeit-match via socket')
      socket.emit('forfeit-match', { 
        matchId : matchId,
        gameId : gameId,
        userId : userId 
      })   
  }

  // Dentro das ações do teu useSocketStore
  const emitProposeStake = (matchId, amount, userId) => {
    if (!socket || !socket.connected) return;
    console.log("Emitir proposta de aposta via socket:", amount);
    socket.emit("propose-stake", {
      matchId : matchId,
      userId: userId,
      amount: amount
    });
  }

  const emitAcceptStake = (matchId, userId) => {
    console.log("Emitir aceitação de aposta via socket");
    if (!socket || !socket.connected) return;
    socket.emit("accept-stake", {
      matchId: matchId,
      userId: userId
    });
  }

  // socket.on("round-ended", (data) => {

  //   // tableCards.value = data.lastRound.cards
  //   console.log(data)
  //   toast.info(`Trick Winner: ${data.lastRound.winner}`)

  //   setTimeout(() => {
  //       updateLocalGameState(data.game); 
  //   }, 2000)
  // })
  
  return {
    emitJoin,
    emitLeave,
    handleConnection,
    emitGetGames,
    handleGameEvents,
    emitJoinGame,
    emitRemoveUserSearchingGame,
    emitPlayCard,
    emitPlayerTimeout,
    emitForfeitMatch,
    emitProposeStake,
    emitAcceptStake
  }
})
