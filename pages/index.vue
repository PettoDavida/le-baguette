<template>
  <div class="grid place-items-center">
    <div v-for="sub in subs" :key="sub.id">
      <NuxtLink :to="'/le/' + sub.id"> {{ sub.title }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const route = useRoute()

const search = route.query.search

const { data: subs } = await useAsyncData("subs", async () => {
  if (search) {
    const { data } = await client
      .from("subs")
      .select()
      .textSearch("title", `'${search}'`, {
        type: "websearch",
        config: "english",
      })
    // .filter("title", "ilike", search)

    return data
  } else {
    const { data } = await client.from("subs").select()
    return data
  }
})
</script>
