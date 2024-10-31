<template>
	<div class="bounties-wrapper flex-grow-1 flex-column d-flex mb-2">
		<div class="container d-flex gap-2 flex-grow-1">
			<div class="content">
				<!-- Banner -->
				<div class="banner">
					<div class="banner-info">
						<h4>Earn money<br>sharing your trip tips</h4>
						<p class="mb-2">
							Design the ultimate travel plan for a fellow adventurer and earn NEAR
							rewards!
						</p>
					</div>
				</div>

				<!-- Lista de Bounties -->
				<div class="bounty-list">
					<template v-for="b in bounties" :key="b.id">
						<bounty-card :bounty="b" />
					</template>
				</div>
			</div>

			<aside class="sidebar">
				<sidebar-notifications />
			</aside>
		</div>
	</div>
</template>

<script setup>
	// Estado de las Bounties
	const bounties = ref([]);

	// Meta de la Página
	definePageMeta({ layout: 'bountrip' });

	// ID del Usuario Actual (Reemplazar con la lógica real de tu aplicación)
	const userAccountId = ref('quantum-coders.testnet'); // Ejemplo, reemplazar según sea necesario

	const participate = (b) => {
		useRouter().push(`/bounties/${ b.id }/new`);
	};

	// Obtener las Bounties al montar el componente
	onMounted(async () => {
		try {
			const { data } = await $fetch(`${ useRuntimeConfig().public.apiURL }/bounties`);
			bounties.value = data;
		} catch(error) {
			console.error('Error fetching bounties:', error);
		}
	});
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.bounties-wrapper
		margin-top: calc(64px + 0.5rem)

	.content
		flex-grow: 1

	.sidebar
		width: 450px
		flex-shrink: 0
		border-left: 1px solid #DDD

	.bounty-image-thumb
		width: 100%
		height: 100%
		object-fit: cover
		aspect-ratio: 16/9
		background-size: cover
		position: relative

	.banner
		aspect-ratio: 4.5
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
			align-items: stretch
			border-radius: 0.5rem
			overflow: clip
			border: 1px solid var(--bs-border-color)
			cursor: pointer
			position: relative

			&:hover
				border-color: var(--brand2)

			.bounty-image
				width: 150px
				flex-shrink: 0

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

				.bounty-description
					// 2 lines
					display: -webkit-box
					-webkit-line-clamp: 2
					-webkit-box-orient: vertical
					overflow: hidden

				p
					text-wrap: balance
					margin-bottom: 0.5rem

					&.meta
						font-size: 0.75rem

			.bounty-actions
				display: flex
				justify-content: flex-end
				gap: 0.5rem
</style>
