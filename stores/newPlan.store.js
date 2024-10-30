import {defineStore} from 'pinia';
import {toRaw} from 'vue';
import { stringify } from 'flatted';

export const useNewPlanStore = defineStore('newPlan', () => {
	const plan = ref({
		title: '',
		description: '',
		places: [],
		idBounty: '',
	});

	const createPlan = async () => {
		// Usar toRaw para convertir el proxy a un objeto plano
		let planData = toRaw(plan.value);
		planData.places = toRaw(planData.places);
		planData.idNear = useWalletStore().accountId;
		console.info("the payload is", JSON.stringify(planData));
		const res = await $fetch(useRuntimeConfig().public.apiURL + '/bounties/plans', {
			method: 'POST',
			body: JSON.stringify(planData),
			headers: {
				'Content-Type': 'application/json',
			}
		});
		console.info('Plan created:', res);
		const tx = await useWalletStore().participateInBounty(res.data.bounty.idOnChain)
		return tx;
	}

	return {
		plan,
		createPlan,
	};
});
