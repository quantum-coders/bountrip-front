<template>
	<div class="step step1" v-if="newBounty.step === 5">
		<h2>Define your prizes?</h2>
		<p>You can specify from 1 to 5 places as bounties.</p>

		<div class="prizes-wrapper">
			<bounty-prizes />
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

		.prizes-wrapper
			max-width: 600px
</style>