<template>
	<div class="bounties-wrapper mb-3 flex-grow-1 flex-column d-flex">

		<div class="container d-flex gap-2 flex-grow-1">
			<div class="content">
				<div class="banner">
					<div class="banner-info">
						<h4>Earn money<br>sharing your trip tips</h4>
						<p class="mb-2">Design the ultimate travel plan for a fellow adventurer and earn NEAR rewards!</p>
						<p class="mb-0"><a href="#" class="btn btn-primary btn-sm px-4">Sign up</a></p>
					</div>
				</div>

				<div class="bounty-list">
					<bounty-card v-for="i in 10" />
				</div>
			</div>
			<aside class="sidebar">
			</aside>
		</div>
	</div>
</template>

<script setup>
	definePageMeta({ layout: 'bountrip' });
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

</style>
