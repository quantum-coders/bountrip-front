<template>
	<div class="bounties-wrapper flex-grow-1 flex-column d-flex">

		<div class="container d-flex gap-2 flex-grow-1">
			<div class="content">
				<div class="banner">
					<div class="banner-info">
						<h4>Earn money<br>sharing your trip tips</h4>
						<p class="mb-2">Design the ultimate travel plan for a fellow adventurer and earn NEAR
							rewards!</p>
						<p class="mb-0"><a href="#" class="btn btn-primary btn-sm px-4">Sign up</a></p>
					</div>
				</div>

				<div class="bounty-list">
					<article class="bounty" v-for="i in 10">
						<nuxt-link class="bounty-link" to="/bounty"/>

						<div class="bounty-image">
							<span class="bounty-prize">50 NEAR</span>
						</div>
						<div class="bounty-info">
							<h4>Looking for the best Tokyo adventure</h4>
							<p>Hello friends! I'm looking for the ultimate adventure in Japan.</p>
							<bounty-meta-info class="mb-0"/>
						</div>
					</article>
				</div>

			</div>
			<aside class="sidebar">
			</aside>
		</div>
	</div>
</template>

<script setup>
	definePageMeta({layout: 'bountrip'});
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.bounties-wrapper
		margin-top: calc(64px + 0.5rem)

	.content
		flex-grow: 1

	.sidebar
		width: 450px
		flex-shrink: 1
		border-left: 1px solid #DDD

	.banner
		aspect-ratio: 4
		border-radius: 0.5rem
		background: var(--brand2) url('/images/banner.jpg') no-repeat right bottom
		background-size: auto 100%
		padding: 0 3rem
		display: flex
		align-items: center
		color: white
		margin-bottom: 0.5rem

		.banner-info
			max-width: 60%
			padding: 1rem 0

			h4
				font-weight: 900

			p
				text-wrap: balance

	.bounty-list
		display: flex
		flex-direction: column
		gap: 0.5rem

		.bounty
			display: flex
			border-radius: 0.5rem
			overflow: clip
			border: 1px solid var(--bs-border-color)
			cursor: pointer

			&:hover
				border-color: var(--brand2)

			.bounty-link
				@extend .absolute-full
				z-index: 2

			.bounty-image
				width: 150px
				flex-shrink: 0
				background: url('/images/thumb.jpg') no-repeat center center
				background-size: cover

				.bounty-prize
					font-weight: bold
					margin-bottom: 0.5rem
					z-index: 1
					position: absolute
					top: 0.5rem
					left: 0.5rem
					font-size: 0.75rem
					background: var(--brand2)
					padding: 0.25rem 0.5rem
					border-radius: 0.25rem
					color: white

			.bounty-info
				padding: 1rem
				flex-grow: 1

				h4
					font-size: 1.2rem
					margin-bottom: 0.25rem
					font-weight: 900

				p
					text-wrap: balance
					margin-bottom: 0.5rem

					&.meta
						font-size: 0.75rem

</style>
