<template>
	<div class="wizard-wrapper">
		<div class="wizard-steps">
			<div class="step step1" v-if="step === 1">
				<h2>Where do you plan to go?</h2>

				<div class="search mb-5">
					<project-places-search
						v-model="placeName"
						@place-changed="place = $event"
						@place-photos="placePhotos = $event"
					/>
				</div>
			</div>

			<div class="step step2" v-if="step === 2">
				<h2>When are you going?</h2>

				<div class="date-picker-wrapper">
					<project-date-picker v-model="selectedDate" />
				</div>
			</div>
		</div>

		<div class="controls">
			<button
				class="btn btn-secondary px-4 rounded-pill"
				v-show="step > 1"
				@click.prevent="prevStep"
			>Back
			</button>
			<button class="btn btn-secondary ms-auto px-4 rounded-pill" @click.prevent="nextStep">Next</button>
		</div>
	</div>
</template>

<script setup>
	const step = ref(1);
	const placeName = ref('');
	const placePhotos = ref([]);
	const place = ref(null);
	const selectedDate = ref(null);

	const start = ref(null);
	const end = ref(null);

	const prevStep = () => {
		step.value--;
	};

	const nextStep = () => {
		step.value++;
	};

</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
	.search
		display: flex
		align-items: center
		background: white
		gap: 1rem
		padding: 1rem
		border-radius: 1rem
		width: 800px
		box-shadow: 0 0 1rem rgba(black, 0.1)

		input
			flex-grow: 1
			border: 0

			&:focus
				outline: none

	.controls
		display: flex
		justify-content: space-between
		width: 800px
		margin: 0 auto

	.step
		display: flex
		flex-direction: column
		align-items: center
		gap: 1rem

		.date-picker-wrapper
			width: 800px
</style>