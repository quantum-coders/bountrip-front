<template>
	<div>
		<!-- Backdrop -->
		<div
			class="offcanvas-backdrop"
			v-if="show"
			@click="$emit('close')"
		></div>
		<!-- Offcanvas -->
		<div
			class="offcanvas"
			:class="{ show: show }"
			tabindex="-1"
			aria-labelledby="notificationSidebarLabel"
		>
			<div class="offcanvas-header">
				<h5 class="offcanvas-title" id="notificationSidebarLabel">
					Notifications
				</h5>
				<button
					type="button"
					class="btn-close text-reset"
					@click="$emit('close')"
					aria-label="Close"
				></button>
			</div>
			<div class="offcanvas-body">
				<div class="list-group">
					<div
						v-for="(notification, index) in notifications"
						:key="index"
						class="list-group-item"
						:class="notification.type === 'success' ? 'list-group-item-success' : 'list-group-item-danger'"
					>
						<div class="d-flex w-100 justify-content-between">
							<p class="mb-1">{{ notification.message }}</p>
							<button
								type="button"
								class="btn-close"
								@click="removeNotification(index)"
								aria-label="Close"
							></button>
						</div>
						<small v-if="notification.transactionLink">
							<a :href="notification.transactionLink" target="_blank" rel="noopener">
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

	const props = defineProps({
		notifications: Array,
		show: {
			type: Boolean,
			default: false,
		},
	});

	const removeNotification = (index) => {
		props.notifications.splice(index, 1);
	};
</script>

<style scoped>
	.offcanvas {
		position: fixed;
		top: 0;
		bottom: 0;
		right: -300px; /* Oculto inicialmente */
		width: 300px;
		background-color: #fff;
		overflow-y: auto;
		transition: right 0.3s ease-in-out;
		z-index: 1050;
	}

	.offcanvas.show {
		right: 0; /* Visible cuando show es true */
	}

	.offcanvas-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1040;
	}
</style>
