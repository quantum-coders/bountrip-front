<template>
	<div class="bounty-wrapper">
		<div class="bounty-banner">
			<div class="banner-info">

				<div class="container d-flex flex-column">
					<div class="shadow"/>
					<h2>Looking for the best Tokyo adventure</h2>
					<bounty-meta-info class="mb-0"/>
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
							50 NEAR
						</span>
					</p>

					<a href="#" class="btn btn-primary w-100">Submit your plan</a>
				</aside>

				<div class="bounty-description">
					<p>Hey there, planning wizards! I'm looking for an awesome travel itinerary for a solo trip to
						Tokyo, and I’m calling all otaku and gaming experts for help. I’m in my 30s, so I’m looking for
						a plan that balances classic otaku experiences with some cool, more mature, under-the-radar
						spots. I’d love recommendations for must-visit anime and gaming hubs, lesser-known retro game
						stores, iconic arcades, anime museums, and even themed cafes that cater to serious fans.</p>

					<h4>Details to Keep in Mind:</h4>
					<ul>
						<li>
							<strong>Length of trip:</strong> 7 days, but I’m open to any amazing weekend spots nearby if
							they’re worth the trek.
						</li>
						<li>
							<strong>Budget:</strong> Mid-range. I’m up for a splurge or two on unforgettable experiences
							(think: private tours, exclusive merch, rare collector spots, etc.)
						</li>
						<li>
							<strong>Interests:</strong> Big into retro and new-gen gaming, anime collectibles, manga
							cafes, and Tokyo’s pop culture scene.
						</li>
						<li>
							<strong>Extras:</strong> A few chill, scenic spots for unwinding between the action would be
							awesome, maybe some photogenic places that blend Tokyo’s traditional charm with otaku
							culture.
						</li>
					</ul>

					<p>Excited to see your ideas!</p>
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
