<template>
  <div class="grid place-items-center">
    <div v-for="sub in subs" :key="sub.id">
      <NuxtLink :to="'/le/' + sub.id"> {{ sub.title }}</NuxtLink>
    </div>

    <form @submit.prevent="test">
      <input ref="fileInput" type="file" />
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script setup>
const client = useSupabaseClient()

const { data: subs } = await useAsyncData("subs", async () => {
  const { data } = await client.from("subs").select()
  return data
})

const fileInput = ref(null)

const test = async (form) => {
  let file = fileInput.value.files[0]
  console.log("Form", file)
  let res = await client.storage
    .from("images")
    .upload("public/" + file?.name, file)
  console.log(res)
}
</script>
