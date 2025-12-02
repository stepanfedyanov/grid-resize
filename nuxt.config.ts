// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: [
    '@/assets/css/main.scss',
  ],
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/grid-resize/' : '/',
    buildAssetsDir: 'assets',
  },
  ssr: false,
})
