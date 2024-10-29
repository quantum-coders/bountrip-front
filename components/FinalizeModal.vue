<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <!-- Modal content -->
        <div class="modal-header">
          <h5 class="modal-title">Finalize Bounty</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <p>Select winners from the participants:</p>
          <div v-if="participants.length">
            <div
              class="form-check"
              v-for="participant in participants"
              :key="participant"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :value="participant"
                v-model="selectedWinners"
              />
              <label class="form-check-label">{{ participant }}</label>
            </div>
          </div>
          <p v-else>No participants available.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Cancel
          </button>
          <button type="button" class="btn btn-primary" @click="submit">
            Finalize
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  participants: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['submit', 'close']);

const selectedWinners = ref([]);

const submit = () => {
  emit('submit', selectedWinners.value);
};
</script>

<style scoped>
/* Same styles as ParticipateModal.vue */
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
