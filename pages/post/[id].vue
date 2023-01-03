<template>
  <div>
    <!-- <p>{{ post.title }}</p>
    <p>{{ post.content }}</p> -->
    <p v-if="pending">Loading...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <Post
      v-else
      :id="id as string || 'Error'"
      :title="post?.title || 'Error'"
      :content="post?.content || 'Error'"
      :sub="post?.sub_id.title || 'Error'"
      :creator="post?.user_id.username || 'Error'"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id

type Test = {
  title: string
  content: string
  sub_id: { id: string; title: string }
  user_id: { username: string }
}

const client = useSupabaseClient()

const {
  data: post,
  pending,
  error,
} = useAsyncData(async () => {
  let { data: res } = await client
    .from("posts")
    .select("title, content, sub_id(id, title), user_id(username)")
    .eq("id", id)
    .single()
  return res as Test
})
</script>
