<template>
	<div class="step step1" v-if="newBounty.step === 1">
		<h2>Where do you plan to go?</h2>

		<div class="search mb-5">
			<project-places-search
				v-model="newBounty.bounty.placeName"
				@place-changed="newBounty.bounty.place = $event"
				@place-photos="newBounty.bounty.placePhotos = $event"
			/>
		</div>
	</div>
</template>

<script setup>
	const newBounty = useNewBountyStore();
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.step
		display: flex
		flex-direction: column
		align-items: center
		gap: 1rem

	.search
		display: flex
		align-items: center
		background: white
		gap: 1rem
		padding: 1rem
		border-radius: 1rem
		width: 800px
		box-shadow: 0 0 1rem rgba(black, 0.1)

		input
			flex-grow: 1
			border: 0

			&:focus
				outline: none
</style>