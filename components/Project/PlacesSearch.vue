<template>
	<input type="text" id="places" :placeholder="props.placeholder" v-model="value" />
</template>

<script setup>

	const props = defineProps({
		modelValue: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: 'Where do you want to go?',
		},
	});

	const emit = defineEmits([ 'update:modelValue', 'placeChanged', 'placePhotos' ]);

	const value = ref(props.modelValue);
	const autocomplete = ref(null);

	onMounted(() => {
		autocomplete.value = new google.maps.places.Autocomplete(
			document.getElementById('places'),
		);

		autocomplete.value.addListener('place_changed', () => {
			const place = autocomplete.value.getPlace();
			console.log(place);  // Access place details here

			let photos = [];

			if(place.photos && place.photos.length > 0) {
				photos = place.photos.map(photo => ({
					url: photo.getUrl({ maxWidth: 1024, maxHeight: 768 }),  // Adjust size as needed
					attribution: photo.html_attributions,
				}));

				place.photos = photos;
			} else {
				console.log('No photos available for this place');
			}

			// Emit the place details to the parent component
			emit('update:modelValue', place.formatted_address);
			emit('placeChanged', place);
			emit('placePhotos', photos);
			value.value = place.formatted_address;
		});
	});
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
</style>