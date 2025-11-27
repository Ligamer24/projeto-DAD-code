<template>
	<section class="snap-start snap-always w-full shrink-0 px-4 mt-6 lg:mt-12">
		<div class="max-w-3xl mx-auto">
			<div class="flex flex-col items-center lg:items-start text-center lg:text-left w-full">
				<h2
					class="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-widest text-rose-800 w-full align-center text-center">
					MATCH DETAILS
				</h2>
			</div>

			<div class="mt-6 bg-white/90 rounded-xl shadow p-6">
				<div class="flex items-start justify-between mb-4">
					<div>
						<div class="text-sm text-slate-500">Game ID</div>
						<div class="font-medium text-lg">#{{ game?.id ?? "—" }}</div>
					</div>
				</div>

				<div v-if="loading" class="text-center py-8">Loading...</div>
				<div v-else-if="error" class="text-center text-red-600 py-4">
					Error: {{ error }}
				</div>

				<div v-else>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
						<div>
							<div class="text-sm text-slate-500">Begin</div>
							<div class="font-medium">{{ formatDate(game?.began_at) }}</div>
						</div>
						<div>
							<div class="text-sm text-slate-500">End</div>
							<div class="font-medium">{{ formatDate(game?.ended_at) }}</div>
						</div>
						<div>
							<div class="text-sm text-slate-500">Duration</div>
							<div class="font-medium">
								{{ formatDuration(game?.total_time) }}
							</div>
						</div>
						<div>
							<div class="text-sm text-slate-500">Status</div>
							<div class="font-medium">{{ game?.status ?? "—" }}</div>
						</div>
					</div>

					<div class="mb-6">
						<h3 class="text-lg font-semibold mb-3">Result</h3>
						<div class="flex flex-col md:flex-row items-center justify-between bg-slate-50 p-4 rounded">
							<div class="text-center md:text-left w-full md:w-1/3">
								<div class="text-sm text-slate-500">Player 1</div>
								<div class="font-semibold">
									{{ playerName(game, "player1") }}
								</div>
								<div class="text-3xl font-bold text-green-600">
									{{ game?.player1_points ?? "-" }}
								</div>
								<div class="text-sm text-green-600 font-medium mt-1"
									v-if="game && game.winner_user_id === game.player1_user_id">
									WINNER
								</div>
							</div>

							<div class="text-2xl font-bold text-gray-500 mx-4">VS</div>

							<div class="text-center md:text-right w-full md:w-1/3">
								<div class="text-sm text-slate-500">Player 2</div>
								<div class="font-semibold">
									{{ playerName(game, "player2") }}
								</div>
								<div class="text-3xl font-bold text-red-600">
									{{ game?.player2_points ?? "-" }}
								</div>
								<div class="text-sm text-red-600 font-medium mt-1"
									v-if="game && game.winner_user_id === game.player2_user_id">
									WINNER
								</div>
							</div>
						</div>
					</div>

					<div class="mb-4">
						<h3 class="text-lg font-semibold mb-3">Additional Details</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<div>
								<div class="text-sm text-slate-500">Achievement:</div>
								<div class="font-medium">
									<!-- {{
										marksByPoints(
											game?.winner_user_id === game?.player1_user_id
												? game?.player1_points
												: game?.player2_points
										)
									}} -->
									{{ marksByPoints(game?.player1_points) }}
								</div>
							</div>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded">
							<div>
								<p class="text-gray-600">
									<span class="font-semibold">Winner Name:</span>
									{{
										playerName(
											game,
											game?.winner_user_id === game?.player1_user_id
												? "player1"
												: "player2"
										) ?? "—"
									}}
								</p>
								<p class="text-gray-600">
									<span class="font-semibold">Loser Name:</span>
									{{
										playerName(
											game,
											game?.winner_user_id === game?.player1_user_id
												? "player2"
												: "player1"
										) ?? "—"
									}}
								</p>
							</div>
							<div>
								<p class="text-gray-600">
									<span class="font-semibold">Match ID:</span>
									{{ game?.match_id ?? "N/A" }}
								</p>
							</div>
						</div>
						<div v-if="game && game.custom && game.custom[0].length >= 3" class="w-full mt-8">
							<div class="overflow-hidden bg-white rounded-xl shadow-lg border border-slate-200">
								<table class="w-full text-sm text-center text-slate-600">
									<thead
										class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
										<tr>
											<th colspan="4" class="px-6 py-4 font-bold tracking-wider">
												Trump Suit
											</th>
										</tr>
									</thead>
									<thead
										class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
										<tr>
											<th scope="col" class="px-6 py-4 font-bold tracking-wider">
												Ronda
											</th>
											<th scope="col" class="px-6 py-4 font-bold tracking-wider">
												{{ auth.currentUser.nickname ?? auth.currentUser.name }}
											</th>
											<th scope="col" class="px-6 py-4 font-bold tracking-wider">
												Bot
											</th>
											<th scope="col" class="px-6 py-4 font-bold tracking-wider">
												Total
											</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-slate-100">
										<!-- ITERA SOBRE A LISTA COMPUTADA (tricksWithScores) EM VEZ DE game.custom -->
										<tr v-for="(trick, i) in tricksWithScores" :key="i"
											class="hover:bg-slate-50 transition-colors duration-200">

											<!-- Ronda -->
											<td class="px-6 py-4 font-medium text-slate-900">
												#{{ i + 1 }}
											</td>

											<!-- Carta Player 1 (User) -->
											<td class="px-6 py-4"
												:class="{ 'bg-emerald-600/10': trick.isUserWinner, 'bg-red-500/10': !trick.isUserWinner }">
												<div class="flex flex-col justify-center">

													<span
														:class="trick[0].player === game.player1_user_id ? 'bg-blue-600 text-white shadow-sm border-blue-700' : 'invisible'"
														class="text-[10px] font-bold px-2 py-0.5 rounded-full border border-transparent leading-none uppercase tracking-wide">
														1º
													</span>
													<img :src="getImageByCardName(trick, game.player1_user_id)"
														class="h-16 object-contain drop-shadow-md transform hover:scale-110 transition-transform duration-200"
														alt="Carta Jogador 1" />
												</div>
											</td>

											<!-- Carta Player 2 (Bot) -->
											<td class="px-6 py-4"
												:class="{ 'bg-emerald-600/10': !trick.isUserWinner, 'bg-red-500/10': trick.isUserWinner }">
												<div class="flex flex-col justify-center">

													<span
														:class="trick[0].player === game.player2_user_id ? 'bg-blue-600 text-white shadow-sm border-blue-700' : 'invisible'"
														class="text-[10px] font-bold px-2 py-0.5 rounded-full border border-transparent leading-none uppercase tracking-wide">
														1º
													</span>

													<img :src="getImageByCardName(trick, game.player2_user_id)"
														class="h-16 object-contain drop-shadow-md transform hover:scale-110 transition-transform duration-200"
														alt="Carta Jogador 2" />
												</div>
											</td>

											<!-- Total Pontos -->
											<td class="px-6 py-4 font-mono text-base">
												<div
													class="flex items-center justify-center gap-2 bg-slate-100 py-1 px-3 rounded-full w-fit mx-auto">

													<!-- PONTOS USER -->
													<span
														class="font-bold transition-colors duration-300 flex items-center"
														:class="{ 'text-emerald-600 scale-110': trick.isUserWinner, 'text-slate-500': !trick.isUserWinner }">

														<!-- Mini Card +Pontos (Só aparece se ganhou) -->
														<span v-if="trick.isUserWinner"
															class="mr-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm leading-none">
															+{{ trick.pointsInTrick }}
														</span>

														<!-- Total Acumulado -->
														{{ trick.currentP1Total }}
													</span>

													<span class="text-slate-400 text-xs">vs</span>

													<!-- PONTOS BOT -->
													<span
														class="font-bold transition-colors duration-300 flex items-center"
														:class="{ 'text-emerald-600 scale-110': !trick.isUserWinner, 'text-slate-500': trick.isUserWinner }">

														<!-- Total Acumulado -->
														{{ trick.currentP2Total }}

														<!-- Mini Card +Pontos (Só aparece se ganhou) -->
														<span v-if="!trick.isUserWinner"
															class="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm leading-none">
															+{{ trick.pointsInTrick }}
														</span>
													</span>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div v-else
							class="text-center p-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300 mt-6">
							No trick by trick found
						</div>
					</div>

					<div class="flex justify-end">
						<button @click="$router.back()"
							class="px-4 py-2 bg-rose-700 text-white rounded hover:bg-rose-800">
							Voltar
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDashStore } from "@/stores/dash";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const dash = useDashStore();
const auth = useAuthStore();

