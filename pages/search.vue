<template>
  <div class="grid place-items-center">
    <div class="">
      Subs
      <div v-for="sub in subs" :key="sub.id">
        <NuxtLink :to="'/le/' + sub.id">le/{{ sub.id }}</NuxtLink>
      </div>
    </div>
    <div class="">
      Posts
      <Post
        v-for="post in posts"
        :id="post.id || 'Error'"
        :key="post.id"
        :title="post.title || 'Error'"
        :content="post.content || 'Error'"
        :sub="post.sub_id.title || 'Error'"
        :creator="post.user_id.username || 'Error'"
      />
    </div>
  </div>
</template>

<script setup>
import fuzzysort from "fuzzysort"

const client = useSupabaseClient()
const route = useRoute()

const { data: subs } = await useAsyncData("subs", async () => {
  const searchTerm = route.query.term
  if (searchTerm && searchTerm.length > 0) {
    const { data } = await client.from("subs").select()
    const searchResults = fuzzysort.go(searchTerm, data, { key: "id" })
    return searchResults.map((item) => item.obj)
  } else {
    const { data } = await client.from("subs").select()
    return data
  }
})

const { data: posts } = await useAsyncData("posts", async () => {
  const searchTerm = route.query.term
  if (searchTerm && searchTerm.length > 0) {
    const { data } = await client
      .from("posts")
      .select("*, sub_id(title), user_id(username)")
    const searchResults = fuzzysort.go(searchTerm, data, { key: "title" })
    return searchResults.map((item) => item.obj)
  } else {
    const { data } = await client
      .from("posts")
      .select("*, sub_id(title), user_id(username)")
    return data
  }
})
</script>
