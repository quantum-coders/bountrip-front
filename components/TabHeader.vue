<template>
	<div class="d-flex justify-content-between align-items-center mb-4">
		<h4 class="mb-0">{{ title }}</h4>
		<button @click="$emit('refresh')" class="btn btn-primary" :disabled="isLoading">
			{{ isLoading ? 'Loading...' : 'Refresh' }}
		</button>
	</div>
</template>

<script setup>
	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		isLoading: {
			type: Boolean,
			required: false,
			default: false,
		},
	});
</script>

<style scoped></style>
