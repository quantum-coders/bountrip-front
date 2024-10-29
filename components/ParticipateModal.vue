<template>
	<div class="modal fade show d-block" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<!-- Modal content -->
				<div class="modal-header">
					<h5 class="modal-title">Confirm Participation</h5>
					<button type="button" class="btn-close" @click="$emit('close')"></button>
				</div>
				<div class="modal-body">
					Do you want to participate in this bounty?
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" @click="$emit('close')">
						Cancel
					</button>
					<button type="button" class="btn btn-primary" @click="$emit('confirm')">
						Participate
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	/* No additional logic needed */
</script>

<style scoped>
	.modal {
		background: rgba(0, 0, 0, 0.5);
	}

	.modal-dialog {
		max-width: 500px;
		margin: 1.75rem auto;
	}

	.modal.fade.show {
		display: block;
	}
</style>
