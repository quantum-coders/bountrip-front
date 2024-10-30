// store/walletStore.js
import { defineStore } from 'pinia';
import { keyStores, utils, transactions, WalletConnection, Near } from 'near-api-js';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupModal } from '@near-wallet-selector/modal-ui';

export const useWalletStore = defineStore('wallet', () => {
	const config = useRuntimeConfig();
	const baseURL = config.public.apiURL;

	// Estado original del wallet
	const selector = ref(null);
	const modal = ref(null);
	const wallet = ref(null);
	const account = ref(null);
	const isConnected = ref(false);
	const interactionsData = ref([]);
	const accountBalance = ref(0.0);
	// Nuevo estado para bounties
	const bounties = ref([]);
	const currentBounty = ref(null);
	const creatorBounties = ref([]);
	const participantBounties = ref([]);
	const loading = ref(false);
	const error = ref(null);
	const accountId = ref(null);
	// Getters
	const activeBounties = computed(() =>
		bounties.value.filter(bounty => bounty.isActive),
	);

	onMounted(() => {
		try {
			const data = localStorage.getItem('near_app_wallet_auth_key');
			if(data) {
				const jsonObj = JSON.parse(data);
				accountId.value = jsonObj?.accountId;
			}
		} catch(error) {
			console.error('Error getting accountId from localStorage:', error);
		}
	});

	const connectionConfig = {
		networkId: 'testnet',
		keyStore: new keyStores.BrowserLocalStorageKeyStore(),
		nodeUrl: 'https://rpc.testnet.near.org',
		walletUrl: 'https://wallet.testnet.near.org',
		helperUrl: 'https://helper.testnet.near.org',
		explorerUrl: 'https://explorer.testnet.near.org',
	};
	const near = new Near(connectionConfig);

	const initialize = async () => {
		console.info('[Paso 0] Inicializando...');
		const localStorageAuthData = localStorage.getItem('near_app_wallet_auth_key');
		let showModal = true;
		// Si hay datos de autenticación en localStorage, no mostrar el modal
		if(localStorageAuthData) {
			console.info('[Paso 0.1] Datos de Local Storage encontrados!');
			showModal = false;
		}
		try {
			console.info('[Paso 1] Inicializando Selector de Billetera...');
			selector.value = await setupWalletSelector({
				network: 'testnet',
				fallbackRpcUrls: [ connectionConfig.nodeUrl ],
				modules: [
					setupMyNearWallet(),
				],
			});

			console.info('[Paso 2] Selector de Billetera Inicializado!');

			modal.value = setupModal(selector.value, {
				contractId: 'quantum-coders.testnet',
			});

			console.info('[Paso 3] UI Modal Inicializada!');

			if(showModal) modal.value.show();

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

			const accounts = await currentWallet.getAccounts();
			if(accounts.length > 0) {
				account.value = accounts[0];
				isConnected.value = true;
				wallet.value = await selector.value.wallet();
			}
			await getAccountBalance();
		} catch(error) {
			// loading

			console.error('Falló la inicialización:');
			throw error;
		}
	};

	const connectWallet = async () => {
		try {
			if(!selector.value) await initialize();
			modal.value.show();
		} catch(error) {
			console.error('Falló la conexión de la billetera:', error);
			throw error;
		}
	};

	const disconnectWallet = async () => {
		try {
			if(!selector.value) return;
			const currentWallet = await selector.value.wallet();
			if(currentWallet) {
				await currentWallet.signOut();
				account.value = null;
				isConnected.value = false;
				wallet.value = null;
			}
		} catch(error) {
			console.error('Falló la desconexión de la billetera:', error);
			throw error;
		}
	};

	// Funciones de bounties
	const fetchAllBounties = async () => {
		try {
			loading.value = true;
			const response = await $fetch(`${ baseURL }/bounties`);
			bounties.value = response.data;
		} catch(error) {
			console.error('Error fetching bounties:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const fetchBounty = async (bountyId) => {
		try {
			loading.value = true;
			const response = await $fetch(`${ baseURL }/bounties/${ bountyId }`);
			currentBounty.value = response.data;
			return response.data;
		} catch(error) {
			console.error('Error fetching bounty:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const fetchCreatorBounties = async (creatorId) => {
		try {
			loading.value = true;
			const response = await $fetch(`${ baseURL }/bounties/creator/${ creatorId }`);
			creatorBounties.value = response.data;
			return response.data;
		} catch(error) {
			console.error('Error fetching creator bounties:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const fetchParticipantBounties = async (participantId) => {
		try {
			loading.value = true;
			const response = await $fetch(`${ baseURL }/bounties/participant/${ participantId }`);
			participantBounties.value = response.data;
			return response.data;
		} catch(error) {
			console.error('Error fetching participant bounties:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const upsertBounty = async (bountyData) => {
		try {

			const payload = {
				idNear: accountId.value,
				slug: bountyData.slug,
				title: bountyData.title || '',
				content: bountyData.content || '',
				status: bountyData.status || 'Active',
				type: bountyData.type || 'Bounty',
				metas: bountyData.metas || {},
				idBounty: bountyData.idBounty || null,
				idOnChain: bountyData.idOnChain || null,
			};

			console.log('------_>upsertBounty payload:', payload);
			const res = await $fetch(`${ baseURL }/bounties/store`, {
				method: 'POST',
				body: payload,
			});

			return res.data;

		} catch(error) {
			console.error('Error upserting bounty:', JSON.stringify(error, null, 2));
			throw error;
		}
	};
	const createBounty = async (bountyData) => {
		try {
			if(!isConnected.value) {
				throw new Error('Wallet not connected');
			}
			let createdBounty = null;
			loading.value = true;

			const response = await $fetch(`${ baseURL }/bounties`, {
				method: 'POST',
				body: {
					sender: accountId.value,
					receiver: config.public.idContract,
					prizes: bountyData.prizes,
				},
			});

			const transaction = response.data;
			console.log('CreateBounty Transaction object: ', transaction);

			// Usar las acciones directamente
			const transactionResult = await wallet.value.signAndSendTransaction({
					receiverId: transaction.receiverId,
					actions: transaction.actions,
				},
			);
			console.info('createBounty transactionResult: ', transactionResult);
			const logMessage = transactionResult.receipts_outcome[0].outcome.logs.find(log => log.includes('Bounty'));
			const bountyIdMatch = logMessage.match(/Bounty (\d+) created/);
			const bountyId = bountyIdMatch ? bountyIdMatch[1] : null;
			return { transactionResult, bountyId };
		} catch(error) {
			console.error('Error creating bounty:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const participateInBounty = async (bountyId) => {
		try {
			if(!isConnected.value) {
				throw new Error('Wallet not connected');
			}

			loading.value = true;

			const response = await $fetch(`${ baseURL }/bounties/${ bountyId }/participate`, {
				method: 'POST',
				body: {
					sender: accountId.value,
					receiver: config.public.idContract,
					bountyId: parseInt(bountyId),
				},
			});

			console.info('participateInBounty response: ', response);
			const transaction = response.data;

			// Use the actions directly
			const transactionResult = await wallet.value.signAndSendTransaction({
				receiverId: transaction.receiverId,
				actions: transaction.actions,
			});

			return transactionResult;
		} catch(error) {
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
			const response = await $fetch(`${ baseURL }/bounties/interactions`, {
				method: 'GET',
				params: {
					accountId: accountId.value,
					contractId: 'quantum-coders.testnet',
				},
			});

			const interactions = response.data;

			interactionsData.value = interactions;
			// Puedes almacenar las interacciones en una variable de estado si lo deseas
			// interactionsData.value = interactions;

			return interactions;
		} catch(error) {
			console.error('Error al obtener las interacciones:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const finalizeBounty = async (bountyId, winners) => {
		try {
			if(!isConnected.value) {
				throw new Error('Wallet not connected');
			}

			loading.value = true;

			const response = await $fetch(`${ baseURL }/bounties/${ bountyId }/finalize`, {
				method: 'POST',
				body: {
					sender: accountId.value,
					receiver: config.public.idContract,
					bountyId: parseInt(bountyId),
					winners,
				},
			});

			const transaction = response.data;

			const transactionResult = await wallet.value.signAndSendTransaction({
				receiverId: transaction.receiverId,
				actions: transaction.actions,
			});

			return transactionResult;
		} catch(error) {
			console.error('Error finalizing bounty:', error);
			throw error;
		} finally {
			loading.value = false;
		}
	};

	const getAccountBalance = async () => {
		try {
			if(!account.value) {
				throw new Error('No hay una cuenta conectada.');
			}

			// Crear una instancia de Account
			const connectedAccount = await near.account(accountId.value);

			// Obtener el balance
			const balance = await connectedAccount.getAccountBalance();

			// Almacenar el balance en el estado
			const rawAvailableBalance = balance.available;
			const convertedBalance = utils.format.formatNearAmount(rawAvailableBalance, 2);
			accountBalance.value = convertedBalance;

			console.log('Balance de la cuenta:', balance);

			return balance;
		} catch(error) {
			console.error('Error al obtener el balance de la cuenta:', error);
			throw error;
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
		accountBalance,
		getAccountBalance,
		creatorBounties,
		participantBounties,
		loading,
		error,
		activeBounties,
		// Funciones del wallet
		initialize,
		accountId,
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
		upsertBounty,
	};
});
