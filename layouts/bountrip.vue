<template>
	<div class="frame-overlay">
		<img class="lt" src="/images/frame/lt.svg" alt="">
		<img class="rt" src="/images/frame/rt.svg" alt="">
		<img class="lb" src="/images/frame/lb.svg" alt="">
		<img class="rb" src="/images/frame/rb.svg" alt="">
	</div>

	<div class="layout-wrapper">
		<layout-header />
		<main class="layout-main">
			<nuxt-page />
		</main>
		<footer></footer>
	</div>
</template>

<script setup>
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.frame-overlay
		background-clip: padding-box
		position: fixed
		top: 0
		left: 0
		width: 100%
		height: 100%
		z-index: 1000
		pointer-events: none
		border: 0.5rem solid white
		border-radius: 1.5rem

		img
			position: absolute
			width: 2rem
			height: 2rem

			&.lt
				left: -0.5rem
				top: -0.5rem

			&.rt
				right: -0.5rem
				top: -0.5rem

			&.lb
				left: -0.5rem
				bottom: -0.5rem

			&.rb
				right: -0.5rem
				bottom: -0.5rem


	.layout-wrapper
		display: flex
		width: 100%
		flex-direction: column

		.layout-main
			flex-grow: 1
			display: flex
			flex-direction: column
</style>