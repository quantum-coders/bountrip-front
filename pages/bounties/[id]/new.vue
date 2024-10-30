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

					<div class="search">
						<project-places-search
							placeholder="Search for a place"
							@place-changed="addPlace"
						/>
						<icon name="material-symbols:search-rounded" />
					</div>

					<template v-for="p in places">
						<article class="place">

							<img v-if="p.photos" class="place-thumb" :src="p.photos[0].url" alt="">
							<div v-else class="place-thumb" />

							<div class="place-info">
								<div class="place-category">{{ changeCase.capitalCase(p.types[0]) }}</div>

								<h4 class="place-title mb-0">{{ p.name }}</h4>
								<p class="d-flex align-items-center gap-2 mb-0">
									<span v-if="p.rating">
										<plan-rating :rating="p.rating" />
									</span>
									<span class="reviews" v-if="p.reviews">
										{{ p.reviews.length }} review{{ p.reviews.length > 1 ? 's' : '' }}
									</span>
									<!--<span class="price-level">
										<icon name="material-symbols:attach-money" v-for="i in p.price_level" />
									</span>-->
								</p>
								<p>{{ p.formatted_address }}</p>

								<!-- textarea for comments -->
								<div class="form-group">
									<textarea
										class="form-control"
										rows="3"
										placeholder="Add a comment for this place"
									/>
								</div>
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

					<div class="map" id="map" />

				</aside>
			</div>
		</div>
	</div>
</template>

<script setup>
	import * as changeCase from 'change-case';

	definePageMeta({ layout: 'bountrip' });

	const places = ref([]);

	const addPlace = (place) => {
		places.value.push(place);

		// remove value to #places
		setTimeout(() => {
			document.querySelector('.search input').value = '';
		}, 10);
	};

	onMounted(() => {

		// setup a google map
		const map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 19.487037542176687,
				lng: -99.26139595311078
			},
			zoom: 15,
		});
	});
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.new-plan-wrapper
		padding-top: calc(64px + 1rem)

		.plan-content
			padding: 0 1rem
			flex-grow: 1

			.search
				display: flex
				align-items: center
				gap: 1rem
				margin-bottom: 3rem
				box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1)
				border-radius: 0.5rem
				padding: 1rem

				input
					flex-grow: 1
					border: 0

					&:focus
						outline: none

		.plan-sidebar
			width: 400px
			flex-shrink: 0
			border-left: 1px solid var(--bs-border-color)
			padding: 0 1rem 1rem

			.map
				width: 100%
				height: 600px
				border-radius: 0.5rem
				margin-top: 1rem

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
				background: #EEE

			.place-info
				flex-grow: 1

				.place-category
					font-size: 0.75rem
					position: absolute
					right: 0
					top: 0
					background: var(--brand2)
					color: white
					padding: 0.25rem 0.5rem
					border-radius: 10rem

				.place-title
					font-size: 1.2rem

				textarea
					resize: none

</style>