<template>
  <div class="grid place-items-center grid-cols-2">
    <div class="">
      Posts
      <Post
        v-for="post in subPosts.posts"
        :id="post.id || 'Error'"
        :key="post.id"
        :title="post.title || 'Error'"
        :content="post.content || 'Error'"
        :sub="post.sub_id.title || 'Error'"
        :creator="post.user_id.username || 'Error'"
      />
    </div>
    <div class="">
      Subs
      <div v-for="sub in subs" :key="sub.id">
        <NuxtLink :to="'/le/' + sub.id"> {{ sub.title }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
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

const { data: subPosts } = await useAsyncData("subPosts", async () => {
  let { data: subMembers } = await client
    .from("submembers")
    .select()
    .eq("user_id", user.value.id)
  let subs = subMembers.map((item) => item.sub_id)
  let { data: posts } = await client
    .from("posts")
    .select("*, sub_id(title), user_id(username)")
    .in("sub_id", subs)
  console.log(posts)
  return {
    posts,
  }
})
</script>
