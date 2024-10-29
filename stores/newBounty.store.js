import { defineStore } from 'pinia';

export const useNewBountyStore = defineStore('newBounty', () => {

	const bounty = ref({
		title: '',
		description: '',
		place: null,
		placeName: '',
		placePhotos: [],
		selectedDate: null,
		tripType: '',
	});

	const tags = ref([]);

	const step = ref(1);

	const startBounty = (callback) => {
		if(bounty.value.place && bounty.value.placeName) {
			if(typeof callback === 'function') {
				callback();
			}
		}
	};

	return {
		tags,
		bounty,
		step,
		startBounty
	};
});