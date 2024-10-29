// store/walletStore.js
import {defineStore} from 'pinia';
import {keyStores, utils, transactions, WalletConnection} from 'near-api-js';
import {setupWalletSelector} from '@near-wallet-selector/core';
import {setupMyNearWallet} from '@near-wallet-selector/my-near-wallet';
import {setupSender} from '@near-wallet-selector/sender';
import {setupNearFi} from '@near-wallet-selector/nearfi';
import {setupHereWallet} from '@near-wallet-selector/here-wallet';
import {setupMathWallet} from '@near-wallet-selector/math-wallet';
import {setupNightlyConnect} from '@near-wallet-selector/nightly-connect';
import {setupMeteorWallet} from '@near-wallet-selector/meteor-wallet';
import {setupLedger} from '@near-wallet-selector/ledger';
import {setupCoin98Wallet} from '@near-wallet-selector/coin98-wallet';
import {setupModal} from '@near-wallet-selector/modal-ui';

export const useWalletStore = defineStore('wallet', () => {
	const config = useRuntimeConfig();
	const baseURL = config.public.baseURL;

	// Estado original del wallet
	const selector = ref(null);
	const modal = ref(null);
	const wallet = ref(null);
	const account = ref(null);
	const isConnected = ref(false);
	const interactionsData = ref([]);

	// Nuevo estado para bounties
	const bounties = ref([]);
	const currentBounty = ref(null);
	const creatorBounties = ref([]);
	const participantBounties = ref([]);
	const loading = ref(false);
	const error = ref(null);

	// Getters
	const activeBounties = computed(() =>
		bounties.value.filter(bounty => bounty.isActive)
	);

	const connectionConfig = {
		networkId: 'testnet',
		keyStore: new keyStores.BrowserLocalStorageKeyStore(),
		nodeUrl: 'https://rpc.testnet.near.org',
		walletUrl: 'https://wallet.testnet.near.org',
		helperUrl: 'https://helper.testnet.near.org',
		explorerUrl: 'https://explorer.testnet.near.org',
	};

	const nightlyConnect = setupNightlyConnect({
		appMetadata: {
			application: 'NEAR Wallet Selector',
			description: 'Bountrip',
			additionalInfo: 'Get ready to participate in bounties!',
			icon: 'https://s3.coinmarketcap.com/static-gravity/image/ef3ad80e423a4449ab8e961b0d1edea4.png',
		},
	});

	const initialize = async () => {
		console.info('[Paso 0] Inicializando...');
		const localStorageAuthData = localStorage.getItem('near_app_wallet_auth_key');
		let showModal = true;
		// Si hay datos de autenticación en localStorage, no mostrar el modal
		if (localStorageAuthData) {
			console.info('[Paso 0.1] Datos de Local Storage encontrados!');
			showModal = false;
		}
		try {
			console.info('[Paso 1] Inicializando Selector de Billetera...');
			selector.value = await setupWalletSelector({
				network: 'testnet',
				fallbackRpcUrls: [connectionConfig.nodeUrl],
				modules: [
					setupMyNearWallet(),
					setupSender(),
					setupNearFi(),
					setupHereWallet(),
					setupMathWallet(),
					nightlyConnect,
					setupMeteorWallet(),
					setupLedger(),
					setupCoin98Wallet(),
				],
			});

			console.info('[Paso 2] Selector de Billetera Inicializado!');

			modal.value = setupModal(selector.value, {
				contractId: 'quantum-coders.testnet',
			});

			console.info('[Paso 3] UI Modal Inicializada!');

			if (showModal) modal.value.show();

			// Escuchar cambios en la cuenta
			selector.value.on('accountChanged', (newAccount) => {
				account.value = newAccount;
				isConnected.value = !!newAccount;
			});

			console.info('[Paso 4] Listener de Cuenta Inicializado!');

			// Escuchar cambios en la wallet
			selector.value.on('walletChanged', (newWallet) => {
				wallet.value = newWallet;
			});

			const currentWallet = await selector.value.wallet();

			console.log('selector', await currentWallet.getAccounts());

			const accounts = await currentWallet.getAccounts();
			if (accounts.length > 0) {
				account.value = accounts[0];
				isConnected.value = true;
				wallet.value = await selector.value.wallet();
			}
		} catch (error) {
			console.error('Falló la inicialización:', error);
			throw error;
		}
	};

	const connectWallet = async () => {
		try {
			if (!selector.value) await initialize();
			modal.value.show();
		} catch (error) {
			console.error('Falló la conexión de la billetera:', error);
			throw error;
		}
	};

	const disconnectWallet = async () => {
		try {
			if (!selector.value) return;
			const currentWallet = await selector.value.wallet();
			if (currentWallet) {
				await currentWallet.signOut();
				account.value = null;
				isConnected.value = false;
				wallet.value = null;
			}
		} catch (error) {
			console.error('Falló la desconexión de la billetera:', error);
			throw error;
		}
	};

// Funciones de bounties
	const fetchAllBounties = async () => {
		try {
			loading.value = true;
			const response = await $fetch(`${baseURL}/bounties`);
			bounties.value = response.data;
		} catch (error) {
			console.error('Error fetching bounties:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const fetchBounty = async (bountyId) => {
		try {
			loading.value = true;
			const response = await $fetch(`${baseURL}/bounties/${bountyId}`);
			currentBounty.value = response.data;
			return response.data;
		} catch (error) {
			console.error('Error fetching bounty:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const fetchCreatorBounties = async (creatorId) => {
		try {
			loading.value = true;
			const response = await $fetch(`${baseURL}/bounties/creator/${creatorId}`);
			creatorBounties.value = response.data;
			return response.data;
		} catch (error) {
			console.error('Error fetching creator bounties:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const fetchParticipantBounties = async (participantId) => {
		try {
			loading.value = true;
			const response = await $fetch(`${baseURL}/bounties/participant/${participantId}`);
			participantBounties.value = response.data;
			return response.data;
		} catch (error) {
			console.error('Error fetching participant bounties:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const createBounty = async (bountyData) => {
		try {
			if (!isConnected.value) {
				throw new Error('Wallet not connected');
			}

			loading.value = true;

			const response = await $fetch(`${baseURL}/bounties`, {
				method: 'POST',
				body: {
					sender: account.value.accountId,
					receiver: config.public.idContract,
					prizes: bountyData.prizes,
				},
			});

			const transaction = response.data;
			console.log("CreateBounty Transaction object: ", transaction);

			// Usar las acciones directamente
			const transactionResult = await wallet.value.signAndSendTransaction({
				receiverId: transaction.receiverId,
				actions: transaction.actions,
			});

			return transactionResult;
		} catch (error) {
			console.error('Error creating bounty:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};


	const participateInBounty = async (bountyId) => {
		try {
			if (!isConnected.value) {
				throw new Error('Wallet not connected');
			}

			loading.value = true;

			const response = await $fetch(`${baseURL}/bounties/${bountyId}/participate`, {
				method: 'POST',
				body: {
					sender: account.value.accountId,
					receiver: config.public.idContract,
					bountyId: parseInt(bountyId)
				}
			});

			console.info("participateInBounty response: ", response);
			const transaction = response.data;

			// Use the actions directly
			const transactionResult = await wallet.value.signAndSendTransaction({
				receiverId: transaction.receiverId,
				actions: transaction.actions
			});

			return transactionResult;
		} catch (error) {
			console.error('Error participating in bounty:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const fetchInteractions = async () => {
		try {
			loading.value = true;

			// Llamada al endpoint de tu backend para obtener las interacciones
			const response = await $fetch(`${baseURL}/bounties/interactions`, {
				method: 'GET',
				params: {
					accountId: account.value?.accountId,
					contractId: 'quantum-coders.testnet',
				},
			});

			const interactions = response.data;

			interactionsData.value = interactions;
			// Puedes almacenar las interacciones en una variable de estado si lo deseas
			// interactionsData.value = interactions;

			return interactions;
		} catch (error) {
			console.error('Error al obtener las interacciones:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};


	const finalizeBounty = async (bountyId, winners) => {
		try {
			if (!isConnected.value) {
				throw new Error('Wallet not connected');
			}

			loading.value = true;

			const response = await $fetch(`${baseURL}/bounties/${bountyId}/finalize`, {
				method: 'POST',
				body: {
					sender: account.value.accountId,
					receiver: config.public.idContract,
					bountyId: parseInt(bountyId),
					winners
				}
			});

			const transaction = response.data;

			const transactionResult = await wallet.value.signAndSendTransaction({
				receiverId: transaction.receiverId,
				actions: transaction.actions
			});

			return transactionResult;
		} catch (error) {
			console.error('Error finalizing bounty:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	return {
		// Estado del wallet
		selector,
		modal,
		wallet,
		account,
		isConnected,
		interactionsData,
		// Estado de bounties
		bounties,
		currentBounty,
		creatorBounties,
		participantBounties,
		loading,
		error,
		activeBounties,

		// Funciones del wallet
		initialize,
		connectWallet,
		disconnectWallet,

		// Funciones de bounties
		fetchAllBounties,
		fetchBounty,
		fetchCreatorBounties,
		fetchParticipantBounties,
		createBounty,
		participateInBounty,
		finalizeBounty,
		fetchInteractions,
	};
});
