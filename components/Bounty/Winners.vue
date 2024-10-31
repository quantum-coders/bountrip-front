<template>
	<div class="selected-prizes">
		<h4 v-if="selectedPrizes.length > 0" class="fw-bolder mb-0">Selected Prizes</h4>
		<p>
			These are the prizes that have been selected for the winners of the bounty. Click finalize to save the winners and trigger the smart contract automatic distribution.
		</p>

		<ul v-if="selectedPrizes.length > 0" class="list-group">
			<li
				v-for="(winner, index) in selectedPrizes"
				:key="index"
				class="list-group-item d-flex justify-content-between align-items-center"
			>
				<span>{{ labels[winner.position] }}:</span>
				<span class="fw-bold">{{ winner.idNear }} with {{ winner.title }}</span>
			</li>
		</ul>
		<p v-else>No prizes have been selected yet.</p>

		<p class="text-end">
			<button
				v-if="canFinalize"
				class="btn btn-primary mt-3"
				@click="finalizeBounty"
			>
				Finalize Bounty
			</button>
		</p>
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
		return selectedPrizes.value.length > 0;
	});

	const finalizeBounty = async () => {
		try {
			await winnersStore.finalizeBounty();
			// Puedes agregar aquí lógica adicional, como mostrar un mensaje de éxito o redirigir al usuario
		} catch(error) {
			console.error('Error finalizing bounty:', error);
			// Puedes agregar aquí lógica para manejar el error, como mostrar un mensaje de error al usuario
		}
	};
</script>
