<template>
	<article class="bounty">
		<!-- Enlaces Restringidos -->
		<div class="bounty-image">
			<nuxt-link :to="`/bounties/${bounty.id}`">
				<img
					:src="bounty.metas.placePhotos[0].url"
					class="bounty-image-thumb"
					alt="Imagen de la Bounty"
				/>
			</nuxt-link>
			<span class="bounty-prize">{{ bounty.totalPrize }} NEAR</span>
		</div>

		<div class="bounty-info">
			<div class="d-flex justify-content-end mb-2">
				<span
					class="badge"
					:class="bounty.isActive ? 'bg-success' : 'bg-secondary'"
				>{{ bounty.isActive ? 'Active' : 'Finished' }}</span>
			</div>

			<h4>
				<nuxt-link :to="`/bounties/${bounty.id}`" class="text-decoration-none text-dark">
					{{ bounty.title }}
				</nuxt-link>
			</h4>

			<p class="bounty-description">{{ bounty.metas.description }}</p>

			<bounty-meta-info
				:metas="bounty.metas"
				:created="bounty.created"
				:participants="bounty.participants || []"
				class="mb-2"
			/>

			<!-- Botones de Acción -->
			<div class="bounty-actions">
				<button
					v-if="canFinalize(bounty)"
					@click="$emit('finalize', bounty)"
					class="btn btn-primary btn-sm"
				>
					Finalize Bounty
				</button>

				<button
					v-if="canParticipate(bounty)"
					@click="participate(bounty)"
					class="btn btn-warning btn-sm"
				>
					Submit Plan
				</button>

				<nuxt-link :to="`/bounties/${bounty.id}`" class="btn btn-secondary btn-sm">
					View Bounty
				</nuxt-link>
			</div>
		</div>

		<!-- Sección de Ganadores -->
		<div v-if="bounty.winners?.length && isWinnersVisible(bounty.id)">
			<ul class="list-group list-group-flush mt-2">
				<li
					v-for="winner in bounty.winners"
					:key="winner"
					class="list-group-item"
				>
					{{ winner }}
				</li>
			</ul>
		</div>
	</article>
</template>

<script setup>

	const props = defineProps({
		bounty: {
			type: Object,
			required: true,
		},
	});

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

			img
				width: 100%
				height: 100%
				object-fit: cover
				background-size: cover
				position: absolute

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