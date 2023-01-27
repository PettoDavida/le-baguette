// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/supabase"],
  css: ["@/assets/css/main.css"],
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "/images/favicon.ico" },
      ],
    },
  },
})
