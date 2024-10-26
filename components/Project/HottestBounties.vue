<template>
	<div class="block block-bounties mb-5">
		<div class="container">
			<h2 class="title text-center mb-4">Hottest Bounties</h2>

			<div class="bounties">
				<div class="row gx-3">
					<div class="col-3" v-for="i in 4">
						<article class="bounty-card">
							<span class="bounty-price">50 NEAR</span>

							<div class="bounty-info">
								<h3 class="bounty-title">Looking for the best Tokyo adventure</h3>
								<p class="bounty-days mb-0">5 days, 4 nights</p>
							</div>
						</article>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.title
		font-weight: 900

		&:after
			content: ''
			display: block
			width: 5rem
			height: 0.125rem
			background: var(--brand2)
			margin: 0.5rem auto
			border-left: 1rem solid var(--brand1)
			border-right: 1rem solid var(--brand1)

	.bounty-card
		aspect-ratio: 0.75
		background: var(--brand1) url('/images/splash/japan.jpg') no-repeat center center
		background-size: auto 100%
		border-radius: 0.5rem
		color: white
		padding: 1rem
		display: flex
		flex-direction: column
		justify-content: flex-end
		transition: background-size 0.3s

		&:hover
			// scale background image
			background-size: auto 110%

		&:before
			content: ''
			display: block
			position: absolute
			top: 0
			left: 0
			width: 100%
			height: 100%
			background: rgba(black, 0.5)
			border-radius: 0.5rem
			z-index: 0

		.bounty-price
			font-weight: bold
			margin-bottom: 0.5rem
			z-index: 1
			position: absolute
			top: 1rem
			right: 1rem
			font-size: 0.75rem
			background: var(--brand2)
			padding: 0.5rem
			border-radius: 0.25rem

		.bounty-info
			z-index: 1

			.bounty-title
				font-size: 1.2rem
				font-weight: bold
				margin-bottom: 0.5rem
				text-wrap: balance

</style>