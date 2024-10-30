<template>
	<span class="rating-stars">
		<icon
			v-for="n in fullStars"
			:key="'full-' + n"
			name="material-symbols:star"
			class="star-icon full"
		/>
		<icon
			v-if="halfStar"
			name="material-symbols:star-half"
			class="star-icon half"
		/>
		<icon
			v-for="n in emptyStars"
			:key="'empty-' + n"
			name="material-symbols:star-outline"
			class="star-icon empty"
		/>
	</span>
</template>

<script setup>
	import { computed } from 'vue';

	const props = defineProps({
		rating: {
			type: Number,
			required: true,
			default: 0,
		},
	});

	const fullStars = computed(() => Math.floor(props.rating));
	const halfStar = computed(() => props.rating % 1 !== 0);
	const emptyStars = computed(() => 5 - fullStars.value - (halfStar.value ? 1 : 0));
</script>

<style scoped>
	.rating-stars {
		display: flex;
		align-items: center;
	}

	.star-icon {
		font-size: 24px;
		color: #FFD700;
	}

	.star-icon.empty {
		color: #ccc;
	}
</style>
