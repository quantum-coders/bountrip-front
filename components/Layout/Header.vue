<template>
	<header class="layout-header" :class="{ home: props.home }">
		<div class="container d-flex align-items-center">
			<nuxt-link to="/">
				<svgo-logo class="logo" />
			</nuxt-link>

			<nav class="header-navigation">
				<ul>
					<li>
						<nuxt-link to="/">Home</nuxt-link>
					</li>
					<li>
						<nuxt-link to="/bounties">Bounties</nuxt-link>
					</li>
					<li>
						<nuxt-link to="/about">About</nuxt-link>
					</li>
					<li class="login">
						<wallet />
					</li>
				</ul>
			</nav>
		</div>
	</header>
</template>

<script setup>

	const props = defineProps({
		home: {
			type: Boolean,
			default: false,
		},
	});

</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.layout-header
		position: fixed
		padding: 1rem
		width: calc(100% - 1rem)
		z-index: 100
		display: flex
		align-items: center
		background: var(--brand1)
		height: 64px
		top: 0.5rem
		border-bottom: 0.25rem solid white

		&.home
			background: transparent

		&:not(.home)
			:deep(.logo)
				[id$=bup]
					fill: white !important

		.logo
			width: 150px
			height: auto

		.header-navigation
			flex-grow: 1
			display: flex
			justify-content: flex-end

			ul
				display: flex
				gap: 2rem
				list-style: none
				padding: 0
				margin: 0
				align-items: center

				li
					color: white

					&.login
						a
							background: var(--brand2)
							padding: 0.25rem 2.5rem
							border-radius: 0.5rem

					a
						display: block
						color: white
						text-decoration: none
						transition: color 0.3s
						font-weight: 600
						font-size: 1rem

						&:hover
							color: #f0f0f0

</style>
