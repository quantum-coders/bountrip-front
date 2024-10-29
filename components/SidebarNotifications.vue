<template>
	<div v-if="show">
		<!-- Backdrop -->
		<div
			class="modal-backdrop fade show"
			@click="closeSidebar"
		></div>

		<!-- Offcanvas Sidebar -->
		<div
			class="offcanvas offcanvas-end show"
			tabindex="-1"
			aria-labelledby="interactionsSidebarLabel"
			style="visibility: visible; width: 350px;"
		>
			<div class="offcanvas-header">
				<h5 class="offcanvas-title" id="interactionsSidebarLabel">
					Transaction History
				</h5>
				<button
					type="button"
					class="btn-close text-reset"
					@click="closeSidebar"
					aria-label="Close"
				></button>
			</div>
			<div class="offcanvas-body">
				<div class="list-group">
					<div
						v-for="(interaction, index) in interactions"
						:key="index"
						class="list-group-item list-group-item-action"
					>
						<div class="d-flex w-100 justify-content-between">
							<h6 class="mb-1">{{ getActionTitle(interaction) }}</h6>
							<small class="text-muted">{{ formatTimestamp(interaction.block_timestamp) }}</small>
						</div>
						<p class="mb-1">{{ getActionDescription(interaction) }}</p>
						<small>
							<a
								:href="`https://explorer.${networkId}.near.org/transactions/${interaction.transaction_hash}`"
								target="_blank"
								rel="noopener"
							>
								Ver transacción
							</a>
						</small>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>

	// Props para controlar la visibilidad del sidebar
	const props = defineProps({
		show: {
			type: Boolean,
			default: false,
		},
	});

	// Emitimos eventos al componente padre
	const emit = defineEmits(['close']);

	// Función para cerrar el sidebar
	const closeSidebar = () => {
		emit('close');
	};

	// Accedemos al store
	const walletStore = useWalletStore();

	// Accedemos a interactionsData desde el store
	const interactions = computed(() => walletStore.interactionsData);

	// Obtenemos el networkId (por ejemplo, 'testnet' o 'mainnet')
	const networkId = process.env.NETWORK_ID || 'testnet';

	// Función para formatear la marca de tiempo
	const formatTimestamp = (timestamp) => {
		const date = new Date(parseInt(timestamp) / 1e6); // Convertir nanosegundos a milisegundos
		return date.toLocaleString();
	};

	// Función para obtener el título de la acción
	const getActionTitle = (interaction) => {
		if (interaction.actions && interaction.actions.length > 0) {
			const action = interaction.actions[0];
			// Reemplazar guiones bajos y capitalizar
			return action.action.replace(/_/g, ' ').toUpperCase();
		}
		return 'Acción';
	};

	// Función para obtener la descripción de la acción
	const getActionDescription = (interaction) => {
		if (interaction.actions && interaction.actions.length > 0) {
			const action = interaction.actions[0];
			let description = '';
			if (action.method) {
				description += `Método: ${action.method}`;
			}
			if (action.args) {
				description += ` | Args: ${action.args}`;
			}
			return description;
		}
		return '';
	};

	onMounted(() => {
		walletStore.fetchInteractions();
	});
</script>

<style scoped>
	/* No se utiliza CSS personalizado; se confía en las clases de Bootstrap */

	/* Asegúrate de que el offcanvas esté visible y en el lado derecho */
	.offcanvas {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		background-color: #fff;
		overflow-y: auto;
		z-index: 1050;
		outline: 0;
	}

	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1040;
	}

	/* Opcional: Puedes agregar estilos adicionales si es necesario */
</style>
