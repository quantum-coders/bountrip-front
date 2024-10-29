<template>
	<div class="tags">
		<template v-for="t in newBounty.tags" :key="t">
			<span class="tag" @click="newBounty.toggleTag(t)" :class="{ 'is-active': newBounty.isActiveTag(t) }">
				{{ t }}
			</span>
		</template>
	</div>
</template>

<script setup>

	const newBounty = useNewBountyStore();

	const getTags = async () => {
		const { error, data } = await useBaseFetch('/ai/tags', {
			method: 'POST',
			body: JSON.stringify({ input: 'I am planning to visit Paris, what are some popular attractions?' }),
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
	.tags
		display: flex
		justify-content: center
		flex-wrap: wrap
		gap: 0.5rem

		.tag
			background: white
			border: 1px solid var(--brand2)
			color: var(--brand2)
			padding: 0.5rem 1rem
			border-radius: 10rem
			cursor: pointer
			transition: background 0.3s

			&:hover
				background: var(--brand2)
				color: white

			&.is-active
				background: var(--brand1)
				border-color: var(--brand1)
				color: white
</style>