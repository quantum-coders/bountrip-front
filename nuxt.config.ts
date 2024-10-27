export default defineNuxtConfig({
    css: [

    ],
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    extends: ['@thewebchimp/chimp-nuxt-layer'],
    modules: ['@nuxtjs/google-fonts', 'nuxt-swiper'],
    googleFonts: {
        families: {
            'DM+Sans': true,
            'Barlow': true
        }
    },
    plugins: [
        '~/plugins/polyfill-global.client.js',
    ],
    imports: {
        dirs: [
            'stores',
        ],
    },
    runtimeConfig: {
        public: {
            baseURL: process.env.BASE_URL || 'http://localhost:1337',
            appURL: process.env.APP_URL || 'http://localhost:3000'
        },
    },
    vite: {
        define: {global: 'window'},
    }
})
