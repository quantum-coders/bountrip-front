<template>
	<form>
		<div class="mb-3">
			<template v-for="(prize, index) in newBounty.bounty.prizes" :key="index">
				<div class="prize-group mb-3">
					<label>
						<icon name="material-symbols:trophy-outline" />
						{{ labels[index] }}
					</label>
					<input
						v-model="newBounty.bounty.prizes[index]"
						type="text"
						placeholder="Amount"
						required
					/>
					<button
						type="button"
						@click="removePrize(index)"
						class="btn btn-danger"
						:disabled="newBounty.bounty.prizes.length <= 1"
					>
						Remove Prize
					</button>
				</div>
			</template>
		</div>
		<div class="text-end">
			<button type="button" @click="addPrize" class="btn btn-secondary" v-if="newBounty.bounty.prizes.length < 5">
				Add Prize
			</button>
		</div>
	</form>
</template>

<script setup>
	const newBounty = useNewBountyStore();

	const labels = [
		'First Place',
		'Second Place',
		'Third Place',
		'Fourth Place',
		'Fifth Place',
	];

	const addPrize = () => {
		// limit to 5 prizes
		if(newBounty.bounty.prizes.length >= 5) return;
		newBounty.bounty.prizes.push('');
	};

	const removePrize = (index) => {
		if(newBounty.bounty.prizes.length > 1) {
			newBounty.bounty.prizes.splice(index, 1);
		}
	};
</script>

<style lang="sass" scoped>

	.prize-group
		display: flex
		align-items: center
		background: white
		gap: 1rem
		border-radius: 1rem
		box-shadow: 0 0.5rem 1rem rgba(black, 0.1)
		padding-right: 1rem
		overflow: clip

		label
			text-align: right
			padding: 1rem
			width: 150px
			flex-shrink: 0
			border-right: 1px solid rgba(black, 0.1)
			display: flex
			align-items: center
			justify-content: space-between
			background: var(--brand1)
			color: white

		input
			flex-grow: 1
			border: 0

			&:focus
				outline: none

</style>
