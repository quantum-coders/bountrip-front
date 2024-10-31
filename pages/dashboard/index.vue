<template>
	<div class="p-3" v-if="walletStore.user">
		<template v-for="b in bounties" :key="b.id">
			<bounty-card :bounty="b" />
		</template>
	</div>
</template>

<script setup>

	const loading = ref(false);
	const walletStore = useWalletStore();
	const bounties = ref([]);

	const getBounties = async () => {
		const { data, error } = await useBaseFetch(`/users/${ walletStore.user.id }/bounties`);

		if (error.value) {
			console.error('Error fetching bounties', error);
			return;
		}

		bounties.value = data.value.data;
	};

	// watch walletStore.user and fetch bounties when user is set
	watch(() => walletStore.user, async () => {
		if (walletStore.user) {
			await getBounties();
		}
	});

	onMounted(async () => {
		if (walletStore.user) {
			await getBounties();
		}
	});

</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
</style>