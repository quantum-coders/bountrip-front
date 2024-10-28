<template>
	<div class="login-button">
		<button @click="handleClick">
			<span v-if="!isConnected">Connect Wallet</span>
			<span v-else>{{ accountId }}</span>
		</button>
	</div>
</template>

<script setup>

	const walletStore = useWalletStore();

	// Initialize the wallet store when the component is mounted
	onMounted(() => {
		walletStore.initialize();
	});

	// Computed properties to reactively track connection status and account ID
	const isConnected = computed(() => walletStore.isConnected);
	const accountId = computed(() => walletStore.account?.accountId || '');

	// Handle button click for connecting or disconnecting the wallet
	const handleClick = () => {
		if(!isConnected.value) {
			walletStore.connectWallet();
		} else {
			walletStore.disconnectWallet();
		}
	};
</script>

<style lang="sass" scoped>
	.login-button
		button
			background: var(--brand2)
			padding: 0.25rem 2.5rem
			border-radius: 0.5rem
			color: white
			font-weight: 600
			font-size: 1rem
			border: none
			cursor: pointer
			transition: background 0.3s, color 0.3s

			&:hover
				background: var(--brand2-hover)
				color: #f0f0f0
</style>
