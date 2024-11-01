<template>
	<div class="block block-bounties mb-5">
		<div class="container">
			<h2 class="title text-center mb-4">Hottest Bounties</h2>

			<div class="bounties mb-4">
				<div class="row gx-3">
					<div class="col-3" v-for="bounty in bountiesToShow">
						<article class="bounty-card"
								 @click="$router.push(`/bounties/${bounty.id}`)"
								 :style="{
                        background: `var(--brand1) url('${bounty.metas.placePhotos[0].url}') no-repeat center center`,
                        backgroundSize: 'auto 100%'
                      }"
						>
							<span class="bounty-prize"> {{ bounty.totalPrize }}  NEAR</span>

							<div class="bounty-info">
								<bounty-meta-info
									:metas="bounty.metas"
									:created="bounty.created"
									:participants="bounty.participants || []"
									class="mb-2"/>
							</div>
						</article>
					</div>
				</div>
			</div>

			<p class="text-end">
				<nuxt-link to="/bounties" class="btn btn-lg btn-primary">View all Bounties</nuxt-link>
			</p>
		</div>
	</div>
</template>

<script setup>
	const bounties = ref([]);
	// Obtener las Bounties al montar el componente
	onMounted(async () => {
		try {
			const {data} = await $fetch(`${useRuntimeConfig().public.apiURL}/bounties`);
			bounties.value = data;
		} catch (error) {
			console.error('Error fetching bounties:', error);
		}
	});

	// just take maximum 4 bounties
	const bountiesToShow = computed(() => bounties.value.slice(0, 4));
</script>

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
		border-radius: 0.5rem
		color: white
		padding: 1rem
		display: flex
		flex-direction: column
		justify-content: flex-end
		transition: background-size 0.3s
		position: relative

		&:hover
			background-size: auto 110% !important

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

		.bounty-prize
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
