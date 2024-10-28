<template>
  <div class="container py-5">
    <!-- Wallet Component -->
    <Wallet />

    <!-- Main Bounty Management Content -->
    <div v-if="walletStore.isConnected" class="row g-4">
      <!-- Create Bounty Section -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title mb-4">Create New Bounty</h3>
            <form @submit.prevent="handleCreateBounty">
              <div class="mb-3">
                <label class="form-label">Prizes (NEAR)</label>
                <div v-for="(prize, index) in bountyData.prizes" :key="index" class="input-group mb-2">
                  <input
                    v-model="bountyData.prizes[index]"
                    type="text"
                    class="form-control"
                    placeholder="Amount in NEAR (e.g. 1.5)"
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
                <button type="button" @click="addPrize" class="btn btn-secondary">Add Prize</button>
                <button type="submit" class="btn btn-success" :disabled="isLoading">
                  {{ isLoading ? 'Creating...' : 'Create Bounty' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">
              <li class="nav-item" v-for="tab in tabs" :key="tab.id">
                <button
                  class="nav-link"
                  :class="{ active: currentTab === tab.id }"
                  @click="currentTab = tab.id"
                >
                  {{ tab.name }}
                </button>
              </li>
            </ul>
          </div>

          <div class="card-body">
            <!-- All Bounties Tab -->
            <div v-if="currentTab === 'all'" class="tab-content">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="mb-0">Available Bounties</h4>
                <button @click="loadAllBounties" class="btn btn-primary" :disabled="isLoadingBounties">
                  {{ isLoadingBounties ? 'Loading...' : 'Refresh' }}
                </button>
              </div>

              <div v-if="walletStore.bounties.length" class="list-group">
                <div v-for="bounty in walletStore.bounties" :key="bounty.id" class="list-group-item list-group-item-action">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 class="mb-1">Bounty #{{ bounty.id }}</h5>
                      <p class="mb-1">Creator: {{ bounty.creator }}</p>
                      <p class="mb-1">Total Prize: {{ bounty.totalPrize }} NEAR</p>
                      <p class="mb-1">Participants: {{ bounty.participants?.length || 0 }}</p>
                      <span class="badge" :class="bounty.isActive ? 'bg-success' : 'bg-secondary'">
                        {{ bounty.isActive ? 'Active' : 'Finished' }}
                      </span>
                    </div>

                    <button
                      v-if="bounty.isActive && canParticipate(bounty)"
                      @click="handleParticipate(bounty.id)"
                      class="btn btn-warning"
                      :disabled="isParticipating"
                    >
                      {{ isParticipating ? 'Processing...' : 'Participate' }}
                    </button>
                  </div>
                </div>
              </div>
              <p v-else class="text-center text-muted py-4">No bounties available</p>
            </div>

            <!-- My Created Bounties Tab -->
            <div v-if="currentTab === 'created'" class="tab-content">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="mb-0">My Created Bounties</h4>
                <button @click="loadCreatorBounties" class="btn btn-primary" :disabled="isLoadingCreator">
                  {{ isLoadingCreator ? 'Loading...' : 'Refresh' }}
                </button>
              </div>

              <div v-if="walletStore.creatorBounties.length" class="list-group">
                <div v-for="bounty in walletStore.creatorBounties" :key="bounty.id" class="list-group-item">
                  <h5 class="mb-1">Bounty #{{ bounty.id }}</h5>
                  <p class="mb-1">Total Prize: {{ bounty.totalPrize }} NEAR</p>
                  <p class="mb-1">Participants: {{ bounty.participants?.length || 0 }}</p>
                  <span class="badge" :class="bounty.isActive ? 'bg-success' : 'bg-secondary'">
                    {{ bounty.isActive ? 'Active' : 'Finished' }}
                  </span>

                  <button
                    v-if="bounty.isActive && bounty.participants?.length > 0"
                    @click="handleFinalize(bounty.id, bounty.participants)"
                    class="btn btn-purple mt-2"
                    :disabled="isFinalizingBounty"
                  >
                    {{ isFinalizingBounty ? 'Processing...' : 'Finalize Bounty' }}
                  </button>
                </div>
              </div>
              <p v-else class="text-center text-muted py-4">You haven't created any bounties yet</p>
            </div>

            <!-- My Participations Tab -->
            <div v-if="currentTab === 'participating'" class="tab-content">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="mb-0">My Participations</h4>
                <button @click="loadParticipantBounties" class="btn btn-primary" :disabled="isLoadingParticipant">
                  {{ isLoadingParticipant ? 'Loading...' : 'Refresh' }}
                </button>
              </div>

              <div v-if="walletStore.participantBounties.length" class="list-group">
                <div v-for="bounty in walletStore.participantBounties" :key="bounty.id" class="list-group-item">
                  <h5 class="mb-1">Bounty #{{ bounty.id }}</h5>
                  <p class="mb-1">Creator: {{ bounty.creator }}</p>
                  <p class="mb-1">Total Prize: {{ bounty.totalPrize }} NEAR</p>
                  <span class="badge" :class="bounty.isActive ? 'bg-success' : 'bg-secondary'">
                    {{ bounty.isActive ? 'Active' : 'Finished' }}
                  </span>
                </div>
              </div>
              <p v-else class="text-center text-muted py-4">You're not participating in any bounties</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="feedback.message" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050">
      <div class="toast show" :class="feedback.type === 'success' ? 'text-bg-success' : 'text-bg-danger'">
        <div class="toast-header">
          <strong class="me-auto">{{ feedback.type === 'success' ? 'Success' : 'Error' }}</strong>
          <button type="button" class="btn-close" @click="feedback.message = ''"></button>
        </div>
        <div class="toast-body">
          <span v-if="transactionLink">
            Transacción: <a :href="transactionLink" target="_blank">{{ transactionHash }}</a>
          </span>
          <span v-else>
            {{ feedback.message }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const walletStore = useWalletStore()
  const bountyData = ref({ prizes: [''] })
  const feedback = ref({ message: '', type: 'success' })
  const currentTab = ref('all')
  const isLoading = ref(false)
  const isLoadingBounties = ref(false)
  const isLoadingCreator = ref(false)
  const isLoadingParticipant = ref(false)
  const isParticipating = ref(false)
  const isFinalizingBounty = ref(false)
  const transactionHash = ref('')
  const transactionLink = ref('')

  const tabs = [
    { id: 'all', name: 'All Bounties' },
    { id: 'created', name: 'My Created' },
    { id: 'participating', name: 'My Participations' }
  ]

  const addPrize = () => bountyData.value.prizes.push('')
  const removePrize = (index) => bountyData.value.prizes.length > 1 && bountyData.value.prizes.splice(index, 1)

  const showFeedback = (message, type = 'success', hash = '') => {
    feedback.value = { message, type }
    transactionHash.value = hash
    transactionLink.value = hash ? `https://explorer.testnet.near.org/transactions/${hash}` : ''
    setTimeout(() => { feedback.value.message = ''; transactionLink.value = '' }, 5000)
  }

  const handleParticipate = async (bountyId) => {
    try {
      isParticipating.value = true
      const result = await walletStore.participateInBounty(bountyId)
      showFeedback('Successfully participated!', 'success', result.transaction.hash)
      await Promise.all([loadParticipantBounties(), loadAllBounties()])
    } catch (error) {
      showFeedback(error.message, 'error')
    } finally {
      isParticipating.value = false
    }
  }

  const handleFinalize = async (bountyId, participants) => {
    try {
      isFinalizingBounty.value = true
      const result = await walletStore.finalizeBounty(bountyId, participants)
      showFeedback('Bounty finalized successfully!', 'success', result.transaction.hash)
      await Promise.all([loadCreatorBounties(), loadAllBounties()])
    } catch (error) {
      showFeedback(error.message, 'error')
    } finally {
      isFinalizingBounty.value = false
    }
  }

  const loadAllBounties = async () => {
    try {
      isLoadingBounties.value = true
      await walletStore.fetchAllBounties()
    } catch (error) {
      showFeedback(error.message, 'error')
    } finally {
      isLoadingBounties.value = false
    }
  }

  const loadCreatorBounties = async () => {
    try {
      isLoadingCreator.value = true
      await walletStore.fetchCreatorBounties(walletStore.account?.accountId)
    } catch (error) {
      showFeedback(error.message, 'error')
    } finally {
      isLoadingCreator.value = false
    }
  }

  const loadParticipantBounties = async () => {
    try {
      isLoadingParticipant.value = true
      await walletStore.fetchParticipantBounties(walletStore.account?.accountId)
    } catch (error) {
      showFeedback(error.message, 'error')
    } finally {
      isLoadingParticipant.value = false
    }
  }

  const handleCreateBounty = async () => {
    try {
      isLoading.value = true
      const prizes = bountyData.value.prizes.map(prize => prize.trim())
      if (prizes.some(prize => isNaN(parseFloat(prize)))) throw new Error('All prizes must be valid numbers')

      const result = await walletStore.createBounty({ prizes })
      showFeedback(`Bounty created successfully!`, 'success', result.transaction.hash)
      bountyData.value.prizes = ['']
      await Promise.all([loadCreatorBounties(), loadAllBounties()])
    } catch (error) {
      showFeedback(error.message, 'error')
    } finally {
      isLoading.value = false
    }
  }

  const canParticipate = (bounty) => {
    return bounty.creator !== walletStore.account?.accountId && !bounty.participants?.includes(walletStore.account?.accountId)
  }

  onMounted(async () => {
    if (walletStore.isConnected) await Promise.all([loadAllBounties(), loadCreatorBounties(), loadParticipantBounties()])
  })

  watch(currentTab, async (newTab) => {
    switch (newTab) {
      case 'all': await loadAllBounties(); break
      case 'created': await loadCreatorBounties(); break
      case 'participating': await loadParticipantBounties(); break
    }
  })
</script>
