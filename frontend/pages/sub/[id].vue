<template>
  <div>
    <h1>Sub: {{ info.title }}</h1>
    <h1>ID: {{ route.params.id }}</h1>
    <div>
      <div v-if="user.isLoggedIn"></div>

      <div v-if="!user.isLoggedIn"></div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/user"

const route = useRoute()
const user = useUserStore()

let id = route.params.id

const { data: info } = await useFetch(`/api/sub/${id}`, {
  baseURL: "http://localhost:3001",
})
</script>
