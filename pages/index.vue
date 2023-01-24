<template>
  <div class="grid place-items-center grid-cols-2">
    <div class="flex flex-col">
      <select @change="setShownPosts">
        <option value="popular">Popular</option>
        <option value="home">Home</option>
      </select>
      Posts
      {{ selected }}
      <div v-if="selected === 'home'">
        <Post
          v-for="post in subPosts"
          :id="post.id || 'Error'"
          :key="post.id"
          :title="post.title || 'Error'"
          :content="post.content || 'Error'"
          :sub="post.sub_id.title || 'Error'"
          :creator="post.user_id.username || 'Error'"
        />
      </div>
      <div v-else>
        <Post
          v-for="post in allPosts"
          :id="post.id || 'Error'"
          :key="post.id"
          :title="post.title || 'Error'"
          :content="post.content || 'Error'"
          :sub="post.sub_id.title || 'Error'"
          :creator="post.user_id.username || 'Error'"
        />
      </div>
    </div>
    <div v-if="user">
      <select @change="setShownSubs">
        <option value="followed">Followed</option>
        <option value="popular">Popular</option>
      </select>

      <div v-if="selectedSub === 'followed'">
        Subs
        <div v-for="sub in followedSubs" :key="sub.id">
          <NuxtLink :to="'/le/' + sub.id"> le/{{ sub.id }}</NuxtLink>
        </div>
      </div>
      <div v-else>
        Subs
        <div v-for="sub in subs" :key="sub.id">
          <NuxtLink :to="'/le/' + sub.id"> le/{{ sub.id }}</NuxtLink>
        </div>
      </div>
    </div>
    <div v-else>
      Subs
      <div v-for="sub in subs" :key="sub.id">
        <NuxtLink :to="'/le/' + sub.id"> le/{{ sub.id }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()

const selected = ref("popular")

const setShownPosts = async (event) => {
  selected.value = event.target.value
}
const selectedSub = ref("followed")

const setShownSubs = async (event) => {
  selectedSub.value = event.target.value
}

const { data: subs } = await useAsyncData("subs", async () => {
  const { data } = await client.from("subs").select()
  return data
})

const { data: followedSubs } = await useAsyncData("subs", async () => {
  let { data: subMembers } = await client
    .from("submembers")
    .select()
    .eq("user_id", user.value.id)
  let subs = subMembers.map((item) => item.sub_id)
  const { data } = await client.from("subs").select().in("sub_id", subs)
  return data
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
  return posts
})

const { data: allPosts } = await useAsyncData("allSubPosts", async () => {
  let { data: posts } = await client
    .from("posts")
    .select("*, sub_id(title), user_id(username)")
  return posts
})
</script>
