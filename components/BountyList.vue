<!-- BountyList.vue -->
<template>
	<div v-if="bounties.length" class="list-group">
		<BountyCard
			v-for="bounty in bounties"
			:key="bounty.id"
			:bounty="bounty"
			:userAccountId="userAccountId"
			@participate="handleParticipate"
			@finalize="handleFinalize"
		/>
	</div>
	<p v-else class="text-center text-muted py-4">No bounties available</p>
</template>

<script setup>

	const props = defineProps({
		bounties: {
			type: Array,
			required: true,
		},
		userAccountId: {
			type: String,
			required: false,
		},
	})

	const emit = defineEmits(['participate', 'finalize'])

	const handleParticipate = (bountyId) => {
		console.info('handleParticipate', bountyId)
		emit('participate', bountyId)
	}

	const handleFinalize = (bounty) => {
		console.info('handleFinalize', bounty)
		emit('finalize', bounty)
	}
</script>

<style scoped></style>
