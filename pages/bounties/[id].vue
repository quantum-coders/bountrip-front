<template>
	<div class="bounty-wrapper">
		<div class="bounty-banner">
			<div class="banner-info">
				<div class="container d-flex flex-column">
					<div class="shadow" />
					<h2>{{ bounty?.title }}</h2>
					<bounty-meta-info class="mb-2" :bounty="bounty" />
					<!-- Added tags section -->
					<div class="tags-container mb-1">
						<span v-for="tag in bounty?.metas?.selectedTags" :key="tag" class="tag">
							{{ tag }}
						</span>
					</div>
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
							<div class="avatar"></div>
							<div class="user">
								<small>Created by</small>
								<span class="fw-bolder text-brand2">{{ bounty?.creator }}</span>
							</div>
						</div>

						<p class="bounty-prize">
							<small>Prize</small>
							<span>
								<span class="icon">
									<icon name="simple-icons:near" />
								</span>
								{{ bounty?.totalPrize }} NEAR
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

						<button href="#" class="btn btn-primary w-100" :disabled="!bounty?.isActive">
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

				<div class="bounty-description">
					<!-- Added place details -->
					<div class="place-details">
						<h4>Location Details</h4>
						<ul>
							<li>
								<strong>Address:</strong> {{ bounty?.metas?.place?.formatted_address }}
							</li>
							<li>
								<strong>Location:</strong> {{ bounty?.metas?.place?.geometry?.location?.lat }},
								{{ bounty?.metas?.place?.geometry?.location?.lng }}
							</li>
						</ul>
					</div>

					<h4>Bounty Description</h4>
					<p>{{ bounty?.metas?.description }}</p>

					<!-- Added place photos gallery -->
					<div class="place-photos mt-4">
						<h4>Location Photos</h4>
						<div class="photos-grid">
							<div
								v-for="(photo, index) in bounty?.metas?.placePhotos"
								:key="index"
								class="photo-item"
							>
								<img :src="photo.url" :alt="bounty?.metas?.placeName" />
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
			</div>
		</div>
	</div>
</template>
<script setup>
	definePageMeta({ layout: 'bountrip' });

	const bounty = ref(null);
	const route = useRoute();

	onMounted(async () => {
		const bountyId = route.params.id;
		const bountyData = await $fetch(useRuntimeConfig().public.apiURL + '/bounties/' + bountyId);
		bounty.value = bountyData.data;
	});
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.bounty-wrapper
		margin-top: calc(64px + 0.5rem)
		flex-grow: 1

		.bounty-banner
			width: 100%
			background: url('/images/splash/japan.jpg') no-repeat center center
			background-size: cover
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

					.user
						small
							display: block

				.bounty-prize
					font-size: 2rem
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

			.bounty-description
				padding: 3rem

				h4
					font-weight: 900

				img
					max-width: 100%

				.photos-grid
					display: flex
					flex-wrap: wrap
					gap: 0.5rem

					.photo-item
						flex-basis: calc((100% / 3) - (1.5rem / 3))
						flex-shrink: 0

						img
							aspect-ratio: 1.5
							object-fit: cover

</style>
