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
    <Form :validation-schema="validationSchema" @submit="createComment">
      <label for="content" class="textfield-label">Comment</label>
      <Field
        as="textarea"
        name="content"
        placeholder="Comment"
        class="textfield resize-none"
        rows="5"
      />
      <ErrorMessage name="content" class="block text-red-500" />

      <button type="submit" class="btn btn-primary">Comment</button>
    </Form>
    <div class="mt-10">
      <p class="text-2xl mb-5">Comments</p>
      <div
        v-for="comment in data?.comments"
        :key="comment.id"
        class="flex items-center gap-10"
      >
        <Comment
          :id="comment.id || 'Error'"
          :content="comment.content || 'Error'"
          :creator="comment.user_id.username || 'Error'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Field, Form, ErrorMessage } from "vee-validate"
import { toFormValidator } from "@vee-validate/zod"
import * as zod from "zod"

const validationSchema = toFormValidator(
  zod.object({
    content: zod.string().min(1, "A comments needs content"),
  })
)

const route = useRoute()
const id = route.params.id

type Test = {
  title: string
  content: string
  sub_id: { id: string; title: string }
  user_id: { username: string }
}

type User = {
  id: string
  username: string
}

type Comment = {
  id: string
  content: string
  user_id: User
}

type Data = {
  comments: Comment[]
}

const client = useSupabaseClient()
const user = useSupabaseUser()

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

let { data } = useAsyncData(async () => {
  let { data: comments } = await client
    .from("comments")
    .select("*, user_id(username)")
    .eq("post_id", id)

  return { comments } as Data
})

const fetchComments = async (post_id: string) => {
  let { data: comments } = await client
    .from("comments")
    .select("*, user_id(username)")
    .eq("post_id", post_id)

  return comments as Comment[]
}

const createComment = async (values: any) => {
  if (!values.content) return

  if (user.value) {
    let comment = {
      content: values.content,
      user_id: user.value.id,
      post_id: id as string,
    } as never
    let res = await client.from("comments").insert([comment])
    console.log(res)
  }
}
</script>
