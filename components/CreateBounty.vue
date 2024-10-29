<template>
  <div class="col-12">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title mb-4">Create New Bounty</h3>
        <form @submit.prevent="handleCreateBounty">
          <div class="mb-3">
            <label class="form-label">Prizes (NEAR)</label>
            <div
              v-for="(prize, index) in bountyData.prizes"
              :key="index"
              class="input-group mb-2"
            >
              <input
                v-model="bountyData.prizes[index]"
                type="text"
                class="form-control"
                placeholder="Amount in NEAR (e.g., 1.5)"
                required
              />
              <button
                type="button"
                @click="removePrize(index)"
                class="btn btn-danger"
                :disabled="bountyData.prizes.length <= 1"
              >
                -
              </button>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button type="button" @click="addPrize" class="btn btn-secondary">
              Add Prize
            </button>
            <button type="submit" class="btn btn-success" :disabled="isLoading">
              {{ isLoading ? 'Creating...' : 'Create Bounty' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['bountyCreated'])
const walletStore = useWalletStore()
const bountyData = ref({ prizes: [''] })
const isLoading = ref(false)

const addPrize = () => bountyData.value.prizes.push('')
const removePrize = (index) => {
  if (bountyData.value.prizes.length > 1) {
    bountyData.value.prizes.splice(index, 1)
  }
}

const handleCreateBounty = async () => {
  try {
    isLoading.value = true
    const prizes = bountyData.value.prizes.map((prize) => prize.trim())
    if (prizes.some((prize) => isNaN(parseFloat(prize)))) {
      throw new Error('All prizes must be valid numbers')
    }
    const result = await walletStore.createBounty({ prizes })
    alert('Bounty created successfully!')
    bountyData.value.prizes = ['']
    emit('bountyCreated')
  } catch (error) {
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
