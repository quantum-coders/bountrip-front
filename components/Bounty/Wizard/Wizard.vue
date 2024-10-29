<template>
	<div class="wizard-wrapper">
		<div class="wizard-steps">
			<bounty-wizard-step1 />
			<bounty-wizard-step2 />
			<bounty-wizard-step3 />
			<bounty-wizard-step4 />
		</div>

		<div class="controls">
			<button
				class="btn btn-secondary px-4 rounded-pill"
				v-show="newBounty.step > 1"
				@click.prevent="prevStep"
			>
				Back
			</button>
			<button
				class="btn btn-secondary ms-auto px-4 rounded-pill"
				@click.prevent="nextStep"
			>
				Next
			</button>
		</div>
	</div>
</template>

<script setup>
	const newBounty = useNewBountyStore();

	const prevStep = () => {
		newBounty.step--;
	};

	const nextStep = () => {
		newBounty.step++;
	};
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.wizard-wrapper
		height: calc(100dvh - 64px)

	.controls
		display: flex
		justify-content: space-between
		width: 800px
		margin: 0 auto
		padding: 1rem
		background: white
		box-shadow: 0 0 1rem rgba(black, 0.1)
		border-radius: 100px
</style>