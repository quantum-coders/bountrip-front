<template>
	<div class="step step2" v-if="newBounty.step === 2">
		<h2>When are you going?</h2>

		<div class="date-picker-wrapper">
			<project-date-picker v-model="newBounty.bounty.selectedDate" :disabledFromTo="disabledFromTo" btnCancelClass="d-none" />
		</div>
	</div>
</template>

<script setup>
	const newBounty = useNewBountyStore();

	const disabledFromTo = {
		// from oldest date to today
		from: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
		to: new Date()
	};
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.step
		display: flex
		flex-direction: column
		align-items: center
		gap: 1rem

	.date-picker-wrapper
		width: 800px
</style>
