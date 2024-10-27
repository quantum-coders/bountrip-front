<template>
	<div class="container">
		<div class="numbers-wrapper">
			<div class="row gx-2">
				<div class="col-3">
					<article class="number">
						<div class="number-info">
							<h3 class="number-title">1,000+</h3>
							<p class="number-description">Bounties</p>
						</div>
					</article>
				</div>
				<div class="col-3">
					<article class="number">
						<div class="number-info">
							<h3 class="number-title">$58,000</h3>
							<p class="number-description">Near coins bid</p>
						</div>
					</article>
				</div>
				<div class="col-3">
					<article class="number">
						<div class="number-info">
							<h3 class="number-title">2960</h3>
							<p class="number-description">Plans created</p>
						</div>
					</article>
				</div>
				<div class="col-3">
					<article class="number">
						<div class="number-info">
							<h3 class="number-title">2,500+</h3>
							<p class="number-description">Users</p>
						</div>
					</article>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.numbers-wrapper
		border-radius: 1rem
		background: white
		padding: 1rem 0
		box-shadow: 0 0 1rem rgba(black, 0.1), 0 0.5rem 1rem rgba(black, 0.025)

	.row > div:not(:last-child) .number
		border-right: 1px solid rgba(black, 0.1)

	.number
		aspect-ratio: 4
		display: flex
		flex-direction: column
		justify-content: center
		align-items: center

		h3
			margin-bottom: 0
			font-size: 2.5rem

		p
			color: var(--brand2)
			font-size: 0.75rem
			font-weight: bold
			margin: 0

</style>