import {defineStore} from "pinia";
import {computed, inject, ref} from "vue";
import {useAuthStore} from "./auth";
import {useAPIStore} from "./api";
import {useMatchStore} from "./match";
import {toast} from "vue-sonner";
import {useEmotesStore} from "@/stores/emotes.js";
import { getCardStrength, setupNewGame } from "@/utils/gameLogic";

const SKIP_SLEEPS = false

const UNDO_ACTION_PRICE_BASE = 3

export const useGameStore = defineStore("game", () => {
            // 1. Dependências
            const authStore = useAuthStore();
            const apiStore = useAPIStore();
            const matchStore = useMatchStore();
            const socket = inject('socket')
            const emoteStore = useEmotesStore();

            const BOT_ID = authStore.BOT_ID
            const botStatus = ref('');
            const currentUserId = authStore.currentUser?.id ?? -1

            // 2. Estado do Jogo (Cartas)
            const deck = ref([]);
            const player1Hand = ref([]);
            const player2Hand = ref([]);
            const trunfo = ref(null); // A carta física (visual)
            const trumpSuit = ref(""); // O naipe da regra (lógica)
            const tableCards = ref([]); // Cartas jogadas na mesa na ronda atual
            const lastRoundCards = ref([]); // Guarda as cartas da ronda anterior
            const moves = ref([]); // Histórico de jogadas
            const currentTurn = ref(0);
            let gameBeganAt;
            let gameEndedAt;

            // Estado interno do jogo
            const scores = ref({player1: 0, player2: 0});
            const gameEnded = ref(false);

            //Variáveis auxiliares para o undo action
            let increment
            let lastMove
            const undoPrice = ref(UNDO_ACTION_PRICE_BASE)

            // 3. Estado Multiplayer
            const matches = ref([]); // Lista de jogos no lobby
            const multiplayerGame = ref({}); // Estado do jogo multiplayer atual

            const isRanked = computed(() => matchStore.isRanked)

            // ------------------------------------------------------------------------
            // VARS PARA SOCKETS
            // ------------------------------------------------------------------------

            const searching_player = ref(false)
            const opponent = ref({})
            const opponent_found = ref(false)
            const game_began = ref(false)

            const myHand = ref([])
            const opponentHand = ref([])
            const myScore = ref(0)
            const opponentScore = ref(0)

            // ------------------------------------------------------------------------
            // LÓGICA SINGLEPLAYER (LOCAL)
            // ------------------------------------------------------------------------

            const startNewGame = () => {
                if (isRanked.value) {
                    searching_player.value = true
                    searching_player.value = true
                    opponent.value = {}
                    opponent_found.value = false
                    game_began.value = false
                    createMatch({
                        ...authStore.currentUser
                    });
                    return
                }


                gameEnded.value = false
                scores.value = {player1: 0, player2: 0}
                moves.value = []
                tableCards.value = []
                lastRoundCards.value = []
                currentTurn.value = authStore.currentUser?.id ?? -1
                gameBeganAt = new Date()

                const gameData = setupNewGame()
                trunfo.value = gameData.trunfo
                trumpSuit.value = gameData.trumpSuit
                player1Hand.value = gameData.player1Hand
                player2Hand.value = gameData.player2Hand
                deck.value = gameData.deck

                //Variáveis auxiliares para o undo action
                increment = 1
                lastMove = 1
                //

            }

            const playCardLocal = async (card, playerNumber) => {
                // Validar se é a vez do jogador
                if (playerNumber !== currentTurn.value) return;

                if (deck.value.length === 0 && tableCards.value.length === 1) {

                    const leadSuit = tableCards.value[0].suit; // O naipe que foi puxado
                    const playedSuit = card.suit;              // O naipe que o jogador está a tentar jogar

                    // Se o jogador não está a seguir o naipe
                    if (playedSuit !== leadSuit && playedSuit !== trumpSuit.value) {
                        // Confirmar se tem alguma carta desse naipe na mão
                        const handToCheck = playerNumber === currentUserId ? player1Hand.value : player2Hand.value;
                        const hasSuit = handToCheck.some(c => c.suit === leadSuit);

                        if (hasSuit) {
                            // Se tem o naipe, bloqueia a jogada e avisa
                            toast.warning(`You must assist with ${leadSuit} suit!`);
                            return; // Não joga a carta
                        }
                    }
                }

                // Remove da mão
                if (playerNumber === currentUserId) {
                    player1Hand.value = player1Hand.value.filter(c => c.card !== card.card)
                    console.log(playerNumber === currentUserId)
                } else {
                    player2Hand.value = player2Hand.value.filter((c) => c.card !== card.card);
                }

                // Adiciona à mesa
                tableCards.value.push({...card, player: playerNumber === currentUserId ? currentUserId : BOT_ID})

                // Se já há 2 cartas na mesa, verifica o vencedor
                if (tableCards.value.length === 2) {
                    // Pequeno delay para os jogadores verem o que aconteceu
                    setTimeout(() => {

                        checkRoundWinner()
                    }, SKIP_SLEEPS ? 0 : 1500)
                } else {
                    // Se só há 1 carta, passa a vez para o outro
                    currentTurn.value = playerNumber === currentUserId ? BOT_ID : currentUserId

                    // Se a vez passou para o Bot, manda-o jogar
                    if (currentTurn.value === BOT_ID) {
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
                    winnerPlayer = c2.player;
                }
                // CASO 2: Ambos jogaram o mesmo naipe
                else if (c2.suit === c1.suit) {
                    // Compara força (Strength) e não valor (Value)
                    if (getCardStrength(c2.card) > getCardStrength(c1.card)) {
                        winnerPlayer = c2.player;
                    }
                }
                // CASO 3: Naipes diferentes e nenhum é trunfo -> O primeiro jogador mantém a vitória (winnerPlayer = c1.player)

                // --- Processar Vitória ---
                const points = c1.value + c2.value

                if (winnerPlayer === currentUserId) {
                    scores.value.player1 += points
                    toast.success(`You won the round! (+${points} pts)`)
                } else {
                    scores.value.player2 += points;
                    toast.info(`Opponent won the round. (+${points} pts)`);
                }

                lastRoundCards.value = [...tableCards.value];
                lastRoundCards.value.push({trickWinner: winnerPlayer});
                moves.value.push(lastRoundCards.value);

                // Limpar Mesa
                tableCards.value = [];

                // Atualizar quem joga primeiro na próxima
                currentTurn.value = winnerPlayer;

                // Atualizar o price do undoAction
                undoPrice.value = UNDO_ACTION_PRICE_BASE

                // Pescar Cartas (Draw) se o baralho ainda tiver cartas
                if (deck.value.length > 0) {
                    drawCards(winnerPlayer);
                } else {
                    // Se não há cartas no baralho e as mãos acabaram, o jogo acabou
                    if (player1Hand.value.length === 0) {
                        processGameEnd();

                        // Limpar Moves
                        moves.value = [];
                        return;
                    }
                }

                // Se for a vez do Bot jogar primeiro na nova ronda
                if (currentTurn.value === BOT_ID) {
                    playBotTurn();
                }
            };

            // --- Pescar Cartas do Baralho ---
            const drawCards = (winnerId) => {
                // Se não há deck nem trunfo na mesa, não há nada para pescar
                if ((deck.value.length === 0 && !trunfo.value) || trunfo.value.used) return;

                // Função auxiliar para tirar uma carta (do topo ou o trunfo final)
                const pullCard = () => {
                    if (deck.value.length > 0) {
                        return deck.value.shift(); // Tira do baralho
                    } else if (trunfo.value) {
                        // Se o baralho acabou, a carta a pescar é o Trunfo da mesa
                        const finalCard = trunfo.value;
                        trunfo.value.used = true; // Remove o trunfo visualmente da mesa
                        return finalCard;
                    }
                    return null;
                };

                // 1. O Vencedor da vaza pesca SEMPRE primeiro
                const cardForWinner = pullCard();

                // 2. O Perdedor pesca em segundo
                const cardForLoser = pullCard();

                // 3. Distribuir para as mãos corretas
                if (winnerId === currentUserId) {
                    if (cardForWinner) player1Hand.value.push(cardForWinner)
                    if (cardForLoser) player2Hand.value.push(cardForLoser)
                } else {
                    // Se o Bot ganhou
                    if (cardForWinner) player2Hand.value.push(cardForWinner);
                    if (cardForLoser) player1Hand.value.push(cardForLoser);
                }
            };

            const processGameEnd = () => {
                gameEnded.value = true;
                gameEndedAt = new Date();

                const p1Points = scores.value.player1;
                const p2Points = scores.value.player2;
                let victoryPoints = 0;
                let winnerId = null;
                // Adição do coinsWon para devolver as coins ganhas no game para o winner
                let coinsWonByPlayer = 0;

                if (p1Points === 60) {
                    toast.info("Empate no jogo! Ninguém pontua na match.");
                }

                if (p1Points > 60) {
                    winnerId = 1;
                    coinsWonByPlayer = 3;
                    if (p1Points >= 120) {
                        victoryPoints = 4;
                        coinsWonByPlayer += 3;
                    } else if (p1Points >= 91) {
                        victoryPoints = 2;
                        coinsWonByPlayer += 1;
                    } else victoryPoints = 1;
                } else if (p2Points > 60) {
                    winnerId = 2;
                    if (p2Points >= 120) {
                        victoryPoints = 4;
                    } else if (p2Points >= 91) {
                        victoryPoints = 2;
                    } else victoryPoints = 1;
                } else {
                    winnerId = null;
                    victoryPoints = 0;
                    coinsWonByPlayer = 0;
                }

                if (authStore.currentUser) {
                    matchStore.addScore(
                        winnerId,
                        victoryPoints,
                        scores.value,
                        moves.value,
                        gameBeganAt,
                        gameEndedAt,
                        trumpSuit.value,
                        coinsWonByPlayer
                    );
                }
            };

            // --- Atualização do playBotTurn para respeitar as regras ---
            const playBotTurn = async () => {
                if (player2Hand.value.length === 0) return;

                // --- ESTADO: THINKING ---
                botStatus.value = "Thinking...";
                await new Promise(resolve => setTimeout(resolve, SKIP_SLEEPS ? 0 : 1500));
                if (currentTurn.value !== BOT_ID) {
                    botStatus.value = "";
                    return
                }

                // --- ESTADO: CHECKING ---
                botStatus.value = "Checking if viable...";
                await new Promise(resolve => setTimeout(resolve, SKIP_SLEEPS ? 0 : 1500));
                if (currentTurn.value !== BOT_ID) {
                    botStatus.value = "";
                    return
                }


                let cardToPlay = null;
                const botHand = player2Hand.value;

                //Se joga em segundo
                if (tableCards.value.length === 1) {
                    const leadCard = tableCards.value[0];
                    const leadSuit = leadCard.suit;
                    
                    let validCards = [...botHand];
                    
                    if (deck.value.length === 0) {
                        const sameSuitCards = botHand.filter(c => c.suit === leadSuit);
                        if (sameSuitCards.length > 0) {
                            validCards = sameSuitCards;
                        }
                    }

                    const winningCards = validCards.filter(c => {
                        if (c.suit === leadSuit && getCardStrength(c.card) > getCardStrength(leadCard.card)) return true;
                        if (c.suit === trumpSuit.value && leadSuit !== trumpSuit.value) return true;
                        return false;
                    })

                    if (winningCards.length > 0) {
                        winningCards.sort((a, b) => getCardStrength(b.card) - getCardStrength(a.card));
                        cardToPlay = winningCards[0];
                    } else {
                        validCards.sort((a, b) => getCardStrength(a.card) - getCardStrength(b.card));
                        cardToPlay = validCards[0];
                    }

                } 
                else {
                    const sortedHand = [...botHand].sort((a, b) => getCardStrength(a.card) - getCardStrength(b.card));
                    cardToPlay = sortedHand[0];
                }

                if (!cardToPlay) cardToPlay = botHand[0];

                // --- ESTADO: PLAYING ---
                botStatus.value = "Playing...";
                await new Promise(resolve => setTimeout(resolve, SKIP_SLEEPS ? 0 : 500));
                if (currentTurn.value !== BOT_ID) {
                    botStatus.value = "";
                    return
                }

                playCardLocal(cardToPlay, BOT_ID);

                botStatus.value = "";
            };

            const undoAction = () => {
                if (tableCards.value[0]?.player !== currentUserId) return
                if ((authStore.currentUser?.coins_balance - undoPrice.value) <= 0) {
                    toast.info(`You don't have enough coins!`)
                    return
                }
                toast.info(`Action undone! ${matchStore.isRanked ? '-' + undoPrice.value + ' Coins' : ''} `)
                matchStore.isRanked ? (authStore.currentUser.coins_balance -= undoPrice.value) : ''


                if (moves.value.length === lastMove) {
                    increment++
                } else {
                    increment = 1
                    lastMove = moves.value.length
                }

                undoPrice.value = UNDO_ACTION_PRICE_BASE * (increment + 1)

                player1Hand.value.push(tableCards.value[0])
                tableCards.value = []
                currentTurn.value = currentUserId

            }


            const force_win_game = () => {
                scores.value.player1 = 70
                scores.value.player2 = 10
                processGameEnd()
            }
            const force_lose_game = () => {
                scores.value.player1 = 10
                scores.value.player2 = 70
                processGameEnd()
            }
            const force_tie_game = () => {
                scores.value.player1 = 50
                scores.value.player2 = 50
                processGameEnd()
            }
            const force_capote_game = () => {
                scores.value.player1 = 91
                scores.value.player2 = 10
                processGameEnd()
            }
            const force_bandeira_game = () => {
                scores.value.player1 = 120
                scores.value.player2 = 10
                processGameEnd()
            }

            // ------------------------------------------------------------------------
            // LÓGICA MULTIPLAYER (SOCKETS)
            // ------------------------------------------------------------------------

            // Criar Jogo (Lobby)
            const createMatch = (data = {}) => {
                if (!authStore.currentUser) {
                    toast.error('Tens de fazer login para criar um jogo')
                    return
                }
                if (!socket || !socket.connected) {
                    toast.error('Sem conexão ao servidor.')
                    return
                }
                // Emite para o servidor criar a sala
                socket.emit('create-match', data)
            }

            // Receber lista de jogos (Lobby)
            const setMatches = (newMatches) => {
                matches.value = newMatches
                console.log(`[Bisca] Matches list updated: ${matches.value.length} matches`)
            }

            const setMultiplayerGame = (gameState) => {
                console.log('[GameStore] Recebi update do servidor:', gameState);
                if (!gameState) return
                multiplayerGame.value = gameState;

                const amIPlayer1 = gameState.player1 === currentUserId;

                if (amIPlayer1) {
                    myHand.value = gameState.player1Hand || [];
                    opponentHand.value = gameState.player2Hand || [];
                    myScore.value = gameState.scores.player1;
                    opponentScore.value = gameState.scores.player2;
                } else {
                    myHand.value = gameState.player2Hand || [];
                    opponentHand.value = gameState.player1Hand || [];
                    myScore.value = gameState.scores.player2;
                    opponentScore.value = gameState.scores.player1;
                }

                deck.value = gameState.deck || [];
                trunfo.value = gameState.trunfo;
                trumpSuit.value = gameState.trumpSuit;
                tableCards.value = gameState.tableCards || [];
                lastRoundCards.value = gameState.lastRoundCards || [];
                currentTurn.value = gameState.currentTurn;
                
                gameEnded.value = gameState.gameEnded;
            }
            
            socket.on('game-created', (game) => {
                console.log('[Bisca] Game created:', game)

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

                opponent.value = game.player1Data.id === currentUserId ? game.player2Data : game.player1Data
                opponent_found.value = true
                searching_player.value = false
                console.log(opponent.value);
                setMultiplayerGame(game);
                setTimeout(() => {
                    game_began.value = true
                }, SKIP_SLEEPS ? 0 : 5000);
            });

            socket.on('game-change', (data) => {
                console.log('[Socket] Game Change recebido', data);
                setMultiplayerGame(data.game);
                lastRoundCards.value = data.roundResult?.cards ?? []
            })


            // ------------------------------------------------------------------------
            // COMPUTED PROPERTIES (GETTERS)
            // ------------------------------------------------------------------------

            const myGames = computed(() => {
                if (!authStore.currentUser) return []
                return matches.value.filter((g) => g.creator == currentUserId)
            })

            const availableGames = computed(() => {
                if (!authStore.currentUser) return []
                return matches.value.filter((g) => g.creator != currentUserId && g.status === 'pending')
            })

            // Exemplo: Saber se é a minha vez (assumindo que o servidor manda 'currentTurnPlayerId')
            const isMyTurn = computed(() => {
                if (!multiplayerGame.value || !authStore.currentUser) return false
                return multiplayerGame.value.currentTurnPlayerId === currentUserId
            })

            const sendEmote = (emote) => {
                if (!socket || !socket.connected) return
                socket.emit('send-emote', {gameId: multiplayerGame.value.id, emote: emote, userId: currentUserId})
            }

            const showEmote = ref(null);
            const playEmote = (emote) => {
                // if (showEmote.value) return; // Prevent overlapping emotes
                showEmote.value = {...emoteStore.getEmoteById(emote.id), user_id: emote.user_id};
                const emoteAudio = new Audio('/assets/emotes/' + showEmote.value.sound);
                emoteAudio.volume = 0.7;
                emoteAudio.play().catch((err) => console.warn('Emote audio play blocked:', err));
                setTimeout(() => {
                    showEmote.value = null
                }, 1500);
            }
            socket.on('receive-emote', (data) => {
                playEmote(data);
            });

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
                moves,
                undoPrice,
                botStatus,

                // Actions Local
                startNewGame,
                playCardLocal,
                playBotTurn,
                checkRoundWinner,
                undoAction,

                // dev tools
                force_win_game,
                force_lose_game,
                force_tie_game,
                force_capote_game,
                force_bandeira_game,

                // State Multiplayer
                matches,
                multiplayerGame,
                myHand,
                opponentHand,
                myScore,
                opponentScore,
                multiplayerGame,

                // Actions Multiplayer
                createMatch,
                setMatches,
                setMultiplayerGame,

                // Computeds
                myGames,
                availableGames,
                isMyTurn,
                searching_player,
                opponent,
                opponent_found,
                game_began,

                sendEmote,
                showEmote,
            };
        }
    )
;
