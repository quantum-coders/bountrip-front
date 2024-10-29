<template>

	<project-home-splash />
	<project-numbers class="numbers" />
	<project-hottest-bounties />

</template>

<script setup>
	definePageMeta({ layout: 'bountrip' });
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.numbers
		margin-top: -3.2rem
		z-index: 2
		margin-bottom: 5rem

</style>