const game = ref(null);
const loading = ref(false);
const error = ref(null);

let player1Points = 0;
let player2Points = 0;

const id = computed(() => (route.params.id ? Number(route.params.id) : null));

function formatDate(value) {
	if (!value) return "—";
	try {
		return new Date(value).toLocaleString();
	} catch (e) {
		return value;
	}
}

function formatDuration(seconds) {
	if (seconds == null) return "—";
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}m ${secs}s`;
}

function playerName(g, which) {
	if (!g) return "-";
	if (which === "player1")
		return g.player1?.nickname ?? `#${g.player1_user_id}`;
	return g.player2?.nickname ?? `#${g.player2_user_id}`;
}

async function load() {
	if (!id.value) return;
	loading.value = true;
	error.value = null;
	try {
		let res;
		res = await dash.getGame(id.value);
		game.value = res.data || res;
	} catch (e) {
		error.value = e?.message || String(e);
	} finally {
		loading.value = false;
	}
}

onMounted(() => {
	if (!id.value) {
		router.replace({ name: "history" }).catch(() => { });
		return;
	}
	load();
	player1Points = 0
	player2Points = 0
});

function marksByPoints(points) {
	if (points >= 60 && points <= 90) return "Risca/Mosca";
	if (points >= 91 && points <= 119) return "Capote";
	if (points >= 120) return "Bandeira";

	return "None";
}

function getImageByCardName(trick, playerId) {
	const cardName = trick[0].player === playerId ? trick[0].card : trick[1].card;
	return `/src/assets/cards/default/${cardName}.png`;
}

const tricksWithScores = computed(() => {
	if (!game.value?.custom || game.value?.custom[0].length < 3) return [];

	let p1Acc = 0; // Acumulador do User (Ana)
	let p2Acc = 0; // Acumulador do Bot

	return game.value.custom.map(trick => {
		const pointsInTrick = trick[0].value + trick[1].value;
		const isUserWinner = trick[2].trickWinner === auth.currentUser.id;

		// Soma ao acumulador correto
		if (isUserWinner) {
			p1Acc += pointsInTrick;
		} else {
			p2Acc += pointsInTrick;
		}

		// Retorna o objeto trick original + os totais naquele momento
		return {
			...trick, // mantém os dados originais (cartas, etc)
			pointsInTrick,
			currentP1Total: p1Acc,
			currentP2Total: p2Acc,
			isUserWinner // Ajuda no template para não repetir lógica
		};
	});
});
</script>
<style scoped>
.winner-text {
	color: #22c55e;
	/* Verde bonito (Tailwind green-500) */
	font-weight: bold;
}
</style>