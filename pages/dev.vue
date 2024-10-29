<template>


	<div class="container py-5">
		<!-- Wallet Component -->
		<div class="p-5 flex d-flex gap-2">
			<div @click="showNotifications = true" class="btn btn-primary">Show Notifications</div>
			<div @click="walletStore.fetchInteractions()" class="btn btn-primary">Refresh Notifications</div>
			<div @click="showNotificationsCard = !showNotificationsCard" class="btn btn-primary">Toggle Recent Notifications</div>
			<Wallet/>
		</div>
		<div v-if="showNotificationsCard" class="flex pb-2">
				<div class="card">
					<div class="card-header">
						<h5 class="card-title">Notifications</h5>
						<button @click="closeNotificationCard" class="btn-close"></button>
					</div>
					<div class="card-body">
						<div v-for="notification in notifications" :key="notification.transactionHash">
							<div class="alert" :class="'alert-' + notification.type">
								{{ notification.message }}
								<a v-if="notification.transactionHash" :href="notification.transactionLink"
								   target="_blank">
									{{ notification.transactionHash }}
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

		<div v-if="walletStore.isConnected" class="row g-4">
			<!-- Create Bounty Section -->
			<CreateBounty @bountyCreated="onBountyCreated"/>

			<!-- Tabs Section -->
			<div class="col-12">
				<div class="card">
					<div class="card-header">
						<ul class="nav nav-tabs card-header-tabs">
							<li class="nav-item" v-for="tab in tabs" :key="tab.id">
								<button
									class="nav-link"
									:class="{ active: currentTab === tab.id }"
									@click="currentTab = tab.id"
								>
									{{ tab.name }}
								</button>
							</li>
						</ul>
					</div>

					<div class="card-body">
						<!-- Tab Content -->
						<div v-if="currentTab === 'all'" class="tab-content">
							<TabHeader
								title="Available Bounties"
								:isLoading="isLoadingBounties"
								@refresh="loadAllBounties"
							/>
							<BountyList
								:bounties="walletStore.bounties"
								:userAccountId="walletStore.account?.accountId"
								@participate="handleParticipate"
								@finalize="handleFinalize"
							/>
						</div>

						<div v-if="currentTab === 'created'" class="tab-content">
							<TabHeader
								title="My Created Bounties"
								:isLoading="isLoadingCreator"
								@refresh="loadCreatorBounties"
							/>
							<BountyList
								:bounties="walletStore.creatorBounties"
								:userAccountId="walletStore.account?.accountId"
								@participate="handleParticipate"
								@finalize="handleFinalize"
							/>
						</div>

						<div v-if="currentTab === 'participating'" class="tab-content">
							<TabHeader
								title="My Participations"
								:isLoading="isLoadingParticipant"
								@refresh="loadParticipantBounties"
							/>
							<BountyList
								:bounties="walletStore.participantBounties"
								:userAccountId="walletStore.account?.accountId"
								@participate="handleParticipate"
								@finalize="handleFinalize"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Modals -->
		<!-- Participate Confirmation Modal -->
		<ParticipateModal
			v-if="showParticipateModal"
			:bountyId="selectedBountyId"
			@confirm="confirmParticipate"
			@close="showParticipateModal = false"
		/>

		<!-- Finalize Bounty Modal -->
		<FinalizeModal
			v-if="showFinalizeModal"
			:bountyId="selectedBountyId"
			:participants="selectedBountyParticipants"
			@submit="submitFinalize"
			@close="showFinalizeModal = false"
		/>

		<!-- Toast Notifications -->
		<ToastNotification
			v-if="feedback.message"
			:message="feedback.message"
			:type="feedback.type"
			:transactionLink="transactionLink"
			:transactionHash="transactionHash"
			@close="feedback.message = ''"
		/>

		<div v-if="showNotificationsCard" class="notifications">

		</div>

	</div>
	<SidebarNotifications
		v-if="showNotifications"
	/>


</template>

