<template>
  <header class="h-20 flex justify-between items-center bgRedPrimary w-full">
    <div class="flex items-center justify-between w-72 lg:w-80">
      <NuxtLink to="/"
        ><img src="~/public/images/baguette.png" alt="Le Baguette" class="w-16"
      /></NuxtLink>

      <Form @submit="doSearch">
        <div
          class="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden"
        >
          <div class="grid place-items-center h-full w-12 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Field
            v-model="searchField"
            name="search"
            placeholder="Search"
            class="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
          />
        </div>
      </Form>
    </div>
    <Hamburger class="block md:hidden" :profileName="data || 'not logged in'" />
    <ul v-if="user" class="hidden md:flex gap-4 items-center">
      <li>
        <button class="btn btn-primary" @click="router.replace('/newpost')">
          <PlusIcon />
        </button>
      </li>
      <li>
        <NuxtLink
          to="/createsub"
          class="text-white bg-transparent md:btn md:btn-primary"
          >Create Sub</NuxtLink
        >
      </li>
      <li>
        <button class="flex flex-col items-center" @click="gotoProfile">
          <AccountIcon class="text-white" />
          <span class="text-white text-xs">u/{{ data }}</span>
        </button>
      </li>
      <li>
        <button class="btn btn-primary" @click="logout">Logout</button>
      </li>
    </ul>

    <ul v-else class="hidden md:flex gap-20 p-8">
      <li>
        <NuxtLink to="/login">
          <span class="material-symbols-outlined text-white">
            account_circle
          </span>
        </NuxtLink>
      </li>
    </ul>

    <p v-if="loading">Loading</p>
  </header>
</template>

<script setup>
import { Field, Form } from "vee-validate"

import PlusIcon from "vue-material-design-icons/Plus.vue"
import AccountIcon from "vue-material-design-icons/AccountCircle.vue"

const router = useRouter()

const client = useSupabaseAuthClient()
const user = useSupabaseUser()

let loading = ref(false)

const { data } = useAsyncData(async () => {
  let username = await client
    .from("userdata")
    .select("username")
    .eq("id", user.value.id)
    .single()
  return username.data.username
})

const logout = async () => {
  await client.auth.signOut()

  router.replace("/")
}

const gotoProfile = async () => {
  router.push(`/profile/${user.value.id}`)
}

const searchField = ref("")

const doSearch = async () => {
  await router.replace(`/search/?term=${searchField.value}`)
  await refreshNuxtData(["subs", "posts"])
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");
</style>
