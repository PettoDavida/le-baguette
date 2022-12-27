<template>
  <header
    class="h-20 flex justify-between items-center border-b border-b-gray-800 border-opacity-20"
  >
    <NuxtLink to="/"
      ><img src="~/public/images/baguette.jpg" alt="Le Baguette" class="w-16"
    /></NuxtLink>
    <ul v-if="user" class="flex gap-4 items-center">
      <li>
        <button @click="router.replace('/newpost')" class="btn btn-primary">
          <PlusIcon />
        </button>
      </li>
      <li>
        <NuxtLink to="/createsub" class="btn btn-primary">Create Sub</NuxtLink>
      </li>
      <li>
        <button class="btn btn-primary" @click="logout">Logout</button>
      </li>
    </ul>
    <ul v-else class="flex gap-20">
      <li>
        <NuxtLink to="/login" class="btn btn-primary">Login</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/register" class="btn btn-primary">Register</NuxtLink>
      </li>
    </ul>

    <p v-if="loading">Loading</p>
  </header>
</template>

<script setup>
import PlusIcon from "vue-material-design-icons/Plus.vue"

const router = useRouter()

const client = useSupabaseAuthClient()
const user = useSupabaseUser()

let loading = ref(false)

const logout = async () => {
  await client.auth.signOut()

  router.replace("/")
}
</script>
