<template>
	<div v-if="props.showTransaction"
		 class="alert alert-success mt-3 d-flex align-items-center justify-content-between">
		Plan submitted successfully!
		<a
			:href="'https://explorer.testnet.near.org/transactions/' + props.txHash"
			target="_blank"
			class="btn btn-sm btn-outline-dark"
		>View Transaction</a>
	</div>
</template>
<script setup>
	const props = defineProps({
		showTransaction: Boolean,
		txHash: String,
	})
</script>

<style scoped lang="sass">

</style>
