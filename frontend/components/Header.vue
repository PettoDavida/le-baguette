<template>
  <header class="h-20 flex justify-between items-center">
    <NuxtLink to="/"
      ><img src="~/public/images/baguette.jpg" alt="Le Baguette" class="w-20"
    /></NuxtLink>
    <ul v-if="!user.isLoggedIn" class="flex gap-20">
      <li>
        <NuxtLink to="/login" class="btn btn-primary">Login</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/register" class="btn btn-primary">Register</NuxtLink>
      </li>
    </ul>
    <ul v-if="user.isLoggedIn" class="flex gap-20">
      <li>
        <button class="btn btn-primary" @click="logout">Logout</button>
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
