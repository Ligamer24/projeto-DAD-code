import { defineStore } from 'pinia'
import { ref, computed, inject } from 'vue'
import { useAuthStore } from './auth'
import { useAPIStore } from './api'
import { useMatchStore } from './match'
import { toast } from 'vue-sonner'

//Definição das Cartas
const ALL_CARDS = [
  // --- PAUS (Clubs) ---
  { card: "p1", value: 11, suit: 'clubs', label: 'Ás de Paus' },
  { card: "p7", value: 10, suit: 'clubs', label: 'Sete de Paus' },
  { card: "p13", value: 4, suit: 'clubs', label: 'Rei de Paus' },
  { card: "p11", value: 3, suit: 'clubs', label: 'Valete de Paus' },
  { card: "p12", value: 2, suit: 'clubs', label: 'Dama de Paus' },
  { card: "p6", value: 0, suit: 'clubs', label: 'Seis de Paus' },
  { card: "p5", value: 0, suit: 'clubs', label: 'Cinco de Paus' },
  { card: "p4", value: 0, suit: 'clubs', label: 'Quatro de Paus' },
  { card: "p3", value: 0, suit: 'clubs', label: 'Três de Paus' },
  { card: "p2", value: 0, suit: 'clubs', label: 'Dois de Paus' },

  // --- ESPADAS (Spades) ---
  { card: "e1", value: 11, suit: 'spades', label: 'Ás de Espadas' },
  { card: "e7", value: 10, suit: 'spades', label: 'Sete de Espadas' },
  { card: "e13", value: 4, suit: 'spades', label: 'Rei de Espadas' },
  { card: "e11", value: 3, suit: 'spades', label: 'Valete de Espadas' },
  { card: "e12", value: 2, suit: 'spades', label: 'Dama de Espadas' },
  { card: "e6", value: 0, suit: 'spades', label: 'Seis de Espadas' },
  { card: "e5", value: 0, suit: 'spades', label: 'Cinco de Espadas' },
  { card: "e4", value: 0, suit: 'spades', label: 'Quatro de Espadas' },
  { card: "e3", value: 0, suit: 'spades', label: 'Três de Espadas' },
  { card: "e2", value: 0, suit: 'spades', label: 'Dois de Espadas' },

  // --- OUROS (Diamonds) ---
  { card: "o1", value: 11, suit: 'diamonds', label: 'Ás de Ouros' },
  { card: "o7", value: 10, suit: 'diamonds', label: 'Sete de Ouros' },
  { card: "o13", value: 4, suit: 'diamonds', label: 'Rei de Ouros' },
  { card: "o11", value: 3, suit: 'diamonds', label: 'Valete de Ouros' },
  { card: "o12", value: 2, suit: 'diamonds', label: 'Dama de Ouros' },
  { card: "o6", value: 0, suit: 'diamonds', label: 'Seis de Ouros' },
  { card: "o5", value: 0, suit: 'diamonds', label: 'Cinco de Ouros' },
  { card: "o4", value: 0, suit: 'diamonds', label: 'Quatro de Ouros' },
  { card: "o3", value: 0, suit: 'diamonds', label: 'Três de Ouros' },
  { card: "o2", value: 0, suit: 'diamonds', label: 'Dois de Ouros' },

  // --- COPAS (Hearts) ---
  { card: "c1", value: 11, suit: 'hearts', label: 'Ás de Copas' },
  { card: "c7", value: 10, suit: 'hearts', label: 'Sete de Copas' },
  { card: "c13", value: 4, suit: 'hearts', label: 'Rei de Copas' },
  { card: "c11", value: 3, suit: 'hearts', label: 'Valete de Copas' },
  { card: "c12", value: 2, suit: 'hearts', label: 'Dama de Copas' },
  { card: "c6", value: 0, suit: 'hearts', label: 'Seis de Copas' },
  { card: "c5", value: 0, suit: 'hearts', label: 'Cinco de Copas' },
  { card: "c4", value: 0, suit: 'hearts', label: 'Quatro de Copas' },
  { card: "c3", value: 0, suit: 'hearts', label: 'Três de Copas' },
  { card: "c2", value: 0, suit: 'hearts', label: 'Dois de Copas' },
]

