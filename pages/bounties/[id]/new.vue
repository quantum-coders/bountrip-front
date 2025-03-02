<template>
	<div class="new-plan-wrapper d-flex flex-grow-1 flex-column">

		<div class="bounty" v-if="bounty">
			<div class="container">
				<div class="d-flex align-items-end justify-content-between">

					<div class="bounty-info">

						<h3 class="mb-0">{{ bounty.title }}</h3>
						<p>{{ bounty.metas.description }}</p>

						<bounty-meta-info
							:metas="bounty.metas"
							:created="bounty.created"
							:participants="bounty.participants || []"
							class="mb-0"
						/>
					</div>

					<button
						class="btn btn-primary"
						@click="createPlan"
						:disabled="loading"
					>
						<span v-if="loading">Submitting..</span>
						<span v-else>Submit Plan</span>
					</button>
				</div>
			</div>
		</div>

		<div class="container d-flex flex-grow-1 flex-column">

			<div v-if="showTransaction"
				 class="alert alert-success mt-3 d-flex align-items-center justify-content-between">
				Plan submitted successfully!
				<a
					:href="'https://explorer.testnet.near.org/transactions/' + txHash"
					target="_blank"
					class="btn btn-sm btn-outline-dark"
				>View Transaction</a>
			</div>

			<!-- title for the plan -->
			<div class="form-group mb-3">
				<label class="form-label" for="title">Title for your plan</label>
				<input
					id="title"
					class="form-control form-control-lg"
					type="text"
					placeholder="Enter the title of your plan"
					v-model="planData.title"
				/>
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
						<icon name="material-symbols:search-rounded"/>
					</div>

					<template v-for="p in places">
						<article class="place">

							<img v-if="p.photos" class="place-thumb" :src="p.photos[0].url" alt=""
								 @click="focusPlace(p)">
							<div v-else class="place-thumb" @click="focusPlace(p)">
								<img src="/images/pattern-white.svg" alt="">
							</div>

							<div class="place-info">
								<div class="place-category">{{ changeCase.capitalCase(p.types[0]) }}</div>
								<h4 class="place-title mb-0">{{ p.name }}</h4>
								<p class="d-flex align-items-center gap-2 mb-0">
									<span v-if="p.rating">
										<plan-rating :rating="p.rating"/>
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
								<div class="form-group pb-3">
									<textarea
										class="form-control"
										rows="3"
										placeholder="Add a comment for this place"
										v-model="p.comment"
									/>
								</div>
								<div class="flex">
								<span
									class="align-content-end btn btn-sm btn-danger"
									@click="places.splice(places.indexOf(p), 1)"
								>
										<icon name="mdi:delete"/>
									</span>
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
							v-model="planData.description"
						></textarea>
					</div>

					<div class="map" id="map"/>

				</aside>
			</div>
		</div>
	</div>
</template>

<script setup>
	import * as changeCase from 'change-case';
	import {useNewPlanStore} from '~/stores/newPlan.store.js';

	definePageMeta({layout: 'bountrip'});

	const places = ref([]);
	const loading = ref(false);
	const showTransaction = ref(false);
	const txHash = ref('');
	const bounty = ref(null);
	const route = useRoute();
	const map = ref(null);
	const planData = ref({
		title: '',
		description: '',
		places: [],
	});
	const addPlace = (place) => {

		// remove value to #places
		setTimeout(() => {
			document.querySelector('.search input').value = '';
		}, 10);

		// add marker to the map
		place.marker = new google.maps.Marker({
			position: place.geometry.location,
			map: map.value,
			title: place.name,
		});

		// Add an info window to the marker
		place.infoWindow = new google.maps.InfoWindow({
			content: `
				<h4>${place.name}</h4>
				<p>${place.formatted_address}</p>
			`,
		});

		place.marker.addListener('click', () => {
			place.infoWindow.open(map.value, place.marker);

			// close all the other info windows
			places.value.forEach((p) => {
				if (p.infoWindow && p.infoWindow !== place.infoWindow) {
					p.infoWindow.close();
				}
			});
		});

		places.value.push(place);
		planData.value.places.push({
			placeId: place.place_id,
			placeName: place.name,
			placeAddress: place.formatted_address,
			placeCategory: place.types[0],
			placeRating: place.rating,
			placePhotos: place.photos,
			placePriceLevel: place.price_level,
			placeComment: place.comment,
		});

		boundMap();

	};

	/// watch places and update planData places
	watch(places, (newValue) => {
		console.info("Places changed........", newValue);
		planData.value.places = newValue.map((place) => ({
			placeId: place.place_id,
			placeName: place.name,
			placeAddress: place.formatted_address,
			placeCategory: place.types[0],
			placeRating: place.rating,
			placePhotos: place.photos,
			placePriceLevel: place.price_level,
			placeComment: place.comment,
		}));
	}, {deep: true});

	watch(planData, (newValue) => {
		useNewPlanStore().plan = {
			...useNewPlanStore().plan,
			title: newValue.title,
			description: newValue.description,
			places: newValue.places,
		};

	}, {deep: true});

	const focusPlace = (place) => {
		place.infoWindow.open(map.value, place.marker);

		//close all the other info windows
		places.value.forEach((p) => {
			if (p.infoWindow && p.infoWindow !== place.infoWindow) {
				p.infoWindow.close();
			}
		});

		boundMap();
	};

	// function to bound the map to the markers
	const boundMap = () => {
		const bounds = new google.maps.LatLngBounds();
		places.value.forEach((place) => {
			bounds.extend(place.marker.getPosition());
		});
		map.value.fitBounds(bounds);
	};

	onMounted(async () => {

		const bountyId = route.params.id;
		const bountyData = await $fetch(useRuntimeConfig().public.apiURL + '/bounties/' + bountyId);
		bounty.value = bountyData.data;

		// setup a google map
		map.value = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: bounty.value?.metas?.place?.geometry?.location?.lat,
				lng: bounty.value?.metas?.place?.geometry?.location?.lng,
			},
			zoom: 15,
		});

		useNewPlanStore().plan.idBounty = bountyId;

	});

	const createPlan = async () => {
		try {
			loading.value = true;
			console.log('Creating a new plan');
			const tx = await useNewPlanStore().createPlan();
			txHash.value = tx.transaction.hash;
			showTransaction.value = true;
		} catch (e) {
			console.error('Error creating a new plan:', e);
		} finally {
			loading.value = false;
		}
	};
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.bounty
		margin-bottom: 1rem
		padding: 1rem 0
		background: var(--brand2)
		color: white

	.new-plan-wrapper
		padding-top: calc(64px)

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
