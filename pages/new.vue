<template>
	<div class="new-wrapper">
		<div class="container">
			<bounty-wizard/>
		</div>
	</div>

</template>

<script setup>
	const route = useRoute();
	const router = useRouter();
	definePageMeta({layout: 'bountrip'});

	onMounted(async () => {
		console.info("onMounted triggered");
		console.info("route.query", route.query);
		const transactionHashes = route.query.transactionHashes;
		if (transactionHashes) {
			const lastBounty = await $fetch(useRuntimeConfig().public.apiURL + '/bounties/latest');
			console.info("Debugging", lastBounty);
			if (lastBounty) {
				console.info('The most recent created bounty is:', lastBounty.data);
				const idBountyDatabase = localStorage.getItem('idNewBounty');
				console.info('The id of the bounty in the database is:', idBountyDatabase);
				const updatedBounty = await useWalletStore().upsertBounty({
					idBounty: idBountyDatabase,
					idOnChain: lastBounty.data.id
				});
				console.info("Updated bounty", updatedBounty);
				await router.push(`/bounties/${updatedBounty.id}`);
			}
		}
	});
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.new-wrapper
		padding-top: 64px
</style>
