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
			<template v-if="newBounty.step < 5">Next</template>
			<template v-else>Finish</template>
		</button>
	</div>
</template>

<script setup>
	const newBounty = useNewBountyStore();

	const prevStep = () => {
		newBounty.step--;
	};

	const canNextStep = () => {
		if(newBounty.step === 1 && !newBounty.bounty.place || !newBounty.bounty.title || !newBounty.bounty.description) {
			return false;
		}

		if(newBounty.step === 2 && !newBounty.bounty.selectedDate) {
			return false;
		}

		if(newBounty.step === 3 && !newBounty.bounty.tripType) {
			return false;
		}

		if(newBounty.step === 4 && !newBounty.bounty.selectedTags.length) {
			return false;
		}

		if(newBounty.step === 5) {

			// check that each prize is a valid number
			for(const prize of newBounty.bounty.prizes) {
				if(isNaN(prize) || !prize) return false;
			}

			return true;
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