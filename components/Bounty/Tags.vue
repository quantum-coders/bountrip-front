<template>
	<pre>{{ newBounty.tags }}</pre>
</template>

<script setup>

	const newBounty = useNewBountyStore();

	const getTags = async () => {
		const { error, data } = await useBaseFetch('/ai/tags', {
			method: 'POST',
			body: JSON.stringify({ input: `I am planning to visit ${useNewBountyStore().bounty?.placeName },from ${useNewBountyStore().bounty?.selectedDate[0]._d} to ${useNewBountyStore().bounty?.selectedDate[1]._d}, what are some popular attractions?` }),
		});

		if(error.value) {
			console.error(error);
			return;
		}

		newBounty.tags = data.value.data.tags;
	};

	onMounted(() => {
		if(!newBounty.tags.length) {
			getTags();
		}
	});
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
</style>
