<template>
  <div class="mt-8 flex flex-col items-center">
    <p v-if="pending">Loading...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <div
      class="flex shadow-lg bg-white rounded-lg mb-8 w-full sm:w-[36rem] lg:w-[40rem] min-h-max relative pr-4"
    >
      <div class="p-4 items-center flex flex-col bgRedPrimary rounded-l-lg">
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
      <div class="grid ml-4 max-w-2xl">
        <div class="flex gap-4">
          <p class="hover:cursor-pointer" @click="gotoSub">
            le/{{ post?.sub_id.id }}
          </p>
          <p class="text-slate-500 hover:cursor-pointer" @click="gotoUser">
            u/{{ post?.user_id.username }}
          </p>
        </div>
        <h1 class="text-2xl">{{ post?.title }}</h1>
        <span>{{ post?.content }}</span>
      </div>
      <div class="py-4 absolute -right-0">
        <button v-if="!isFavorited" @click.stop="favorite(id as string)">
          <bookmark />
        </button>
        <button v-else @click.stop="unFavorite(id as string)">
          <bookmarksolid />
        </button>
      </div>
    </div>
    <Form
      class="flex flex-col w-full sm:w-[36rem] lg:w-[40rem]"
      :validation-schema="validationSchema"
      @submit="createComment"
    >
      <label for="content" class="block text-white text-sm font-semibold mb-2"
        >Comment</label
      >
      <Field
        as="textarea"
        name="content"
        placeholder="Comment"
        class="textfield resize-none"
        rows="2"
      />
      <ErrorMessage name="content" class="block text-red-500" />

      <button type="submit" class="btn btn-primary w-1/3">Comment</button>
    </Form>
    <div class="mt-10 w-full sm:w-[36rem] lg:w-[40rem]">
      <p class="text-2xl mb-5 text-white">Comments</p>
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

const router = useRouter()

const gotoUser = () => {
  router.push(`/profile/${post.value?.user_id.id}`)
}
const gotoSub = () => {
  router.push(`/le/${post.value?.sub_id.id}`)
}

type Post = {
  id: string
  title: string
  content: string
  sub_id: { id: string; title: string }
  user_id: { id: string; username: string }
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
    .select("id, title, content, sub_id(id, title), user_id(id,username)")
    .eq("id", id)
    .single()
  return res as Post
})

let { data } = useAsyncData("comments", async () => {
  let { data: comments } = await client
    .from("comments")
    .select("*, user_id(username)")
    .eq("post_id", id)

  return { comments } as Data
})

const createComment = async (values: any) => {
  if (!values.content) return

  if (user.value) {
    let comment = {
      content: values.content,
      user_id: user.value.id,
      post_id: id,
    } as never
    let res = await client.from("comments").insert([comment])
    await refreshNuxtData("comments")
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
    if (!res.error) {
      switch ((res.data[0] as any).value) {
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

  isFavorited.value = res.data ? res.data.length > 0 : false
})
const upVotePost = async (post_id: string) => {
  if (user.value) {
    let res = await client
      .from("votes-posts")
      .select()
      .eq("user_id", user.value.id)
      .eq("post_id", post_id)
    console.log(res)

    if (res.error) {
      await client
        .from("votes-posts")
        .insert({ user_id: user.value.id, post_id, value: 1 } as never)
      upvote.value = true
      downvote.value = false
    } else {
      let data = res.data[0] as any
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
    console.log(res)

    if (res.error) {
      await client
        .from("votes-posts")
        .insert({ user_id: user.value.id, post_id, value: -1 } as never)
      upvote.value = false
      downvote.value = true
    } else {
      let data = res.data[0] as any
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
