export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	extends: [ '@thewebchimp/chimp-nuxt-layer' ],
	modules: [ '@nuxtjs/google-fonts', 'nuxt-swiper' ],
	googleFonts: {
		families: {
			'DM+Sans': true,
		}
	}
})