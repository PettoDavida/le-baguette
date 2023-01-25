<template>
  <header
    class="h-20 flex justify-between items-center bgRedPrimary w-full"
  >
    <NuxtLink to="/"
      ><img src="~/public/images/baguette.jpg" alt="Le Baguette" class="w-16"
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

        <!-- <input
          class="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
          type="text"
          id="search"
          placeholder="Search something.."
        /> -->

        <Field
          v-model="searchField"
          name="search"
          placeholder="Search"
          class="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
        />
      </div>
    </Form>
    <Hamburger class="block md:hidden"/>
    <ul v-if="user" class="hidden md:flex gap-4 items-center">
      <li>
        <button class="btn btn-primary" @click="router.replace('/newpost')">
          <PlusIcon />
        </button>
      </li>
      <li>
        <NuxtLink to="/createsub" class=" text-white bg-transparent md:btn md:btn-primary">Create Sub</NuxtLink>
      </li>
      <li>
        <button @click="gotoProfile">
          <AccountIcon class="text-white" />
        </button>
      </li>
      <li>
        <button class="btn btn-primary" @click="logout">Logout</button>
      </li>
    </ul>
    
    <ul v-else class="hidden md:flex gap-20 p-8">
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
