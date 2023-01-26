<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="flex shadow-lg bg-white rounded-lg mb-2  relative">
    <div
      class="p-4 items-center flex flex-col justify-center bgRedPrimary rounded-l-lg"
    >
      <button @click.stop="upVotePost(props.id)">
        <UpVote v-if="!upvote" title="Up Vote" fill-color="#" />
        <UpVoted v-else title="Remove Vote" fill-color="#ff4500" />
      </button>
      <p>{{ voteCount }}</p>
      <button @click.stop="downVotePost(props.id)">
        <DownVote v-if="!downvote" title="Down Vote" fill-color="#" />
        <DownVoted v-else title="Remove Vote" fill-color="#7193ff" />
      </button>
    </div>
    <div class="w-fit px-2 py-4 md:px-4">
      <div class="flex gap-2">
        <p>le/{{ props.sub }}</p>
        <p class="text-slate-500">u/{{ props.creator }}</p>
      </div>
      <h2 class="text-2xl hover:cursor-pointer" @click="gotoPost">
        {{ props.title }}
      </h2>
      <span class="hover:cursor-pointer" @click="gotoPost">{{
        props.content
      }}</span>
    </div>

    <div class=" px-0 py-4 md:px-2">
      <button v-if="!isFavorited" @click.stop="favorite(id as string)">
        <bookmark />
      </button>
      <button v-else @click.stop="unFavorite(id as string)">
        <bookmarksolid />
      </button>
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

let upvote = ref(false)
let downvote = ref(false)
let voteCount = ref(0)
let isFavorited = ref(false)

const client = useSupabaseClient()
const user = useSupabaseUser()

const router = useRouter()

const gotoPost = () => {
  router.push(`/post/${props.id}`)
}

type Vote = {
  value: number
}

const updateVoteCount = async () => {
  let { data: votes } = await client
    .from("votes-posts")
    .select("value")
    .eq("post_id", props.id)
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
      .eq("post_id", props.id)
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
  if (user.value) {
    let res = await client
      .from("fAVORITEDpOSTS")
      .select()
      .eq("user_id", user.value?.id)
      .eq("post_id", props.id)
      .single()

    isFavorited.value = res.data !== null
  }
})
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  sub: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
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
