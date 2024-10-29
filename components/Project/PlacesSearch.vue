<template>
	<input type="text" id="places" placeholder="Where do you want to go?">
</template>

<script setup>

	const autocomplete = ref(null);

	onMounted(() => {
		autocomplete.value = new google.maps.places.Autocomplete(
			document.getElementById('places'),
		);

		autocomplete.value.addListener('place_changed', () => {
			const place = autocomplete.value.getPlace();
			console.log(place);  // Access place details here
		});
	});
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>
</style>