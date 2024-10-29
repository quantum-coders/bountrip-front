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
		selectedTags: [],
		prizes: []
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

	const toggleTag = (tag) => {
		const index = bounty.value.selectedTags.indexOf(tag);
		if(index > -1) {
			bounty.value.selectedTags.splice(index, 1);
		} else {
			bounty.value.selectedTags.push(tag);
		}
	};

	const isActiveTag = (tag) => {
		return bounty.value.selectedTags.includes(tag);
	}

	return {
		tags,
		bounty,
		step,
		startBounty,
		toggleTag,
		isActiveTag,
	};
});