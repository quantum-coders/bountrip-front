import { defineStore } from 'pinia';

export const useWinnersStore = defineStore('winnersBounty', () => {

	const winners = ref([]);
	const numberOfWinners = ref(1);

	const setWinner = (data) => {
		// Buscar la posición correcta para insertar el ganador
		let insertIndex = winners.value.findIndex(winner => data.position < winner.position);
		if(insertIndex === -1) {
			insertIndex = winners.value.length; // Insertar al final si no se encuentra una posición menor
		}

		// Eliminar cualquier ganador existente con el mismo idNear
		winners.value = winners.value.filter(winner => winner.idNear !== data.idNear);

		// Insertar el nuevo ganador en la posición correcta
		winners.value.splice(insertIndex, 0, data);

		console.info('Winner set:', winners.value);
	};

	const removeWinner = (idNear) => {
		// remove from winners
		console.info('Removing winner:', idNear);
		winners.value = winners.value.filter(winner => winner.idNear !== idNear);
		console.info('Winner removed:', winners.value);
	};

	const finalizeBounty = async () => {
		const idBounty = winners.value[0].idBounty;
		const winnersOrdered = winners.value.sort((a, b) => a.position - b.position);
		const winnersIdNear = winnersOrdered.map(winner => winner.idNear);
		console.info('Winners idNear:', winnersIdNear);
		const transaction = await useWalletStore().finalizeBounty(idBounty, winnersIdNear);
		console.info('Bounty finalized:', transaction);
		const hash = transaction.transaction.hash;
		/// update bounty in database
		const res = await $fetch(useRuntimeConfig().public.apiURL + '/bounties/' + idBounty, {
			method: 'POST',
			body: JSON.stringify({
				idBounty,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		console.info('Bounty updated:', res);
		return hash;
	};

	return {
		setWinner,
		removeWinner,
		numberOfWinners,
		winners,
		finalizeBounty,
	};
});
