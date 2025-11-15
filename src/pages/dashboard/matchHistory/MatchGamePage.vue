<template>
	<section class="snap-start snap-always w-full shrink-0 px-4 mt-6 lg:mt-12">
		<div class="max-w-3xl mx-auto">
			<div class="flex flex-col items-center lg:items-start text-center lg:text-left w-full">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-widest text-rose-800 w-full align-center text-center">MATCH DETAILS</h2>
			</div>

			<div class="mt-6 bg-white/90 rounded-xl shadow p-6">
				<div class="flex items-start justify-between mb-4">
					<div>
						<div class="text-sm text-slate-500">Game ID</div>
						<div class="font-medium text-lg">#{{ game?.id ?? '—' }}</div>
					</div>
				</div>

				<div v-if="loading" class="text-center py-8">Loading...</div>
				<div v-else-if="error" class="text-center text-red-600 py-4">Error: {{ error }}</div>

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
							<div class="font-medium">{{ formatDuration(game?.total_time) }}</div>
						</div>
						<div>
							<div class="text-sm text-slate-500">Status</div>
							<div class="font-medium">{{ game?.status ?? '—' }}</div>
						</div>
					</div>

					<div class="mb-6">
						<h3 class="text-lg font-semibold mb-3">Result</h3>
						<div class="flex flex-col md:flex-row items-center justify-between bg-slate-50 p-4 rounded">
							<div class="text-center md:text-left w-full md:w-1/3">
								<div class="text-sm text-slate-500">Player 1</div>
								<div class="font-semibold">{{ playerName(game, 'player1') }} </div>
								<div class="text-3xl font-bold text-green-600">{{ game?.player1_points ?? '-' }}</div>
								<div class="text-sm text-green-600 font-medium mt-1" v-if="game && game.winner_user_id === game.player1_user_id">WINNER</div>
							</div>

							<div class="text-2xl font-bold text-gray-500 mx-4">VS</div>

							<div class="text-center md:text-right w-full md:w-1/3">
								<div class="text-sm text-slate-500">Player 2</div>
								<div class="font-semibold">{{ playerName(game, 'player2') }}</div>
								<div class="text-3xl font-bold text-red-600">{{ game?.player2_points ?? '-' }}</div>
								<div class="text-sm text-red-600 font-medium mt-1" v-if="game && game.winner_user_id === game.player2_user_id">WINNER</div>
							</div>
						</div>
					</div>

					<div class="mb-4">
						<h3 class="text-lg font-semibold mb-3">Additional Details</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded">
							<div>
								<p class="text-gray-600"><span class="font-semibold">Winner Name:</span> {{ playerName(game, game?.winner_user_id === game?.player1_user_id ? 'player1' : 'player2') ?? '—' }}</p>
								<p class="text-gray-600"><span class="font-semibold">Loser Name:</span> {{ playerName(game, game?.winner_user_id === game?.player1_user_id ? 'player2' : 'player1') ?? '—' }}</p>
							</div>
							<div>
								<p class="text-gray-600"><span class="font-semibold">Match ID:</span> {{ game?.match_id ?? 'N/A' }}</p>
							</div>
						</div>
					</div>

					<div class="flex justify-end">
						<button @click="$router.back()" class="px-4 py-2 bg-rose-700 text-white rounded hover:bg-rose-800">Voltar</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDashStore } from '@/stores/dash';

const route = useRoute();
const router = useRouter();
const dash = useDashStore();

const game = ref(null);
const loading = ref(false);
const error = ref(null);

const id = computed(() => route.params.id ? Number(route.params.id) : null);

function formatDate(value) {
	if (!value) return '—';
	try { return new Date(value).toLocaleString(); } catch (e) { return value; }
}

function formatDuration(seconds) {
	if (seconds == null) return '—';
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}m ${secs}s`;
}

function playerName(g, which) {
	if (!g) return '-';
	if (which === 'player1') return g.player1?.name ?? `#${g.player1_user_id}`;
	return g.player2?.name ?? `#${g.player2_user_id}`;
}

async function load() {
	if (!id.value) return;
	loading.value = true;
	error.value = null;
	try {
		const res = await dash.getGame(id.value);
		game.value = res.data || res;
	} catch (e) {
		error.value = e?.message || String(e);
	} finally {
		loading.value = false;
	}
}

onMounted(() => {
	if (!id.value) { router.replace({ name: 'history' }).catch(()=>{}); return; }
	load();
});
</script>

