<template>
  <div class="grid place-items-center">
    <div v-for="sub in subs" :key="sub._id">
      <NuxtLink :to="'/sub/' + sub._id"> {{ sub.title }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { data: subs } = useFetch("/api/sub", {
  baseURL: "http://localhost:3001",
})
</script>
