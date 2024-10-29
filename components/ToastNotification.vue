<template>
  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050">
    <div class="toast show" :class="typeClass">
      <div class="toast-header">
        <strong class="me-auto">{{ headerText }}</strong>
        <button type="button" class="btn-close" @click="$emit('close')"></button>
      </div>
      <div class="toast-body">
        <span v-if="transactionLink">
          Transaction:
          <a :href="transactionLink" target="_blank">{{ transactionHash }}</a>
        </span>
        <span v-else>{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'success',
  },
  transactionLink: {
    type: String,
    default: '',
  },
  transactionHash: {
    type: String,
    default: '',
  },
})

const typeClass = computed(() =>
  props.type === 'success' ? 'text-bg-success' : 'text-bg-danger'
)

const headerText = computed(() =>
  props.type === 'success' ? 'Success' : 'Error'
)
</script>

<style scoped></style>
