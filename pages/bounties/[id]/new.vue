<template>
	<div class="new-plan-wrapper d-flex flex-grow-1">

		<div class="container d-flex flex-grow-1 flex-column">

			<!-- title for the plan -->
			<div class="form-group mb-3">
				<label class="form-label" for="title">Title for your plan</label>
				<input id="title" class="form-control" type="text" placeholder="Enter the title of your plan" />
			</div>

			<div class="plan-section d-flex flex-grow-1 gap-2">

				<div class="plan-content">
					<h4>Places and Recommendations</h4>
					<p>Search for places to recommend them for your plan</p>

					<project-places-search
						class="form-control"
						placeholder="Search for a place"
						@place-changed="addPlace"
					/>

					<template v-for="p in places">
						<article class="place">
							

							<img class="place-thumb" :src="p.photos[0].url" alt="">

							<div class="place-info">

								<h4 class="place-title mb-0">{{ p.name }}</h4>
								<p class="d-flex align-items-center gap-3 mb-0">
									<plan-rating :rating="p.rating" />
									<span class="price-level">
										<icon name="material-symbols:attach-money" v-for="i in p.price_level" />
									</span>
								</p>
								<p>{{ p.formatted_address }}</p>

								<p>
								</p>
							</div>
						</article>
					</template>
				</div>

				<aside class="plan-sidebar">

					<!-- textarea for the plan -->
					<div class="form-group">
						<label class="form-label" for="plan">Description</label>
						<textarea
							id="plan"
							class="form-control"
							rows="5"
							placeholder="Give a little description for your plan"
						></textarea>
					</div>

				</aside>
			</div>
		</div>
	</div>
</template>

<script setup>
	definePageMeta({ layout: 'bountrip' });

	const places = ref([]);

	const addPlace = (place) => {
		places.value.push(place);
	};
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.new-plan-wrapper
		padding-top: calc(64px + 1rem)

		.plan-content
			padding: 0 1rem
			flex-grow: 1

		.plan-sidebar
			width: 400px
			flex-shrink: 0
			border-left: 1px solid var(--bs-border-color)
			padding: 0 1rem

		.place
			display: flex
			align-items: flex-start
			gap: 1rem
			flex-shrink: 0
			margin-bottom: 1rem

			.place-thumb
				width: 100px
				aspect-ratio: 1
				border-radius: 0.5rem

			.place-info
				flex-grow: 1

				.place-title
					font-size: 1.2rem

</style>