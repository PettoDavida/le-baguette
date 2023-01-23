<template>
    <header class="h-20 flex justify-between items-center bgRedPrimary w-full">
      <NuxtLink to="/mainfeed"
        ><img src="~/public/images/baguette.jpg" alt="Le Baguette" class="w-20"
      /></NuxtLink>
      <ul v-if="!user.isLoggedIn" class="flex gap-20 p-8">
        <li>
          <NuxtLink to="/login" class=""><span class="material-symbols-outlined text-white">
            login
          </span></NuxtLink>
        </li>
        <li>
          <NuxtLink to="/register"><span class="material-symbols-outlined text-white">
            account_circle
          </span></NuxtLink>
        </li>
      </ul>
      <ul v-if="user.isLoggedIn" class="flex gap-20">
        <li>
          <button class="" @click="logout"><span class="material-symbols-outlined">
            logout
          </span></button>
        </li>
      </ul>
    </header>
</template>

<script setup>
import { useUserStore } from "~/stores/user"

const user = useUserStore()
const router = useRouter()

const logout = () => {
  user.logout()
  router.replace("/")
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");
</style>