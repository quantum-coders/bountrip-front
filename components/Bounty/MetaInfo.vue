<template>
	<p class="meta">
		<span>
			<icon name="material-symbols:calendar-clock-outline" />
			{{ startDate }}
			<icon class="arrow" name="material-symbols:arrow-right-alt" />
			{{ endDate }}
		</span>
		<span>
			<icon name="material-symbols:alarm-outline-rounded" />
			{{ due }} days left
		</span>
		<span>
			<icon name="material-symbols:planner-banner-ad-pt-outline-sharp" />
			{{ props.participants?.length || 0 }} Plan{{ props.participants?.length !== 1 ? 's' : '' }}
		</span>
	</p>
</template>

<script setup>
	import moment from 'moment';

	const props = defineProps({
		metas: {
			type: Object,
			default: () => ({})
		},
		created: {
			type: String,
			default: ''
		},
		participants: {
			type: Array,
			default: () => []
		},
	});

	// Oct 30
	const startDate = computed(() => moment(props.metas?.selectedDate[0]).format('MMM DD'));
	const endDate = computed(() => moment(props.metas?.selectedDate[1]).format('MMM DD'));

	const due = computed(() => {
		const diff = moment(props.metas?.selectedDate[1]).diff(moment(), 'days');
		return diff > 0 ? diff : 0;
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
