<template>
	<p class="meta">
		<span>
			<icon name="material-symbols:calendar-clock-outline" />
			Oct 24
			<icon class="arrow" name="material-symbols:arrow-right-alt" />
			Oct 30
		</span>
		<span>
			<icon name="material-symbols:alarm-outline-rounded" />
			Due in 10 days
		</span>
		<span>
			<icon name="material-symbols:planner-banner-ad-pt-outline-sharp" />
			10 plans
		</span>
	</p>
</template>

<script setup>
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.meta
		span
			padding: 0 0.5rem
			border-right: 1px solid var(--bs-border-color)

			.iconify
				top: 0.155em

			&:first-child
				padding-left: 0

			&:last-child
				border-right: 0
</style>