<template>
	<div class="p-3">
		<template v-for="b in bounties" :key="b.id">
			<bounty-card :bounty="b" />
		</template>
	</div>
</template>

<script setup>

	const bounties = ref([]);
	const walletStore = useWalletStore();

	onMounted(async () => {
		const res = await walletStore.fetchParticipantBounties(walletStore.accountId)
		bounties.value = res
	});
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
</style>
