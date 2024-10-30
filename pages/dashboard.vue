<template>
	<div class="dashboard-wrapper flex-grow-1 flex-column d-flex">

		<div class="splash">

		</div>

		<div class="container d-flex gap-2 flex-grow-1">
			<div class="dashboard-section d-flex flex-grow-1">
				<div class="shadow-left"></div>
				<div class="shadow-right"></div>

				<aside class="sidebar">
					<div class="user-information pt-4">
						<div class="avatar">
							<icon name="simple-icons:near" />
						</div>
						<h2>Rodrigo Tejero</h2>
						<p class="account-id">
							<span class="icon">
								<icon name="simple-icons:near" />
							</span>
							{{ accountId }}
						</p>
					</div>
				</aside>

				<div class="content">
					<nav class="dashboard-nav">
						<ul>
							<li><nuxt-link to="/dashboard">My Created Bounties</nuxt-link></li>
							<li><nuxt-link to="/dashboard/submissions">My Submissions</nuxt-link></li>
						</ul>
					</nav>

					<div class="dashboard-page">
						<nuxt-page />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	definePageMeta({ layout: 'bountrip' });

	const walletStore = useWalletStore();

	const accountBalance = computed(() => walletStore.accountBalance || '');
	const accountId = computed(() => walletStore.account?.accountId || '');
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.dashboard-wrapper
		margin-top: calc(64px + 0.5rem)

		.splash
			height: 50dvh
			background: var(--brand2) url('/images/pattern-white.svg') repeat fixed
			background-size: 100px
			border-radius: 0 0 1rem 1rem

		.dashboard-section
			margin-top: -20dvh
			background: white
			padding: 0 1rem
			border-radius: 1rem 1rem 0 0

		.shadow-left, .shadow-right
			margin-top: 20dvh

	.content
		flex-grow: 1

		.dashboard-nav
			border-bottom: 2px solid #CCC

			ul
				display: flex
				padding: 0
				margin: 0
				list-style: none

				li
					a
						padding: 0.5rem 1rem
						display: block
						text-decoration: none
						font-weight: 600
						transition: color 0.3s

						&.router-link-exact-active
							color: var(--brand2)

							&:after
								content: ''
								display: block
								width: 50%
								height: 2px
								background: var(--brand2)
								position: absolute
								bottom: -2px
								left: 50%
								transform: translateX(-50%)

						&:hover
							color: var(--brand2)

							&:after
								content: ''
								display: block
								width: 50%
								height: 2px
								background: var(--brand1)
								position: absolute
								bottom: -2px
								left: 50%
								transform: translateX(-50%)

	.sidebar
		width: 350px
		flex-shrink: 1
		border-right: 1px solid #DDD

		.user-information
			position: sticky
			top: calc(64px + 1rem)

		.avatar
			width: 100px
			aspect-ratio: 1
			background: #DDD
			border-radius: 50%
			display: flex
			align-items: center
			justify-content: center

			.iconify
				font-size: 2rem
				color: white
				display: flex
				align-items: center
				justify-content: center

		.account-id
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
</style>