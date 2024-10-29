<template>
	<div class="wizard-wrapper">

		<div class="trip-info">
			<p class="mb-0">
				<template v-if="newBounty.bounty.placeName">Trip to {{ newBounty.bounty.placeName }}</template>
				<template v-else>Plan your next trip</template>
			</p>
			<p class="text-muted">{{ newBounty.step }} of 4</p>
		</div>

		<div class="wizard-steps mb-5">
			<bounty-wizard-step1 />
			<bounty-wizard-step2 />
			<bounty-wizard-step3 />
			<bounty-wizard-step4 />
		</div>

		<bounty-wizard-controls />
	</div>
</template>

<script setup>
	const newBounty = useNewBountyStore();
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.wizard-wrapper
		height: calc(100dvh - 64px)
		display: flex
		flex-direction: column

		.trip-info
			text-align: center
			padding: 1rem
			margin-bottom: 2rem

		.wizard-steps
			flex-grow: 1

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