<!-- components/BaseModal.vue -->
<template>
  <div v-if="show" class="modal fade show" style="display: block;" aria-modal="true" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button class="btn btn-secondary" @click="$emit('close')">Close</button>
            <button class="btn btn-primary" @click="$emit('save')">Save changes</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean, title: String });
defineEmits(['close', 'save']);
</script>
