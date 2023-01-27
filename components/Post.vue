<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div
    class="flex shadow-lg bg-white rounded-lg mb-2 relative pr-4 max-h-96 w-full sm:w-[36rem] lg:w-[40rem] overflow-hidden"
  >
    <div class="p-4 items-center flex flex-col bgRedPrimary rounded-l-lg">
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

    <div class="py-4 absolute -right-0">
      <button v-if="!isFavorited" @click.stop="favorite(id as string)">
        <bookmark />
      </button>
      <button v-else @click.stop="unFavorite(id as string)">
        <bookmarksolid />
      </button>
      <button v-if="userOwner" @click="deletePost(id)"><Delete /></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Delete from "vue-material-design-icons/DeleteOutline.vue"
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
let userOwner = ref(false)

const client = useSupabaseClient()
const user = useSupabaseUser()

const router = useRouter()

const gotoPost = () => {
  router.push(`/post/${props.id}`)
}

useAsyncData(async () => {
  if (user.value) {
    let res = await client
      .from("posts")
      .select()
      .eq("user_id", user.value.id)
      .eq("id", props.id)
    if (!res.error && res.data && res.data.length === 1) {
      userOwner.value = true
    } else {
      let res = await client
        .from("subs")
        .select()
        .eq("owner", user.value.id)
        .eq("id", props.sub)
      if (!res.error && res.data && res.data.length === 1) {
        userOwner.value = true
      }
    }
  }
})

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
  if (user.value) {
    let res = await client
      .from("fAVORITEDpOSTS")
      .select()
      .eq("user_id", user.value?.id)
      .eq("post_id", props.id)

    isFavorited.value = res.data ? res.data.length > 0 : false
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
    console.log(res)

    if (res.error || (res.data && res.data.length <= 0)) {
      await client
        .from("votes-posts")
        .insert({ user_id: user.value.id, post_id, value: 1 } as never)
      upvote.value = true
      downvote.value = false
    } else {
      //TODO Ger tillbaka en tom array om det inte existerar någon vote leder till att data = undefined
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

    if (res.error || (res.data && res.data.length <= 0)) {
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

const deletePost = async (post_id: string) => {
  let res = await client.from("comments").select().eq("post_id", props.id)
  if (res.data) {
    for (const comment of res.data) {
      await client
        .from("votes-")
        .delete()
        .eq("comment_id", (comment as any).id)
    }
  }

  await client.from("fAVORITEDpOSTS").delete().eq("post_id", props.id)
  await client.from("comments").delete().eq("post_id", props.id)
  await client.from("votes-posts").delete().eq("post_id", props.id)
  await client.from("posts").delete().eq("id", props.id)
  refreshNuxtData("allSubPosts")
  refreshNuxtData("subPosts")
  refreshNuxtData("specSubPosts")
}
</script>
