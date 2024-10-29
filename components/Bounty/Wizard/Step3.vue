<template>
	<div class="step step3" v-if="newBounty.step === 3">
		<h2>What kind of trip are you planning?</h2>
		<div class="trip-types">
			<div class="row">
				<div class="col-3" v-for="t in types">
					<article
						class="type"
						@click="newBounty.bounty.tripType = t.name"
						:class="{ 'is-active': newBounty.bounty.tripType === t.name }"
					>
						<div class="type-info">
							<icon :name="t.icon" />
							<span>{{ t.label }}</span>
						</div>
					</article>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const newBounty = useNewBountyStore();

	const types = [
		{ name: 'solo', icon: 'material-symbols:person-outline', label: 'Solo trip' },
		{ name: 'partner', icon: 'material-symbols:favorite-outline', label: 'Partner trip' },
		{ name: 'friends', icon: 'material-symbols:groups-outline-sharp', label: 'Friends trip' },
		{ name: 'family', icon: 'material-symbols:family-home-outline-rounded', label: 'Family trip' },
	];
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.step
		display: flex
		flex-direction: column
		align-items: center
		gap: 1rem

	.trip-types
		width: 800px

		.type
			display: flex
			padding: 2rem
			align-items: center
			height: 100px
			background: white
			box-shadow: 0 0 1rem rgba(black, 0.1)
			border-radius: 0.5rem
			cursor: pointer

			&.is-active
				background: var(--brand2)
				color: white

			.iconify
				font-size: 2rem

			.type-info
				display: flex
				flex-direction: column
</style>