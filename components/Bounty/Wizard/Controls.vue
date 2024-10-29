<template>

	<div class="controls">
		<button
			class="btn btn-link px-4 rounded-pill"
			v-show="newBounty.step > 1"
			@click.prevent="prevStep"
		>
			Back
		</button>
		<button
			class="btn btn-secondary ms-auto px-4 rounded-pill"
			@click.prevent="nextStep"
			:disabled="!canNextStep()"
		>
			Next
		</button>
	</div>
</template>

<script setup>
	const newBounty = useNewBountyStore();

	const prevStep = () => {
		newBounty.step--;
	};

	const canNextStep = () => {
		if(newBounty.step === 1 && !newBounty.bounty.place) {
			return false;
		}

		if(newBounty.step === 2 && !newBounty.bounty.selectedDate) {
			return false;
		}

		if(newBounty.step === 3 && !newBounty.bounty.tripType) {
			return false;
		}

		return true;
	};

	const nextStep = () => {

		if(!canNextStep()) return;
		newBounty.step++;
	};
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.controls
		display: flex
		justify-content: space-between
		width: 800px
		margin: 1rem auto
		padding: 1rem
		background: white
		box-shadow: 0 0 1rem rgba(black, 0.1)
		border-radius: 100px
</style>