<script setup>


	const walletStore = useWalletStore();

	const feedback = ref({message: '', type: 'success'});
	const currentTab = ref('all');
	const isLoadingBounties = ref(false);
	const isLoadingCreator = ref(false);
	const isLoadingParticipant = ref(false);
	const isParticipating = ref(false);
	const isFinalizingBounty = ref(false);
	const transactionHash = ref('');
	const transactionLink = ref('');
	const selectedBountyId = ref(null);
	const selectedBountyParticipants = ref([]);
	const notifications = ref([]);
	const showNotifications = ref(false);
	const showNotificationsCard = ref(false);

	const showParticipateModal = ref(false);
	const showFinalizeModal = ref(false);

	const tabs = [
		{id: 'all', name: 'All Bounties'},
		{id: 'created', name: 'My Created'},
		{id: 'participating', name: 'My Participations'},
	];

	const closeNotificationCard = () => {
		showNotificationsCard.value = false;
	};
	const showFeedback = (message, type = 'success', hash = '') => {
		showNotificationsCard.value = true;
		feedback.value = {message, type};
		transactionHash.value = hash;
		transactionLink.value = hash
			? `https://explorer.testnet.near.org/transactions/${hash}`
			: '';
		notifications.value.push({
			message,
			type,
			transactionHash: hash,
			transactionLink,
		});

		setTimeout(() => {
			feedback.value.message = '';
			transactionLink.value = '';
		}, 10000);
	};

	const handleParticipate = (bountyId) => {
		selectedBountyId.value = bountyId;
		showParticipateModal.value = true;
	};

	const confirmParticipate = async () => {
		showParticipateModal.value = false;
		try {
			isParticipating.value = true;
			const result = await walletStore.participateInBounty(selectedBountyId.value);
			showFeedback('Successfully participated!', 'success', result.transaction.hash);
			await Promise.all([loadParticipantBounties(), loadAllBounties()]);
		} catch (error) {
			showFeedback(error.message, 'error');
		} finally {
			isParticipating.value = false;
		}
	};

	const handleFinalize = (bounty) => {
		selectedBountyId.value = bounty.id;
		selectedBountyParticipants.value = bounty.participants;
		showFinalizeModal.value = true;
	};

	const submitFinalize = async (winners) => {
		if (winners.length === 0) {
			alert('Please select at least one winner.');
			return;
		}
		showFinalizeModal.value = false;
		try {
			isFinalizingBounty.value = true;
			const result = await walletStore.finalizeBounty(selectedBountyId.value, winners);
			showFeedback('Bounty finalized successfully!', 'success', result.transaction.hash);
			await Promise.all([loadCreatorBounties(), loadAllBounties()]);
		} catch (error) {
			showFeedback(error.message, 'error');
		} finally {
			isFinalizingBounty.value = false;
		}
	};

	const loadAllBounties = async () => {
		try {
			isLoadingBounties.value = true
			await walletStore.fetchAllBounties()
		} catch (error) {
			showFeedback(error.message, 'error')
		} finally {
			isLoadingBounties.value = false
		}
	}

	const loadCreatorBounties = async () => {
		try {
			isLoadingCreator.value = true
			await walletStore.fetchCreatorBounties(walletStore.account?.accountId)
		} catch (error) {
			showFeedback(error.message, 'error')
		} finally {
			isLoadingCreator.value = false
		}
	}

	const loadParticipantBounties = async () => {
		try {
			isLoadingParticipant.value = true
			await walletStore.fetchParticipantBounties(walletStore.account?.accountId)
		} catch (error) {
			showFeedback(error.message, 'error')
		} finally {
			isLoadingParticipant.value = false
		}
	}

	const onBountyCreated = async () => {
		await Promise.all([loadCreatorBounties(), loadAllBounties()])
	}

	onMounted(async () => {
		if (walletStore.isConnected) {
			await Promise.all([
				loadAllBounties(),
				loadCreatorBounties(),
				loadParticipantBounties(),
				walletStore.fetchInteractions()
			])
		}
	})

	watch(currentTab, async (newTab) => {
		switch (newTab) {
			case 'all':
				await loadAllBounties()
				break
			case 'created':
				await loadCreatorBounties()
				break
			case 'participating':
				await loadParticipantBounties()
				break
		}
	})
</script>

<style scoped>
	/* No custom styles; Bootstrap is used */
</style>
