<template>
	<div class="login">
		<button class="login-button" v-if="!isConnected" @click="handleClick">
			<platform-loading :active="loading" :width="20" />
			<span>Connect Wallet</span>
		</button>
		<div class="user-menu" v-else>
			<span class="login-button">
				<platform-loading :active="loading" :width="20" />
				{{ accountId }}
			</span>
			<nav class="user-nav" v-if="!loading">
				<div class="balance">
					<span class="icon">
						<icon name="simple-icons:near" />
					</span>
					{{ accountBalance }} NEAR
				</div>
				<ul>
					<li><nuxt-link to="/dashboard">User Dashboard</nuxt-link></li>
					<li><a href="#" @click.prevent="handleClick">Logout</a></li>
				</ul>
			</nav>
		</div>
	</div>
</template>

<script setup>

	const loading = ref(false);
	const walletStore = useWalletStore();

	// Initialize the wallet store when the component is mounted
	onMounted(async () => {
		try {
			loading.value = true;
			await walletStore.initialize();
			console.log('walletStore.isConnected', walletStore.isConnected);

			const connectRes = await useBaseFetch('/users/connect', {
				method: 'POST',
				body: JSON.stringify({
					idNear: walletStore.account?.accountId,
				}),
			});
			console.info("Connect respondes", connectRes.data.value.data);
			useWalletStore().setAccountId();
			loading.value = false;
		}catch (e) {
			console.error('Error initializing wallet', e);
			loading.value = false;
		}
	});

	// Computed properties to reactively track connection status and account ID
	const isConnected = computed(() => walletStore.isConnected);
	const accountId = computed(() => walletStore.account?.accountId || '');
	const accountBalance = computed(() => walletStore.accountBalance || '');

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
		background: var(--brand2)
		padding: 0.25rem 2.5rem
		border-radius: 0.5rem
		color: white
		font-weight: 600
		font-size: 1rem
		border: none
		cursor: pointer
		transition: background 0.3s, color 0.3s
		display: flex
		align-items: center
		justify-content: center
		z-index: 1
		overflow: hidden

		&:hover
			background: var(--brand1)
			color: #f0f0f0

	.user-menu
		&:hover
			.user-nav
				display: block

		.balance
			padding: 0 1rem 0.5rem
			display: flex
			align-items: center
			color: var(--bs-body-color)
			gap: 0.5rem
			border-bottom: 1px solid var(--bs-border-color)

			.icon
				background: var(--brand2)
				color: white
				width: 1.2em
				height: 1.2em
				border-radius: 50%
				display: flex
				align-items: center
				justify-content: center

				.iconify
					font-size: 0.6em
					top: 0.015em

		.user-nav
			position: absolute
			z-index: 0
			width: calc(100% + 1rem)
			left: -0.5rem
			top: -0.5rem
			padding-top: 50px
			border-radius: 0.5rem
			display: none
			background: white
			overflow: hidden

			ul
				width: 100%
				list-style-type: none
				padding: 0
				margin: 0

				li
					a
						display: block
						padding: 0.5rem 1rem
						color: black
						text-decoration: none
						transition: background 0.3s, color 0.3s

						&:hover
							background: var(--brand1)
							color: white
</style>
