<template>
	<footer class="layout-footer">
		<div class="container">
			<nuxt-link to="/">
				<svgo-logo class="logo mb-3" />
			</nuxt-link>

			<p>Let the crowd find the best plan for your next trip</p>
		</div>

		<div class="legal-bar">
			<div class="container">
				<p class="mb-0">Bountrip &copy; {{ currentYear }} Bountrip. All rights reserved.</p>
			</div>
		</div>
	</footer>
</template>

<script setup>

	const currentYear = new Date().getFullYear();

</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.layout-footer
		border-top: 1px solid var(--bs-border-color)
		padding-top: 1rem

		:deep(.logo)
			width: 150px
			height: auto

			[class$=cls-1]
				fill: #333 !important

		.legal-bar
			background: #CCC
			padding: 1rem 0 1.5rem
</style>