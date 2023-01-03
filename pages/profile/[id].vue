<template>
  <p v-if="pending">Loading...</p>
  <div v-else>
    <div>
      <img src="" alt="" />
      <h1>Name</h1>
      <span>karma = upvotes - downvotes</span>
      <p>about</p>
    </div>
    <div class="mt-10">
      <div v-for="sub in data?.subs" :key="sub.sub_id.id" class="flex gap-4">
        <NuxtLink :to="'/le/' + sub.sub_id.id">le/{{ sub.sub_id.id }}</NuxtLink>
        <p>{{ sub.sub_id.title }}</p>
      </div>
      <div class="mt-10">
        <div v-for="post in data?.posts" :key="post.id">
          <p>{{ post }}</p>
        </div>
      </div>
      <div>comments</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id

const client = useSupabaseClient()
const user = useSupabaseUser()

let isMe = false
if (user && user.value) {
  isMe = id === user.value.id
}

type Sub = {
  id: string
  title: string
}

type Post = {
  id: string
  title: string
  content: string
  user_id: { username: string }
}

type Data = {
  posts: Post[]
  subs: { sub_id: Sub }[]
}

const router = useRouter()

let { data, pending } = useAsyncData(async () => {
  let { data: posts, error } = await client
    .from("posts")
    .select("*, user_id(username)")
    .eq("user_id", id)

  if (error) {
    router.back()
    return null
  }

  let { data: subs } = await client
    .from("submembers")
    .select("sub_id(id, title)")
    .eq("user_id", id)

  return {
    posts,
    subs,
  } as Data
})
</script>
