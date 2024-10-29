<template>
	<div class="step step4" v-if="newBounty.step === 4">
		<h2>Tell us what you’re interested in</h2>
		<div class="tags-wrapper">
			<bounty-tags />
		</div>
	</div>
</template>

<script setup>
	const newBounty = useNewBountyStore();
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.step
		display: flex
		flex-direction: column
		align-items: center
		gap: 1rem

		.tags-wrapper
			width: 800px
</style>