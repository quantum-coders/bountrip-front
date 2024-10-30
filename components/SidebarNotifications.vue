<template>
	<div class="transaction-sidebar">
		<!-- Header -->
		<div class="d-flex justify-content-between align-items-center mb-4">
			<h5 class="fw-bold m-0">Transaction History</h5>
			<span class="badge bg-primary rounded-pill">{{ interactions.length }}</span>
		</div>

		<!-- Transaction List with Custom Scroll -->
		<div class="transaction-list custom-scrollbar flex-grow-1">
			<div
				v-for="(interaction, index) in interactions"
				:key="index"
				class="transaction-item bg-light rounded p-3 mb-3 hover-shadow transition w-100"
			>
				<!-- Transaction Header -->
				<div class="d-flex justify-content-between align-items-start">
					<h6 class="fw-semibold text-primary mb-0">
						{{ getActionTitle(interaction) }}
					</h6>
				</div>
				<div class="d-flex justify-content-between align-items-start mb-2">
					<span class="text-muted small">
						{{ formatTimestamp(interaction.block_timestamp) }}
					</span>
				</div>

				<!-- Transaction Description -->
				<p class="text-secondary mb-2 small">
					{{ getActionDescription(interaction) }}
				</p>

				<!-- Transaction Details -->
				<div v-if="getActionDetails(interaction)" class="bg-white rounded p-2 mb-2 small">
					<pre class="m-0">{{ getActionDetails(interaction) }}</pre>
				</div>

				<!-- Transaction Link -->
				<a
					:href="`https://explorer.${networkId}.near.org/transactions/${interaction.transaction_hash}`"
					class="btn btn-outline-primary btn-sm text-decoration-none"
					target="_blank"
					rel="noopener"
				>
					Transaction
					<i class="bi bi-box-arrow-up-right ms-1"></i>
				</a>
			</div>
		</div>
	</div>
</template>

<script setup>
	const emit = defineEmits([ 'close' ]);
	const walletStore = useWalletStore();
	const interactions = computed(() => walletStore.interactionsData);
	const networkId = process.env.NETWORK_ID || 'testnet';

	// Format timestamp to relative time
	const formatTimestamp = (timestamp) => {
		const milliseconds = Number(BigInt(timestamp) / 1000000n);
		const date = new Date(milliseconds);
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		const formattedDate = date.toLocaleDateString(undefined, options);
		const formattedTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
		return `${ formattedDate } ${ formattedTime }`;
	};
	// Get human-readable title for the action
	const getActionTitle = (interaction) => {
		if(!interaction.actions?.[0]) return 'Transaction';

		const action = interaction.actions[0];
		const method = action.method;

		const titles = {
			create_bounty: 'Created New Bounty',
			participate: 'Participated in Bounty',
			finalize_bounty: 'Finalized Bounty',
			get_bounty: 'Viewed Bounty',
			get_all_bounties: 'Viewed All Bounties',
			get_participant_bounties: 'Viewed Participant Bounties',
			get_creator_bounties: 'Viewed Creator Bounties',
		};

		return titles[method] || 'Contract Interaction';
	};

	// Get human-readable description for the action
	const getActionDescription = (interaction) => {
		if(!interaction.actions?.[0]) return '';

		const action = interaction.actions[0];
		const method = action.method;
		const args = action.args ? JSON.parse(action.args) : {};

		switch(method) {
			case 'create_bounty':
				const totalPrize = args.prizes?.reduce((sum, prize) => sum + BigInt(prize), BigInt(0));
				return `Created a new bounty with ${ args.prizes?.length || 0 } prizes totaling ${ formatNearAmount(totalPrize) } NEAR`;

			case 'participate':
				return `Joined bounty #${ args.bountyId }`;

			case 'finalize_bounty':
				return `Finalized bounty #${ args.bountyId } with ${ args.winners?.length || 0 } winners`;

			case 'get_bounty':
				return `Viewed details for bounty #${ args.bountyId }`;

			case 'get_participant_bounties':
				return `Viewed bounties for participant: ${ args.participantId }`;

			case 'get_creator_bounties':
				return `Viewed bounties created by: ${ args.creatorId }`;

			default:
				return `Interacted with contract method: ${ method }`;
		}
	};

	// Get detailed information about the transaction
	const getActionDetails = (interaction) => {
		if(!interaction.actions?.[0]) return null;

		const action = interaction.actions[0];
		const args = action.args ? JSON.parse(action.args) : {};

		switch(action.method) {
			case 'create_bounty':
				return args.prizes?.map((prize, index) =>
					`Prize ${ index + 1 }: ${ formatNearAmount(prize) } NEAR`,
				).join('\n');

			case 'finalize_bounty':
				return args.winners?.map((winner, index) =>
					`Winner ${ index + 1 }: ${ winner }`,
				).join('\n');

			default:
				return null;
		}
	};

	// Helper function to format NEAR amounts
	const formatNearAmount = (amount) => {
		try {
			return (BigInt(amount) / BigInt(1e24)).toString();
		} catch {
			return '0';
		}
	};

	onMounted(() => {
		walletStore.fetchInteractions();
	});
</script>

<style lang="sass" scoped>
	.transaction-sidebar
		padding: 1rem
		height: calc(100dvh - 100px)
		overflow-y: auto
		position: sticky
		top: 0

</style>
