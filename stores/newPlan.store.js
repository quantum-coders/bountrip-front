import { defineStore } from 'pinia';

export const useNewPlanStore = defineStore('newPlan', () => {

	const plan = ref({
		title: '',
		description: '',
		places: []
	});

	return {
		plan,
	};
});