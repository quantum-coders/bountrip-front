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
					<article class="bounty" v-for="b in bounties" :key="b.id">
						<!-- Enlaces Restringidos -->
						<div class="bounty-image">
							<nuxt-link :to="`/bounties/${b.id}`">
								<img
									:src="b.metas.placePhotos[0].url"
									class="bounty-image-thumb"
									alt="Imagen de la Bounty"
								/>
							</nuxt-link>
							<span class="bounty-prize">{{ b.totalPrize }} NEAR</span>
						</div>

						<div class="bounty-info">
							<h4>
								<nuxt-link :to="`/bounties/${b.id}`" class="text-decoration-none text-dark">
									{{ b.title }}
								</nuxt-link>
							</h4>

							<p>{{ b.metas.description }}</p>
							<bounty-meta-info
								:metas="b.metas"
								:created="b.created"
								:participants="b.participants || []"
								class="mb-0"
							/>
						</div>

						<span
							class="badge"
							:class="b.isActive ? 'bg-success' : 'bg-secondary'"
						>{{ b.isActive ? 'Active' : 'Finished' }}</span>

						<!-- Botones de Toggle -->
						<!--<div>
							<button
								class="btn btn-link p-0 me-3"
								@click.stop="toggleParticipants(b.id)"
								v-if="b.participants?.length"
							>
								{{ isParticipantsVisible(b.id) ? 'Hide Participants' : 'View Participants' }}
							</button>
							<button
								class="btn btn-link p-0"
								@click.stop="toggleWinners(b.id)"
								v-if="b.winners?.length"
							>
								{{ isWinnersVisible(b.id) ? 'Hide Winners' : 'View Winners' }}
							</button>
						</div>-->

						<!-- Sección de Participantes -->
						<!--<div class="mt-2" v-if="b.participants?.length && isParticipantsVisible(b.id)">
							<ul class="list-group list-group-flush mt-2">
								<li
									v-for="participant in b.participants"
									:key="participant"
									class="list-group-item"
								>
									{{ participant }}
								</li>
							</ul>
						</div>-->

						<!-- Sección de Ganadores -->
						<div v-if="b.winners?.length && isWinnersVisible(b.id)">
							<ul class="list-group list-group-flush mt-2">
								<li
									v-for="winner in b.winners"
									:key="winner"
									class="list-group-item"
								>
									{{ winner }}
								</li>
							</ul>
						</div>

						<!-- Botones de Acción -->
						<div class="bounty-actions">
							<button
								v-if="canFinalize(b)"
								@click="$emit('finalize', b)"
								class="btn btn-primary btn-sm"
							>
								Finalize Bounty
							</button>

							<button
								v-if="canParticipate(b)"
								@click="participate(b)"
								class="btn btn-warning btn-sm"
							>
								Submit Plan
							</button>

							<nuxt-link :to="`/bounties/${b.id}`" class="btn btn-secondary btn-sm">
								View Bounty
							</nuxt-link>
						</div>
					</article>
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

	// Estados de visibilidad para Participantes y Ganadores por ID de Bounty
	const participantsVisibility = ref({});
	const winnersVisibility = ref({});

	// Meta de la Página
	definePageMeta({ layout: 'bountrip' });

	// ID del Usuario Actual (Reemplazar con la lógica real de tu aplicación)
	const userAccountId = ref('quantum-coders.testnet'); // Ejemplo, reemplazar según sea necesario

	// Función para alternar la visibilidad de Participantes
	const toggleParticipants = (id) => {
		participantsVisibility.value[id] = !participantsVisibility.value[id];
	};

	// Función para alternar la visibilidad de Ganadores
	const toggleWinners = (id) => {
		winnersVisibility.value[id] = !winnersVisibility.value[id];
	};

	// Verificar si los Participantes están visibles
	const isParticipantsVisible = (id) => {
		return participantsVisibility.value[id];
	};

	const participate = (b) => {
		useRouter().push(`/bounties/${ b.id }/new`);
	};

	// Verificar si los Ganadores están visibles
	const isWinnersVisible = (id) => {
		return winnersVisibility.value[id];
	};

	// Determinar si el usuario puede participar
	const canParticipate = (bounty) => {
		return bounty.isActive && bounty.creator !== useWalletStore().accountId;
	};

	// Determinar si el usuario puede finalizar la bounty
	const canFinalize = (bounty) => {
		return (
			bounty.creator === useWalletStore().accountId &&
			bounty.isActive &&
			bounty.participants?.length > 0
		);
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

				p
					text-wrap: balance
					margin-bottom: 0.5rem

					&.meta
						font-size: 0.75rem

			.badge
				position: absolute
				right: 0.5rem
				top: 0.5rem

			.bounty-actions
				position: absolute
				bottom: 0.5rem
				right: 0.5rem
				display: flex
				gap: 0.5rem
</style>
