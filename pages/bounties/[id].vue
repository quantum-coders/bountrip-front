<template>
    <div class="bounty-wrapper">
       <div class="bounty-banner">
          <div class="banner-info">
             <div class="container d-flex flex-column">
                <div class="shadow"/>
                <h2>{{ bounty?.title }}</h2>
                <bounty-meta-info class="mb-0"/>
                <!-- Added tags section -->
                <div class="tags-container mt-3">
                   <span v-for="tag in bounty?.metas?.selectedTags" :key="tag" class="tag">
                      {{ tag }}
                   </span>
                </div>
                <!-- Added date range -->
                <div class="date-range mt-2">
                   <icon name="calendar" />
                   <span>{{ new Date(bounty?.metas?.selectedDate[0]).toLocaleDateString() }} -
                         {{ new Date(bounty?.metas?.selectedDate[1]).toLocaleDateString() }}</span>
                </div>
             </div>
          </div>
       </div>

       <div class="container">
          <div class="bounty-content">
             <div class="shadow-left"></div>
             <div class="shadow-right"></div>

             <aside class="bounty-sidebar">
                <p class="bounty-prize">
                   <small>Prize</small>
                   <span>
                      <span class="icon">
                         <icon name="simple-icons:near"/>
                      </span>
                      {{ Number(bounty?.totalPrize) / 1e24 }} NEAR
                   </span>
                </p>

                <div class="location-info mb-3">
                   <icon name="map-pin" />
                   <span>{{ bounty?.metas?.placeName }}</span>
                </div>

                <div class="trip-type mb-3">
                   <icon name="user" />
                   <span>{{ bounty?.metas?.tripType }} trip</span>
                </div>

                <!-- Status indicator -->
                <div class="status-badge mb-3" :class="bounty?.status.toLowerCase()">
                   <icon name="circle" />
                   <span>{{ bounty?.status }}</span>
                </div>

                <a href="#" class="btn btn-primary w-100" :disabled="!bounty?.isActive">
                   {{ bounty?.isActive ? 'Submit your plan' : 'Bounty Closed' }}
                </a>

                <!-- Added creator info -->
                <div class="creator-info mt-3">
                   <small>Created by</small>
                   <span>{{ bounty?.creator }}</span>
                </div>

                <!-- Added dates info -->
                <div class="dates-info mt-3">
                   <div>
                      <small>Created:</small>
                      <span>{{ new Date(bounty?.created).toLocaleDateString() }}</span>
                   </div>
                   <div>
                      <small>Last Modified:</small>
                      <span>{{ new Date(bounty?.modified).toLocaleDateString() }}</span>
                   </div>
                </div>
             </aside>

             <div class="bounty-description">
                <p>{{ bounty?.metas?.description }}</p>

                <!-- Added place photos gallery -->
                <div class="place-photos mt-4">
                   <h4>Location Photos</h4>
                   <div class="photos-grid">
                      <div v-for="(photo, index) in bounty?.metas?.placePhotos"
                           :key="index"
                           class="photo-item">
                         <img :src="photo.url" :alt="bounty?.metas?.placeName" />
                         <small class="photo-attribution" v-html="photo.attribution[0]"></small>
                      </div>
                   </div>
                </div>

                <!-- Added place details -->
                <div class="place-details mt-4">
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
	definePageMeta({layout: 'bountrip'});
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

							.iconify
								font-size: 0.6em
								top: 0.015em

			.bounty-description
				padding: 3rem

			.shadow-left
				width: 50px
				position: absolute
				margin-top: 25dvh
				left: -50px
				height: 100px
				overflow: clip

				&:before
					filter: blur(10px)
					opacity: 0.5
					content: ''
					position: absolute
					width: 0
					height: 0
					right: 0
					top: -10px
					border-style: solid
					border-width: 0 18px 58px 0
					border-color: transparent #000000 transparent transparent
					transform: rotate(0deg)

			.shadow-right
				width: 50px
				position: absolute
				margin-top: 25dvh
				right: -50px
				height: 100px
				overflow: clip

				&:before
					filter: blur(10px)
					opacity: 0.5
					content: ''
					position: absolute
					width: 0
					height: 0
					left: 0
					top: -10px
					border-style: solid
					border-width: 0 0 58px 18px
					border-color: transparent transparent transparent #000000
					transform: rotate(0deg)
</style>
