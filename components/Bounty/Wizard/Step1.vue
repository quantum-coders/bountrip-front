<template>
	<div class="step step1" v-if="newBounty.step === 1">
		<h2>Where do you plan to go?</h2>

		<div class="search-wrapper">
			<div class="search mb-3">
				<project-places-search
					v-model="newBounty.bounty.placeName"
					@place-changed="newBounty.bounty.place = $event"
					@place-photos="newBounty.bounty.placePhotos = $event"
				/>
			</div>

			<!-- title for bounty -->
			<div class="title mb-3" v-if="newBounty.bounty.placeName">
				<label class="form-label" for="title">Title</label>
				<input
					class="form-control"
					v-model="newBounty.bounty.title"
					placeholder="Title for your bounty"
				/>
			</div>

			<div class="description" v-if="newBounty.bounty.title">
				<label class="form-label" for="description">Description</label>
				<textarea
					class="form-control"
					v-model="newBounty.bounty.description"
					placeholder="Description for your bounty"
				/>
			</div>

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

	.description
		textarea
			height: 200px
			resize: none
</style>