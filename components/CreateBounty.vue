<template>
	<div class="col-12">
		<div class="card">
			<div class="card-body">
				<h3 class="card-title mb-4">Create New Bounty</h3>
				<form @submit.prevent="showConfirmationModal">
					<div class="mb-3">
						<label class="form-label">Prizes (NEAR)</label>
						<div
							v-for="(prize, index) in bountyData.prizes"
							:key="index"
							class="input-group mb-2"
						>
							<input
								v-model="bountyData.prizes[index]"
								type="text"
								class="form-control"
								placeholder="Amount in NEAR (e.g., 1.5)"
								required
							/>
							<button
								type="button"
								@click="removePrize(index)"
								class="btn btn-danger"
								:disabled="bountyData.prizes.length <= 1"
							>
								-
							</button>
						</div>
					</div>
					<div class="d-flex gap-2">
						<button type="button" @click="addPrize" class="btn btn-secondary">
							Add Prize
						</button>
						<button type="submit" class="btn btn-success" :disabled="isLoading">
							{{ isLoading ? 'Creating...' : 'Create Bounty' }}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>

	<!-- Confirmation Modal -->
	<div v-if="showModal" class="modal" tabindex="-1" style="display: block;">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Confirm Bounty Creation</h5>
					<button type="button" class="btn-close" @click="hideConfirmationModal"></button>
				</div>
				<div class="modal-body">
					<p>Are you sure you want to create this bounty?</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" @click="hideConfirmationModal">Cancel</button>
					<button type="button" class="btn btn-success" @click="confirmCreateBounty">Confirm</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const emit = defineEmits([ 'bountyCreated' ]);
	const walletStore = useWalletStore();
	const bountyData = ref({ prizes: [ '' ] });
	const isLoading = ref(false);
	const showModal = ref(false);

	const addPrize = () => bountyData.value.prizes.push('');
	const removePrize = (index) => {
		if(bountyData.value.prizes.length > 1) {
			bountyData.value.prizes.splice(index, 1);
		}
	};

	const showConfirmationModal = () => {
		showModal.value = true;
	};

	const hideConfirmationModal = () => {
		showModal.value = false;
	};

	const confirmCreateBounty = async () => {
		try {
			isLoading.value = true;
			const prizes = bountyData.value.prizes.map((prize) => prize.trim());
			if(prizes.some((prize) => isNaN(parseFloat(prize)))) {
				throw new Error('All prizes must be valid numbers');
			}
			const result = await walletStore.createBounty({ prizes });
			alert('Bounty created successfully!');
			bountyData.value.prizes = [ '' ];
			emit('bountyCreated');
		} catch(error) {
			alert(error.message);
		} finally {
			isLoading.value = false;
			hideConfirmationModal();
		}
	};
</script>

<style scoped></style>