export const useGameStore = defineStore("game", () => {
  // 1. Dependências
  const authStore = useAuthStore()
  const apiStore = useAPIStore()
  const matchStore = useMatchStore()
//   const socket = inject('socket')

  // 2. Estado do Jogo (Cartas)
  const deck = ref([])
  const player1Hand = ref([])
  const player2Hand = ref([])
  const trunfo = ref(null)        // A carta física (visual)
  const trumpSuit = ref('')       // O naipe da regra (lógica)
  const tableCards = ref([])      // Cartas jogadas na mesa na ronda atual
  const lastRoundCards = ref([])  // Guarda as cartas da ronda anterior
  const moves = ref([])           // Histórico de jogadas
  const currentTurn = ref(1)

  // Estado interno do jogo
  const scores = ref({ player1: 0, player2: 0 }) 
  const gameEnded = ref(false)

  // 3. Estado Multiplayer
  const games = ref([]) // Lista de jogos no lobby
  const multiplayerGame = ref({}) // Estado do jogo multiplayer atual

  // ------------------------------------------------------------------------
  // LÓGICA SINGLEPLAYER (LOCAL)
  // ------------------------------------------------------------------------

  const startNewGame = () => {
    gameEnded.value = false
    scores.value = { player1: 0, player2: 0 }
    moves.value = []
    tableCards.value = []
    lastRoundCards.value = [] 
    currentTurn.value = 1
    shuffle()
    dealInitialCards()
  }

  const shuffle = () => {
    deck.value = JSON.parse(JSON.stringify(ALL_CARDS)) // Deep copy
    for (let i = deck.value.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck.value[i], deck.value[j]] = [deck.value[j], deck.value[i]];
    }
  }

  const dealInitialCards = () => {
    // Define a carta visual
    trunfo.value = deck.value[0]
    trunfo.value.used = false

    trumpSuit.value = trunfo.value.suit
    
    deck.value = deck.value.slice(1)


    // Dar cartas
    player1Hand.value = deck.value.slice(0, 9)

    player2Hand.value = deck.value.slice(9, 18)
    deck.value = deck.value.slice(18)
  }

  const getCardStrength = (cardId) => {
    // Extrai o número da carta (ex: "c7" -> "7")
    const rank = parseInt(cardId.substring(1)) 
    
    switch (rank) {
        case 1: return 20;  // Ás
        case 7: return 19;   // Sete
        case 13: return 18;  // Rei
        case 11: return 17;  // Valete
        case 12: return 16;  // Dama
        default: return rank; // 6, 5, 4, 3, 2 valem o seu número
    }
  }

  const playCardLocal = async (card, playerNumber) => {
    // Validar se é a vez do jogador
    if (playerNumber !== currentTurn.value) return 

    // Remove da mão
    if (playerNumber === 1) {
        player1Hand.value = player1Hand.value.filter(c => c.card !== card.card)
    } else {
        player2Hand.value = player2Hand.value.filter(c => c.card !== card.card)
    }

    // Adiciona à mesa
    tableCards.value.push({ ...card, player: playerNumber })

    // Se já há 2 cartas na mesa, verifica o vencedor
    if (tableCards.value.length === 2) {
        // Pequeno delay para os jogadores verem o que aconteceu
        setTimeout(() => {
            checkRoundWinner()
        }, 1500)
    } else {
        // Se só há 1 carta, passa a vez para o outro
        currentTurn.value = playerNumber === 1 ? 2 : 1
        
        // Se a vez passou para o Bot, manda-o jogar
        if (currentTurn.value === 2) {
            playBotTurn()
        }
    }
  }

  // --- LÓGICA PRINCIPAL: Verificar Vencedor da Vaza ---
  const checkRoundWinner = () => {
    const c1 = tableCards.value[0] // Carta de Saída (quem jogou primeiro)
    const c2 = tableCards.value[1] // Carta de Resposta

    const currentTrumpSuit = trumpSuit.value

    let winnerPlayer = c1.player // Assume que o primeiro ganha por defeito
    
    // CASO 1: O segundo jogador jogou Trunfo e o primeiro não
    if (c2.suit === currentTrumpSuit && c1.suit !== currentTrumpSuit) {
        winnerPlayer = c2.player
    }
    // CASO 2: Ambos jogaram o mesmo naipe
    else if (c2.suit === c1.suit) {
        // Compara força (Strength) e não valor (Value)
        if (getCardStrength(c2.card) > getCardStrength(c1.card)) {
            winnerPlayer = c2.player
        }
    }
    // CASO 3: Naipes diferentes e nenhum é trunfo -> O primeiro jogador mantém a vitória (winnerPlayer = c1.player)

    // --- Processar Vitória ---
    const points = c1.value + c2.value
    
    if (winnerPlayer === 1) {
        scores.value.player1 += points
        toast.success(`You won the round! (+${points} pts)`)
    } else {
        scores.value.player2 += points
        toast.info(`Opponent won the round. (+${points} pts)`)
    }

    lastRoundCards.value = [...tableCards.value]

    // Limpar Mesa
    tableCards.value = []

    // Atualizar quem joga primeiro na próxima
    currentTurn.value = winnerPlayer

    // Pescar Cartas (Draw) se o baralho ainda tiver cartas
    if (deck.value.length > 0) {
        drawCards(winnerPlayer)
    } else {
        // Se não há cartas no baralho e as mãos acabaram, o jogo acabou
        if (player1Hand.value.length === 0) {
            processGameEnd()
            return
        }
    }

    // Se for a vez do Bot jogar primeiro na nova ronda
    if (currentTurn.value === 2) {
        playBotTurn()
    }
  }

  // --- Pescar Cartas do Baralho ---
  const drawCards = (winnerId) => {
    // Se não há deck nem trunfo na mesa, não há nada para pescar
    if (deck.value.length === 0 && !trunfo.value || trunfo.value.used) return

    // Função auxiliar para tirar uma carta (do topo ou o trunfo final)
    const pullCard = () => {
        if (deck.value.length > 0) {
            return deck.value.shift() // Tira do baralho
        } else if (trunfo.value) {
            // Se o baralho acabou, a carta a pescar é o Trunfo da mesa
            const finalCard = trunfo.value
            trunfo.value.used = true // Remove o trunfo visualmente da mesa
            return finalCard
        }
        return null
    }

    // 1. O Vencedor da vaza pesca SEMPRE primeiro
    const cardForWinner = pullCard()
    
    // 2. O Perdedor pesca em segundo
    const cardForLoser = pullCard()

    // 3. Distribuir para as mãos corretas
    if (winnerId === 1) {
        if (cardForWinner) player1Hand.value.push(cardForWinner)
        if (cardForLoser) player2Hand.value.push(cardForLoser)
    } else {
        // Se o Bot (2) ganhou
        if (cardForWinner) player2Hand.value.push(cardForWinner)
        if (cardForLoser) player1Hand.value.push(cardForLoser)
    }
  }

  const processGameEnd = () => {
        gameEnded.value = true
        
        const p1Points = scores.value.player1
        const p2Points = scores.value.player2
        let victoryPoints = 0
        let winnerId = null

        if (p1Points === 60) {
            toast.info("Empate no jogo! Ninguém pontua na match.")
            return
        }

        if (p1Points > 60) {
            winnerId = 1
            
            if (p1Points >= 120) victoryPoints = 4
            else if (p1Points >= 91) victoryPoints = 2
            else victoryPoints = 1
        } else {
            winnerId = 2
            if (p2Points >= 120) victoryPoints = 4
            else if (p2Points >= 91) victoryPoints = 2
            else victoryPoints = 1
        }
        
        console.log("Winner id:", winnerId)
        matchStore.addScore(winnerId, victoryPoints, scores.value)
    }

  // --- Atualização do playBotTurn para respeitar as regras ---
  const playBotTurn = async () => {
    if (player2Hand.value.length === 0) return
    
    // Delay de pensamento
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Se o Bot for o segundo a jogar, deve tentar assistir (seguir naipe)
    let cardToPlay = null
    
    if (tableCards.value.length === 1) {
        const leadSuit = tableCards.value[0].suit
        // Tenta achar uma carta do mesmo naipe
        const sameSuitCards = player2Hand.value.filter(c => c.suit === leadSuit)
        
        if (sameSuitCards.length > 0) {
            // Joga uma aleatória do mesmo naipe (ou a mais alta para ganhar)
            const randomIndex = Math.floor(Math.random() * sameSuitCards.length)
            cardToPlay = sameSuitCards[randomIndex]
        }
    }

    // Se não tiver do mesmo naipe ou for o primeiro a jogar, joga qualquer uma
    if (!cardToPlay) {
        const randomIndex = Math.floor(Math.random() * player2Hand.value.length)
        cardToPlay = player2Hand.value[randomIndex]
    }

    playCardLocal(cardToPlay, 2)
  }

//   // ------------------------------------------------------------------------
//   // LÓGICA MULTIPLAYER (SOCKETS)
//   // ------------------------------------------------------------------------

//   // Criar Jogo (Lobby)
//   const createGame = (options = {}) => {
//     if (!authStore.currentUser) {
//       toast.error('Tens de fazer login para criar um jogo')
//       return
//     }
//     if (!socket || !socket.connected) {
//       toast.error('Sem conexão ao servidor.')
//       return
//     }
//     // Emite para o servidor criar a sala
//     socket.emit('create-game', options)
//   }

//   // Receber lista de jogos (Lobby)
//   const setGames = (newGames) => {
//     games.value = newGames
//     console.log(`[Bisca] Games list updated: ${games.value.length} games`)
//   }

//   // Receber estado do jogo atual do servidor
//   const setMultiplayerGame = (gameState) => {
//     multiplayerGame.value = gameState
//     // Aqui podes sincronizar o estado local visual com o estado do servidor
//     // Ex: trunfo.value = gameState.trunfo
//   }

//   // Jogar uma carta (Multiplayer)
//   const playCardMultiplayer = (card) => {
//     if (!socket || !socket.connected) return
//     socket.emit('play-card', { gameId: multiplayerGame.value.id, card: card })
//   }

//   // ------------------------------------------------------------------------
//   // COMPUTED PROPERTIES (GETTERS)
//   // ------------------------------------------------------------------------

//   const myGames = computed(() => {
//     if (!authStore.currentUser) return []
//     return games.value.filter((g) => g.creator == authStore.currentUser.id)
//   })

//   const availableGames = computed(() => {
//     if (!authStore.currentUser) return []
//     return games.value.filter((g) => g.creator != authStore.currentUser.id && g.status === 'pending')
//   })

//   // Exemplo: Saber se é a minha vez (assumindo que o servidor manda 'currentTurnPlayerId')
//   const isMyTurn = computed(() => {
//     if (!multiplayerGame.value || !authStore.currentUser) return false
//     return multiplayerGame.value.currentTurnPlayerId === authStore.currentUser.id
//   })

  return {
    // State Local
    deck,
    player1Hand,
    player2Hand,
    trunfo,
    tableCards,
    lastRoundCards,
    scores,
    currentTurn,
    gameEnded,

    // Actions Local
    startNewGame,
    playCardLocal,
    playBotTurn,
    checkRoundWinner

    // // State Multiplayer
    // games,
    // multiplayerGame,
    
    // // Actions Multiplayer
    // createGame,
    // setGames,
    // setMultiplayerGame,
    // playCardMultiplayer,

    // // Computeds
    // myGames,
    // availableGames,
    // isMyTurn
  }
})