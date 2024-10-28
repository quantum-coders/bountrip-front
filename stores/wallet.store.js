import { defineStore } from 'pinia';
import { keyStores } from 'near-api-js';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import { setupNearFi } from '@near-wallet-selector/nearfi';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupMathWallet } from '@near-wallet-selector/math-wallet';
import { setupNightlyConnect } from '@near-wallet-selector/nightly-connect';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupLedger } from '@near-wallet-selector/ledger';
import { setupWalletConnect } from '@near-wallet-selector/wallet-connect';
import { setupDefaultWallets } from '@near-wallet-selector/default-wallets';
import { setupCoin98Wallet } from '@near-wallet-selector/coin98-wallet';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { JsonRpcProvider } from '@near-js/providers';

export const useWalletStore = defineStore('wallet', () => {
	const config = useRuntimeConfig();
	const baseURL = config.public.baseURL;

	const selector = ref(null);
	const modal = ref(null);
	const wallet = ref(null);
	const account = ref(null);
	const isConnected = ref(false);

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
		if(selector.value) return;

		try {
			console.info('[Paso 1] Inicializando Selector de Billetera...');

			const provider = new JsonRpcProvider({ url: connectionConfig.nodeUrl });

			selector.value = await setupWalletSelector({
				network: 'testnet',
				fallbackRpcUrls: [ connectionConfig.nodeUrl ],
				modules: [
					//setupNearWallet(),
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

			modal.value.show();

			console.info('[Paso 3] UI Modal Inicializada!');

			selector.value.on('accountChanged', (newAccount) => {
				account.value = newAccount;
				isConnected.value = !!newAccount;
			});

			console.info('[Paso 4] Listener de Cuenta Inicializado!');

			selector.value.on('walletChanged', (newWallet) => {
				wallet.value = newWallet;
			});

			const wallet = await selector.value.wallet();

			console.log('selector', await wallet.getAccounts());

			const accounts = await selector.value.getAccounts();
			if(accounts.length > 0) {
				account.value = accounts[0];
				isConnected.value = true;
				wallet.value = await selector.value.wallet();
			}

		} catch(error) {
			console.error('Falló la inicialización:', error);
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

	const signIn = async () => {
		try {
			if(!selector.value) await initialize();
			wallet.value = await selector.value.wallet();
			const accounts = await wallet.value.signIn({
				contractId: 'quantum-coders.testnet',
				methodNames: [],
			});
			account.value = accounts[0];
			isConnected.value = true;
		} catch(error) {
			console.error('Falló el inicio de sesión:', error);
			throw error;
		}
	};

	const signOut = async () => {
		try {
			await disconnectWallet();
		} catch(error) {
			console.error('Falló el cierre de sesión:', error);
			throw error;
		}
	};

	const fetchData = async (endpoint, options = {}) => {
		try {
			const response = await fetch(`${ baseURL }${ endpoint }`, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					...options.headers,
				},
			});

			if(!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Falló la obtención de datos');
			}

			return await response.json();
		} catch(error) {
			console.error(`Error de fetch en ${ endpoint }:`, error);
			throw error;
		}
	};

	const createBounty = async (bountyData) => {
		try {
			return await fetchData('/bounties', {
				method: 'POST',
				body: JSON.stringify(bountyData),
			});
		} catch(error) {
			throw error;
		}
	};

	return {
		selector,
		modal,
		wallet,
		account,
		isConnected,
		initialize,
		connectWallet,
		disconnectWallet,
		signIn,
		signOut,
		fetchData,
		createBounty,
	};
});
