<template>
  <div>
    <p v-if="pending">Loading...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <div class="flex shadow-lg px-10 py-5 bg-lime-300">
      <div class="px-4 items-center flex flex-col">
        <button @click.stop="upVotePost(id as string)">
          <UpVote v-if="!upvote" title="Up Vote" fill-color="#" />
          <UpVoted v-else title="Remove Vote" fill-color="#ff4500" />
        </button>
        <p>{{ voteCount }}</p>
        <button @click.stop="downVotePost(id as string)">
          <DownVote v-if="!downvote" title="Down Vote" fill-color="#" />
          <DownVoted v-else title="Remove Vote" fill-color="#7193ff" />
        </button>
      </div>
      <div>
        <p>le/{{ post?.sub_id.title }}</p>
        <p>u/{{ post?.user_id.username }}</p>
        <h1>{{ post?.title }}</h1>
        <span>{{ post?.content }}</span>
      </div>
      <div>
        <button v-if="!isFavorited" @click.stop="favorite(id as string)">
          <bookmark />
        </button>
        <button v-else @click.stop="unFavorite(id as string)">
          <bookmarksolid />
        </button>
      </div>
    </div>
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
          :sub-id="post?.sub_id.id || 'Error'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import bookmarksolid from "vue-material-design-icons/Bookmark.vue"
import bookmark from "vue-material-design-icons/BookmarkOutline.vue"
import UpVoted from "vue-material-design-icons/ArrowUpBold.vue"
import UpVote from "vue-material-design-icons/ArrowUpBoldOutline.vue"
import DownVoted from "vue-material-design-icons/ArrowDownBold.vue"
import DownVote from "vue-material-design-icons/ArrowDownBoldOutline.vue"

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
  id: string
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

let upvote = ref(false)
let downvote = ref(false)
let voteCount = ref(0)
let isFavorited = ref(false)

const client = useSupabaseClient()
const user = useSupabaseUser()

const {
  data: post,
  pending,
  error,
} = useAsyncData(async () => {
  let { data: res } = await client
    .from("posts")
    .select("id, title, content, sub_id(id, title), user_id(username)")
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
      post_id: id,
    } as never
    let res = await client.from("comments").insert([comment])
    console.log(res)
  }
}
type Vote = {
  value: number
}

const updateVoteCount = async () => {
  let { data: votes } = await client
    .from("votes-posts")
    .select("value")
    .eq("post_id", id)
  voteCount.value =
    votes
      ?.map((item: Vote) => item.value)
      .reduce((acc: number, value: number) => acc + value, 0) || 0
}

useAsyncData(async () => {
  await updateVoteCount()
})

useAsyncData(async () => {
  if (user.value) {
    let res = await client
      .from("votes-posts")
      .select()
      .eq("user_id", user.value.id)
      .eq("post_id", id)
      .single()
    if (!res.error) {
      switch ((res.data as any).value) {
        case -1:
          upvote.value = false
          downvote.value = true
          break
        case 0:
          upvote.value = false
          downvote.value = false
          break
        case 1:
          upvote.value = true
          downvote.value = false
          break
        default:
          break
      }
    }
  }
})

useAsyncData("favorited", async () => {
  let res = await client
    .from("fAVORITEDpOSTS")
    .select()
    .eq("user_id", user.value?.id)
    .eq("post_id", id)
    .single()

  isFavorited.value = res.data !== null
})
const upVotePost = async (post_id: string) => {
  if (user.value) {
    let res = await client
      .from("votes-posts")
      .select()
      .eq("user_id", user.value.id)
      .eq("post_id", post_id)
      .single()
    console.log(res)

    if (res.error) {
      await client
        .from("votes-posts")
        .insert({ user_id: user.value.id, post_id, value: 1 } as never)
      upvote.value = true
      downvote.value = false
    } else {
      let data = res.data as any
      console.log(data)
      if (data.value === 1) {
        await client
          .from("votes-posts")
          .update({ user_id: user.value.id, post_id, value: 0 } as never)
          .eq("user_id", user.value.id)
          .eq("post_id", post_id)

        upvote.value = false
        downvote.value = false
      } else if (data.value === 0 || data.value === -1) {
        await client
          .from("votes-posts")
          .update({ user_id: user.value.id, post_id, value: 1 } as never)
          .eq("user_id", user.value.id)
          .eq("post_id", post_id)

        upvote.value = true
        downvote.value = false
      }
    }

    await updateVoteCount()
  }
}

const downVotePost = async (post_id: string) => {
  if (user.value) {
    let res = await client
      .from("votes-posts")
      .select()
      .eq("user_id", user.value.id)
      .eq("post_id", post_id)
      .single()
    console.log(res)

    if (res.error) {
      await client
        .from("votes-posts")
        .insert({ user_id: user.value.id, post_id, value: -1 } as never)
      upvote.value = false
      downvote.value = true
    } else {
      let data = res.data as any
      console.log(data)
      if (data.value === -1) {
        await client
          .from("votes-posts")
          .update({ user_id: user.value.id, post_id, value: 0 } as never)
          .eq("user_id", user.value.id)
          .eq("post_id", post_id)
        upvote.value = false
        downvote.value = false
      } else if (data.value === 0 || data.value === 1) {
        await client
          .from("votes-posts")
          .update({ user_id: user.value.id, post_id, value: -1 } as never)
          .eq("user_id", user.value.id)
          .eq("post_id", post_id)
        upvote.value = false
        downvote.value = true
      }
    }

    await updateVoteCount()
  }
}

const favorite = async (post_id: string) => {
  if (!user.value) return

  await client
    .from("fAVORITEDpOSTS")
    .insert({ user_id: user.value.id, post_id: post_id } as never)

  refreshNuxtData("favorited")
}

const unFavorite = async (post_id: string) => {
  if (!user.value) return

  await client
    .from("fAVORITEDpOSTS")
    .delete()
    .eq("user_id", user.value.id)
    .eq("post_id", post_id)

  refreshNuxtData("favorited")
}
</script>
