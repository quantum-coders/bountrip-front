<template>
	<div class="block block-splash">
		<div class="container">
			<h2 class="title">
				Let the crowd find<br>
				<small>the best plan for your next trip</small>
			</h2>

			<!-- input with placeholder "Where do you want to go?" -->
			<div class="search" style="max-width: 500px;">
				<input type="text" placeholder="Where do you want to go?">
				<button class="btn btn-primary">Start Bounty</button>
			</div>
		</div>

		<div class="splash-background">
			<swiper effect="fade" :autoplay="{ delay: 5000 }" :modules="[ SwiperAutoplay, SwiperEffectFade ]">
				<swiper-slide>
					<div class="splash-image splash-image1"></div>
				</swiper-slide>
				<swiper-slide>
					<div class="splash-image splash-image2"></div>
				</swiper-slide>
				<swiper-slide>
					<div class="splash-image splash-image3"></div>
				</swiper-slide>
				<swiper-slide>
					<div class="splash-image splash-image4"></div>
				</swiper-slide>
			</swiper>
		</div>
	</div>
</template>

<script setup>
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="sass" scoped>

	.block-splash
		height: 85dvh
		@extend .flex-center
		border-radius: 1rem
		overflow: hidden

		&:after
			content: ''
			@extend .absolute-full
			background: rgba(black, 0.25)
			z-index: 1
			pointer-events: none

		.container
			z-index: 2

		.splash-background
			@extend .absolute-full
			z-index: 0

			.splash-image
				height: 85dvh
				background-position: center center
				background-repeat: no-repeat
				background-size: cover

				&.splash-image1
					background-image: url('/images/splash/argentina.jpg')

				&.splash-image2
					background-image: url('/images/splash/brazil.jpg')

				&.splash-image3
					background-image: url('/images/splash/petra.jpg')

				&.splash-image4
					background-image: url('/images/splash/japan.jpg')

		.title
			font-size: 2.5vw
			line-height: 0.8
			font-weight: 900
			color: white
			text-shadow: 0 0 1rem rgba(black, 0.5), 0 0 5rem rgba(black, 0.5)
			margin-bottom: 2rem

			small
				font-size: 2vw
				font-weight: 400

		.search
			display: flex
			align-items: center
			background: white
			gap: 1rem
			padding: 1rem
			border-radius: 1rem

			input
				flex-grow: 1
				border: 0

				&:focus
					outline: none

</style>