<template>
	<div class="bounty-wrapper" v-if="bounty">
		<div class="bounty-banner">
			<div class="banner-info">
				<div class="container d-flex align-items-end justify-content-between">
					<div class="shadow"/>

					<div class="info-container">
						<h2>{{ bounty?.title }}</h2>
						<bounty-meta-info
							:metas="bounty.metas"
							:created="bounty.created"
							:participants="bounty.participants || []"
							class="mb-2"
						/>
						<!-- Added tags section -->
						<div class="tags-container mb-1">
							<span v-for="tag in bounty?.metas?.selectedTags" :key="tag" class="tag">
								{{ tag }}
							</span>
						</div>
					</div>

					<div class="actions d-flex align-items-center gap-2" v-if="canFinalize(bounty)">
						<div class="btn-group">
							<a href="#" @click.prevent="mode = 'bounty'" class="btn btn-primary">View my bounty</a>
							<a href="#" @click.prevent="mode = 'plans'" class="btn btn-secondary">View submissions</a>
						</div>
						<button
							href="#"
							class="btn btn-warning"
							@click.prevent="closeBounty(bounty)"
							:disabled="loading"
						>
							<span v-if="loading"
								class="disabled"
							>
								Closing...
							</span>
							<span v-else>Close Bounty</span>
						</button></div>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="bounty-content">
				<div class="shadow-left"></div>
				<div class="shadow-right"></div>

				<aside class="bounty-sidebar">
					<div class="sidebar-content">
						<!-- Added creator info -->
						<div class="creator-info mb-3">
							<div class="avatar">
								<icon name="simple-icons:near"/>
							</div>
							<div class="user">
								<small>Created by</small>
								<span class="fw-bolder text-brand2">{{ bounty?.creator }}</span>
							</div>
						</div>

						<p class="bounty-prize" v-for="(p, i) in bounty.prizes">
							<small>{{ labels[i] }}</small>
							<span>
								<span class="icon">
									<icon name="simple-icons:near"/>
								</span>
								{{ p }} NEAR
							</span>
						</p>

						<div class="data-chunk location-info mb-3">
							<small>Location</small>
							<span>{{ bounty?.metas?.placeName }}</span>
						</div>

						<div class="data-chunk trip-type mb-3">
							<small>Trip Type</small>
							<span>{{ bounty?.metas?.tripType }} trip</span>
						</div>

						<!-- Status indicator -->
						<div class="data-chunk status-badge mb-3" :class="bounty?.status.toLowerCase()">
							<small>Status</small>
							<span>{{ bounty?.status }}</span>
						</div>

						<button
							href="#" class="btn btn-primary w-100" :disabled="!bounty?.isActive"
							@click="goToBountySubmission(bounty)"
						>
							{{ bounty?.isActive ? 'Submit your plan' : 'Bounty Closed' }}
						</button>

						<!-- Added dates info -->
						<div class="dates-info mt-3">
							<div class="row">
								<div class="col-6">
									<div class="data-chunk">
										<small>Created:</small>
										<span>{{ new Date(bounty?.created).toLocaleDateString() }}</span>
									</div>
								</div>
								<div class="col-6">
									<div class="data-chunk">
										<small>Last Modified:</small>
										<span>{{ new Date(bounty?.modified).toLocaleDateString() }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</aside>

				<div class="bounty-description" v-if="mode === 'bounty'">

					<h4>Bounty Description</h4>
					<p>{{ bounty?.metas?.description }}</p>

					<!-- Added place details -->
					<div class="place-details">
						<h4>Location Details</h4>
						<div class="map" id="map"/>
						<p>{{ bounty?.metas?.place?.formatted_address }}</p>
					</div>

					<!-- Added place photos gallery -->
					<div class="place-photos mt-4">
						<h4>Location Photos</h4>
						<div class="photos-grid">
							<div
								v-for="(photo, index) in bounty?.metas?.placePhotos"
								:key="index"
								class="photo-item"
							>
								<img :src="photo.url" :alt="bounty?.metas?.placeName"/>
								<small class="photo-attribution" v-html="photo.attribution[0]"></small>
							</div>
						</div>
					</div>

					<!-- Participants and winners sections if needed -->
					<div v-if="bounty?.participants?.length > 0" class="participants mt-4">
						<h4>Participants</h4>
						<ul>
							<li v-for="participant in bounty?.participants" :key="participant">
								{{ participant }}
							</li>
						</ul>
					</div>

					<div v-if="bounty?.winners?.length > 0" class="winners mt-4">
						<h4>Winners</h4>
						<ul>
							<li v-for="winner in bounty?.winners" :key="winner">
								{{ winner }}
							</li>
						</ul>
					</div>
				</div>

				<div v-else-if="mode === 'plans'" class="bounty-submissions">
					<div class="mb-3">
						<bounty-winners v-if="bounty.winners"/>
						<bounty-transaction-hash
							:show-transaction="showTransaction"
							:tx-hash="txHash"
						/>
					</div>

					<h4 class="fw-bolder">Submissions</h4>
					<p>Here are all the submissions the users have tailored for your trip. Enjoy!</p>
					<article class="plan" v-for="p in bounty.plans">
						<h4 class="fw-bolder">{{ p.title }} <small>by {{ p.user.idNear }}</small></h4>
						<p class="mb-0">{{ p.content }}</p>

						<p class="text-end mb-0">
							<a @click.prevent="viewPlan(p.id)" href="#" class="btn btn-primary">View trip plan</a>
						</p>
					</article>
				</div>

				<div v-else class="single-plan">

					<div class="mb-4">
						<div class="prizes">
							<p class="mb-0">Select a price for this Trip Plan</p>
							<div class="ctas">
								<a
									class="select-prize-cta"
									v-for="(prize, i) in bounty.prizes"
									:key="i"
									@click="setWinner(i)"
									:class="{
										'is-selected': isWinnerSelected(i) && !isExactWinnerSelected(selectedPlan.user.idNear, i),
										'is-exact-winner': isExactWinnerSelected(selectedPlan.user.idNear, i)
									}"
								>
									<span class="position">{{ labels[i] }}</span>
									<small>{{ prize }} NEAR</small>
								</a>
							</div>
						</div>
						<p class="text-end">
							<a
								href="#"
								class="btn btn-sm btn-link"
								v-if="isWinner(selectedPlan.user.idNear)"
								@click.prevent="winnerStore.removeWinner(selectedPlan.user.idNear)"
							>Clear prize</a>
						</p>
					</div>
					<h4 class="fw-bolder">
						{{ selectedPlan.title }}
						<small>by {{ selectedPlan.user.idNear }}</small>
					</h4>
					<p class="mb-5" v-html="nltobr(selectedPlan.content)"/>

					<h4 class="fw-bolder mb-3">Recommended Places</h4>
					<div class="" v-for="p in selectedPlan.metas.places">
						<article class="place">
							<img
								v-if="p.placePhotos"
								class="place-thumb"
								:src="p.placePhotos[0].url"
								alt=""
							>
							<div v-else class="place-thumb">
								<img src="/images/pattern-white.svg" alt="">
							</div>

							<div class="place-info">
								<div
									v-if="p.placeCategory"
									class="place-category"
								>{{ changeCase.capitalCase(p.placeCategory) }}
								</div>

								<h4 class="place-title mb-0">{{ p.placeName }}</h4>
								<p class="d-flex align-items-center gap-2 mb-0">
									<span v-if="p.placeRating">
										<plan-rating :rating="p.placeRating"/>
									</span>
									<span class="reviews" v-if="p.placeReviews">
										{{ p.placeReviews.length }} review{{ p.placeReviews.length > 1 ? 's' : '' }}
									</span>
									<!--<span class="price-level">
										<icon name="material-symbols:attach-money" v-for="i in p.price_level" />
									</span>-->
								</p>
								<p>{{ p.placeAddress }}</p>

								<!-- textarea for comments -->
								<div class="form-group" v-if="p.placeComment">
									<div
										class="form-control"
										v-html="p.placeComment"
									/>
								</div>
							</div>
						</article>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import * as changeCase from 'change-case';

	definePageMeta({layout: 'bountrip'});

	const bounty = ref(null);
	const route = useRoute();
	const router = useRouter();
	const loading = ref(false);
	const selectedPlan = ref(null);
	const winnerStore = useWinnersStore();
	const showTransaction = ref(false);
	const txHash = ref(null);

	const labels = [
		'First Place',
		'Second Place',
		'Third Place',
		'Fourth Place',
		'Fifth Place',
	];

	const mode = ref('bounty');
	const isWinnerSelected = (position) => {
		return winnerStore.winners && winnerStore.winners.some(winner => winner.position === position);
	};

	const isExactWinnerSelected = (idNear, position) => {
		return winnerStore.winners && winnerStore.winners.some(winner => winner.position === position && winner.idNear === idNear);
	};

	const isWinner = (idNear) => {
		return winnerStore.winners && winnerStore.winners.some(winner => winner.idNear === idNear);
	};

	const canFinalize = (bounty) => {
		return (
			bounty.creator === useWalletStore().accountId &&
			bounty.isActive &&
			bounty.participants?.length > 0
		);
	};

	onMounted(async () => {
		const bountyId = route.params.id;
		const bountyData = await $fetch(useRuntimeConfig().public.apiURL + '/bounties/' + bountyId);
		bounty.value = bountyData.data;

		const plansData = await $fetch(useRuntimeConfig().public.apiURL + '/bounties/' + bountyId + '/plans');
		bounty.value.plans = plansData.data;

		// await 1 second for the bounty to be loaded
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// setup a google map
		const map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: bounty.value?.metas?.place?.geometry?.location?.lat,
				lng: bounty.value?.metas?.place?.geometry?.location?.lng,
			},
			zoom: 15,
		});

		// add a marker to the map
		new google.maps.Marker({
			position: {
				lat: bounty.value?.metas?.place?.geometry?.location?.lat,
				lng: bounty.value?.metas?.place?.geometry?.location?.lng,
			},
			map: map,
			title: bounty.value?.metas?.placeName,
		});

		useWinnersStore().numberOfWinners = bounty.value.prizes.length;
	});

	const setWinner = (index) => {
		useWinnersStore().setWinner({
			position: index,
			title: selectedPlan.value.title,
			idPlan: selectedPlan.value.id,
			idNear: selectedPlan.value.user.idNear,
			idBounty: selectedPlan.value.idBounty
		});
	};
	const goToBountySubmission = (bounty) => {
		console.info('bounty', bounty);
		if (bounty.isActive) {
			router.push(`/bounties/${bounty.id}/new`);
		}
	};

	const viewPlan = (idPlan) => {
		selectedPlan.value = bounty.value.plans.find((p) => p.id === idPlan);
		mode.value = 'plan';
	};

	const nltobr = (text) => text.replace(/\n/g, '<br />');

	const closeBounty = async (bounty) => {
		try {
			loading.value = true;
			showTransaction.value = false;
			txHash.value = null;
			const tx = await useWinnersStore().finalizeBounty();
			console.info("tx------------>", tx);
			txHash.value = tx.transaction.hash;
			showTransaction.value = true;

		} catch (e) {
			console.error('Error closing bounty:', e);
		} finally {
			loading.value = false;
		}
	};
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.bounty-wrapper
		margin-top: calc(64px + 0.5rem)
		flex-grow: 1

		.bounty-banner
			width: 100%
			background: var(--brand2) url('/images/pattern-white.svg') repeat fixed
			background-size: 100px
			height: 50dvh
			border-radius: 0 0 1rem 1rem
			overflow: clip

			&:before
				@extend .absolute-full
				content: ''
				background: rgba(black, 0.25)

			.banner-info
				height: 25dvh
				display: flex
				flex-direction: column
				justify-content: flex-end
				color: white
				padding-bottom: 0.5rem

				.shadow
					display: none
					width: 110%
					height: 200px
					border-radius: 100%
					background: black
					position: absolute
					opacity: 0.5
					left: -5%
					bottom: -10dvh
					filter: blur(50px)
					pointer-events: none

				h2
					font-weight: 800

				.tags-container
					display: flex

					.tag
						font-size: 0.75rem
						background: var(--brand2)
						color: white
						padding: 0.25rem 0.5rem
						border-radius: 10rem
						margin-right: 0.5rem

		.bounty-content
			margin-top: -25dvh
			background: white
			min-height: 25dvh
			border-radius: 1rem 1rem 0 0
			display: flex

			.bounty-sidebar
				width: 300px
				flex-shrink: 0
				border-right: 1px solid #DDD
				padding: 1rem

				.sidebar-content
					top: calc(64px + 1rem)
					position: sticky

				.data-chunk
					small
						color: #999
						display: block

				.creator-info
					display: flex
					align-items: center
					gap: 0.5rem

					.avatar
						width: 50px
						height: 50px
						background: #DDD
						border-radius: 50%
						display: flex
						align-items: center
						justify-content: center
						color: var(--brand2)

					.user
						small
							display: block

				.bounty-prize
					font-size: 1.5rem
					line-height: 1

					small
						font-size: 1rem
						display: block
						margin-bottom: 0.5rem

					span
						display: flex
						align-items: center
						gap: 0.5rem

						.icon
							background: var(--brand2)
							color: white
							width: 1.2em
							height: 1.2em
							border-radius: 50%
							display: flex
							align-items: center
							justify-content: center
							flex-shrink: 0

							.iconify
								font-size: 0.6em
								top: 0.015em

			.bounty-submissions
				padding: 2rem
				flex-grow: 1

			.bounty-description
				padding: 2rem
				flex-grow: 1

				.map
					background: #EEE
					height: 300px
					border-radius: 0.5rem
					margin-bottom: 1rem

				h4
					font-weight: 900

				img
					max-width: 100%

				.photos-grid
					display: flex
					flex-wrap: wrap
					gap: 0.5rem

					.photo-item
						flex-basis: calc((100% / 4) - (1.5rem / 4))
						flex-shrink: 0
						aspect-ratio: 1
						overflow: hidden
						border-radius: 0.5rem

						&:hover
							.photo-attribution
								bottom: 0

						.photo-attribution
							position: absolute
							bottom: -100px
							width: 100%
							z-index: 2
							left: 0
							background: rgba(black, 0.5)
							padding: 0.5rem
							transition: bottom 0.3s

							:deep(a)
								color: white
								text-decoration: none

						img
							aspect-ratio: 1
							object-fit: cover
							z-index: 1

	.plan
		border: 1px solid #DDD
		border-radius: 0.5rem
		padding: 1rem
		margin-bottom: 1rem

		h4
			font-size: 1.2rem

			small
				display: block
				font-size: 0.8rem
				color: var(--brand2)

		&:last-child
			margin-bottom: 0

		&:hover
			border-color: var(--brand2)

	.single-plan
		padding: 2rem
		flex-grow: 1

		.prizes
			display: flex
			border-radius: 100px
			border: 1px solid var(--brand2)
			overflow: hidden
			align-items: center

			p
				padding: 0 1rem

			.ctas
				flex-grow: 1
				display: flex
				align-items: center

				.select-prize-cta
					font-size: 1rem
					padding: 0.5rem 2rem
					text-decoration: none
					line-height: 1
					cursor: pointer
					border-right: 1px solid var(--brand2)
					flex-grow: 1

					&.is-selected
						background: #CCC

					&.is-exact-winner
						background: var(--brand1)
						color: white

					&:first-child
						border-left: 1px solid var(--brand2)

					&:last-child
						border-right: none

					&:hover
						background: var(--brand2)

					span
						margin-bottom: 0

					small
						font-size: 0.75rem
						display: block

		h4
			small
				display: block
				font-size: 0.8rem
				color: var(--brand2)

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
