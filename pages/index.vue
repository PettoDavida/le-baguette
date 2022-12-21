<template>
  <div class="grid place-items-center">
    <div v-for="sub in subs" :key="sub.id">
      <NuxtLink :to="'/le/' + sub.id"> {{ sub.title }}</NuxtLink>
    </div>
    <button @click="test" class="btn btn-primary">Test</button>
  </div>
</template>

<script setup>
const client = useSupabaseClient()

const { data: subs } = await useAsyncData("subs", async () => {
  const { data } = await client.from("subs").select()
  return data
})

const test = async () => {
  let { data } = await client.from("test").select().eq("id", 1).single()

  let res = await client
    .from("test")
    .update({
      testarray: [...data.testarray, 999],
    })
    .eq("id", 1)
    .select()
    .eq("id", 1)
  console.log(res)
}
</script>
