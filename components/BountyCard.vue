<template>
	<div class="list-group-item">
		<div class="d-flex justify-content-between align-items-start">
			<div>
				<h5 class="mb-1">Bounty #{{ bounty.id }}</h5>
				<p class="mb-1">Creator: {{ bounty.creator }}</p>
				<p class="mb-1">Total Prize: {{ bounty.totalPrize }} NEAR</p>
				<p class="mb-1">Participants: {{ bounty.participants?.length || 0 }}</p>
				<span
					class="badge"
					:class="bounty.isActive ? 'bg-success' : 'bg-secondary'"
				>
          {{ bounty.isActive ? 'Active' : 'Finished' }}
        </span>

				<!-- Participants Section -->
				<div class="mt-2" v-if="bounty.participants?.length">
					<button
						class="btn btn-link p-0"
						@click="toggleParticipants"
					>
						{{ showParticipants ? 'Hide Participants' : 'View Participants' }}
					</button>
					<div v-if="showParticipants">
						<ul class="list-group list-group-flush mt-2">
							<li
								v-for="participant in bounty.participants"
								:key="participant"
								class="list-group-item"
							>
								{{ participant }}
							</li>
						</ul>
					</div>
				</div>

				<!-- Winners Section -->
				<div class="mt-2" v-if="bounty.winners?.length">
					<button
						class="btn btn-link p-0"
						@click="toggleWinners"
					>
						{{ showWinners ? 'Hide Winners' : 'View Winners' }}
					</button>
					<div v-if="showWinners">
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
				</div>

				<!-- Finalize Button -->
				<div class="mt-2">
					<button
						v-if="canFinalize"
						@click="$emit('finalize', bounty)"
						class="btn btn-primary mt-2 me-2"
					>
						Finalize Bounty
					</button>
				</div>
			</div>
			<!-- Participate Button -->
			<button
				v-if="canParticipate"
				@click="$emit('participate', bounty.id)"
				class="btn btn-warning"
			>
				Participate
			</button>
		</div>
	</div>
</template>

<script setup>
	import {ref, computed} from 'vue'

	const emit = defineEmits(['finalize', 'participate'])
	const props = defineProps({
		bounty: {
			type: Object,
			required: true,
		},
		userAccountId: {
			type: String,
			required: false,
		},
	})

	const bounty = props.bounty
	const userAccountId = props.userAccountId
	const showParticipants = ref(false)
	const showWinners = ref(false)

	const toggleParticipants = () => {
		showParticipants.value = !showParticipants.value
	}

	const toggleWinners = () => {
		showWinners.value = !showWinners.value
	}

	const canParticipate = computed(() => {
/*		return (
			bounty.isActive &&
			bounty.creator !== userAccountId &&
			!bounty.participants?.includes(userAccountId)
		)*/

		return bounty.isActive;
	})

	const canFinalize = computed(() => {
		return (
			bounty.creator === userAccountId &&
			bounty.isActive &&
			bounty.participants?.length > 0
		)
	})


</script>

<style scoped>
</style>
