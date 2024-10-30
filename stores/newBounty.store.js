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

	const newBounty = async () => {
		const data = {
			slug: `${bounty.value.title.toLowerCase().replace(/ /g, '-')}-${Date.now()}`,
			metas: {
				description: bounty.value.description,
				place: bounty.value.place,
				placeName: bounty.value.placeName,
				placePhotos: bounty.value.placePhotos,
				selectedDate: bounty.value.selectedDate,
				tripType: bounty.value.tripType,
				selectedTags: bounty.value.selectedTags,
			},
			title: bounty.value.title,
			content: '',
		}

		const createdBounty = await useWalletStore().upsertBounty(data);
		localStorage.setItem('idNewBounty', createdBounty.id);
		const onChainCreatedBounty = await useWalletStore().createBounty({
			prizes: bounty.value.prizes,
			...createdBounty,
		});
	}

	return {
		tags,
		bounty,
		step,
		newBounty,
		startBounty,
		toggleTag,
		isActiveTag,
	};
});
