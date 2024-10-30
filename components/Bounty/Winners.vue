<template>
	<div class="selected-prizes">
		<h4 v-if="selectedPrizes.length > 0" class="fw-bolder mb-3">
			Selected Prizes
		</h4>
		<span class="text-muted small">
      These are the prizes that have been selected for the winners of the bounty. Click finalize to save the winners and trigger the smart contract automatic distribution.
    </span>
		<ul v-if="selectedPrizes.length > 0" class="list-group">
			<li
				v-for="(winner, index) in selectedPrizes"
				:key="index"
				class="list-group-item d-flex justify-content-between align-items-center"
			>
				<span>{{ labels[winner.position] }}:</span>
				<span class="fw-bold">{{ winner.idNear }}</span>
			</li>
		</ul>
		<p v-else>No prizes have been selected yet.</p>
		<button
			v-if="canFinalize"
			class="btn btn-primary mt-3"
			@click="finalizeBounty"
		>
			Finalize Bounty
		</button>
	</div>
</template>

<script setup>

	const winnersStore = useWinnersStore();

	const labels = [
		'First Place',
		'Second Place',
		'Third Place',
		'Fourth Place',
		'Fifth Place',
	];

	const selectedPrizes = computed(() => winnersStore.winners);

	const canFinalize = computed(() => {
		return winnersStore.numberOfWinners === selectedPrizes.value.length;
	});

	const finalizeBounty = async () => {
		try {
			await winnersStore.finalizeBounty();
			// Puedes agregar aquí lógica adicional, como mostrar un mensaje de éxito o redirigir al usuario
		} catch (error) {
			console.error('Error finalizing bounty:', error);
			// Puedes agregar aquí lógica para manejar el error, como mostrar un mensaje de error al usuario
		}
	};
</script>
