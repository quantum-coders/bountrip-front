<template>
	<p class="meta" v-if="bounty">
		<span>
			<icon name="material-symbols:calendar-clock-outline" />
			{{ startDate }}
			<icon class="arrow" name="material-symbols:arrow-right-alt" />
			{{ endDate }}
		</span>
		<span>
			<icon name="material-symbols:alarm-outline-rounded" />
			Due in {{ dueDate }} day{{ dueDate > 1 ? 's' : '' }}
		</span>
		<span>
			<icon name="material-symbols:planner-banner-ad-pt-outline-sharp" />
			0 plans
		</span>
	</p>
</template>

<script setup>
	import moment from 'moment';

	const props = defineProps({
		bounty: {
			type: Object,
			required: true
		}
	});

	const startDate = computed(() => moment(props.bounty.metas.selectedDate[0]).format('MMM DD'));
	const endDate = computed(() => moment(props.bounty.metas.selectedDate[1]).format('MMM DD'));

	const dueDate = computed(() => {
		// how many days to trip start
		const start = moment(props.bounty.metas.selectedDate[0]);
		const now = moment();
		return start.diff(now, 'days');
	});

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