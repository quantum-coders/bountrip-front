<template>
	<pre>{{ tags }}</pre>
</template>

<script setup>

	const tags = ref([]);

	const getTags = async () => {
		const { error, data } = await useBaseFetch('/ai/tags', {
			method: 'POST',
			body: JSON.stringify({ input: "I am planning to visit Paris, what are some popular attractions?" })
		});

		if (error.value) {
			console.error(error);
			return;
		}

		tags.value = data.value.data;
	}

	onMounted(() => {
		getTags();
	});
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
</style>