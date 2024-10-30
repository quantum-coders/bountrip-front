<template>
	<p class="meta">
		<span>
			<icon name="material-symbols:calendar-clock-outline"/>
			{{   useDateFormat(props.metas?.selectedDate[0], 'MMMM DD, YYYY').value  }}
			<icon class="arrow" name="material-symbols:arrow-right-alt"/>
			{{ useDateFormat(props.metas?.selectedDate[1], 'MMMM DD, YYYY').value  }}
		</span>
		<span>
			<icon name="material-symbols:alarm-outline-rounded"/>
			{{ useDateFormat(props.created, 'MMMM DD, YYYY').value  }}
		</span>
		<span>
			<icon name="material-symbols:planner-banner-ad-pt-outline-sharp"/>
			{{ props.participants?.length }} Plans
		</span>
	</p>
</template>

<script setup>
	import {useDateFormat} from '@vueuse/core';

	const props = defineProps({
		metas: Object,
		created: String,
		participants: Array
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
