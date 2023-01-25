<template>
  <div class="flex shadow-lg bg-white rounded-lg mb-8 min-w-full relative">
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
    <div class="grid grid-rows-4 px-4">
      <p class="text-slate-500">u/{{ props.creator }}</p>
      <span class="row-start-2">{{ props.content }}</span>
    </div>
    <button
      v-if="userOwner"
      class="absolute left-16 bottom-0"
      @click="deleteComment(props.id)"
    >
      <Delete />
    </button>
  </div>
</template>

<script setup lang="ts">
import UpVoted from "vue-material-design-icons/ArrowUpBold.vue"
import UpVote from "vue-material-design-icons/ArrowUpBoldOutline.vue"
import DownVoted from "vue-material-design-icons/ArrowDownBold.vue"
import DownVote from "vue-material-design-icons/ArrowDownBoldOutline.vue"
import Delete from "vue-material-design-icons/DeleteOutline.vue"

let upvote = ref(false)
let downvote = ref(false)
let voteCount = ref(0)
let userOwner = ref(false)

const client = useSupabaseClient()
const user = useSupabaseUser()

type Vote = {
  value: number
}

const updateVoteCount = async () => {
  let { data: votes } = await client
    .from("votes-")
    .select("value")
    .eq("comment_id", props.id)
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
      .from("votes-")
      .select()
      .eq("user_id", user.value.id)
      .eq("comment_id", props.id)
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

useAsyncData(async () => {
  if (user.value) {
    let res = await client
      .from("comments")
      .select()
      .eq("user_id", user.value.id)
      .eq("id", props.id)
      .single()
    if (!res.error) {
      userOwner.value = true
    } else {
      let res = await client
        .from("subs")
        .select()
        .eq("owner", user.value.id)
        .eq("id", props.subId)
        .single()
      if (!res.error) {
        userOwner.value = true
      }
    }
  }
})

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  subId: {
    type: String,
    required: true,
  },
})

const upVotePost = async (comment_id: string) => {
  if (user.value) {
    let res = await client
      .from("votes-")
      .select()
      .eq("user_id", user.value.id)
      .eq("comment_id", comment_id)
      .single()
    console.log(res)

    if (res.error) {
      let res = await client
        .from("votes-")
        .insert({ user_id: user.value.id, comment_id, value: 1 } as never)
      upvote.value = true
      downvote.value = false
      console.log(res)
    } else {
      let data = res.data as any
      console.log(data)
      if (data.value === 1) {
        await client
          .from("votes-")
          .update({ user_id: user.value.id, comment_id, value: 0 } as never)
          .eq("user_id", user.value.id)
          .eq("comment_id", comment_id)

        upvote.value = false
        downvote.value = false
      } else if (data.value === 0 || data.value === -1) {
        await client
          .from("votes-")
          .update({ user_id: user.value.id, comment_id, value: 1 } as never)
          .eq("user_id", user.value.id)
          .eq("comment_id", comment_id)

        upvote.value = true
        downvote.value = false
      }
    }

    await updateVoteCount()
  }
}

const downVotePost = async (comment_id: string) => {
  if (user.value) {
    let res = await client
      .from("votes-")
      .select()
      .eq("user_id", user.value.id)
      .eq("comment_id", comment_id)
      .single()
    console.log(res)

    if (res.error) {
      await client
        .from("votes-")
        .insert({ user_id: user.value.id, comment_id, value: -1 } as never)
      upvote.value = false
      downvote.value = true
    } else {
      let data = res.data as any
      console.log(data)
      if (data.value === -1) {
        await client
          .from("votes-")
          .update({ user_id: user.value.id, comment_id, value: 0 } as never)
          .eq("user_id", user.value.id)
          .eq("comment_id", comment_id)
        upvote.value = false
        downvote.value = false
      } else if (data.value === 0 || data.value === 1) {
        await client
          .from("votes-")
          .update({ user_id: user.value.id, comment_id, value: -1 } as never)
          .eq("user_id", user.value.id)
          .eq("comment_id", comment_id)
        upvote.value = false
        downvote.value = true
      }
    }

    await updateVoteCount()
  }
}

const deleteComment = async (comment_id: string) => {
  let res = await client.from("comments").select().eq("id", comment_id)
  if (res.data) {
    for (const comment of res.data) {
      await client
        .from("votes")
        .delete()
        .eq("comment_id", (comment as any).id)
    }
  }

  await client.from("comments").delete().eq("id", comment_id)
  refreshNuxtData("comments")
}
</script>
