<template>
	<article class="bounty">
		<nuxt-link class="bounty-link" to="/bounty" />

		<div class="bounty-image">
			<span class="bounty-prize">50 NEAR</span>
		</div>
		<div class="bounty-info">
			<h4>Looking for the best Tokyo adventure</h4>
			<p>Hello friends! I'm looking for the ultimate adventure in Japan.</p>
			<!--<bounty-meta-info class="mb-0" />-->
		</div>
	</article>
</template>

<script setup>
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

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