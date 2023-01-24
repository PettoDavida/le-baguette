<template>
  <p v-if="pending">Loading...</p>
  <div v-else>
    <div class="flex flex-col w-24">
      <img src="" alt="" />
      <h1>{{ data?.userProfile.username }}</h1>
      <span>karma = {{ data?.karma }}</span>
      <span>followers = {{ data?.followers.length }}</span>
      <div v-if="!isMe">
        <button
          v-if="!data?.following"
          class="btn btn-primary"
          @click="followUser"
        >
          Follow
        </button>
        <button v-else class="btn btn-primary" @click="unFollowUser">
          unFollow
        </button>
      </div>
    </div>
    <div class="mt-10">
      <p>Subs</p>
      <div v-for="sub in data?.subs" :key="sub.sub_id.id" class="flex gap-4">
        <NuxtLink :to="'/le/' + sub.sub_id.id">le/{{ sub.sub_id.id }}</NuxtLink>
        <p>{{ sub.sub_id.title }}</p>
      </div>
      <div class="mt-10">
        <p>Posts</p>
        <div v-for="post in data?.posts" :key="post.id">
          <p>{{ post }}</p>
        </div>
      </div>
      <div class="mt-10">
        <p>Comments</p>
        <div v-for="comment in data?.comments" :key="comment.id">
          <p>{{ comment }}</p>
        </div>
      </div>
      <div v-if="isMe" class="mt-10">
        <p>Favorited</p>
        <div v-for="favorite in data?.favorited" :key="favorite.id">
          <p>{{ favorite }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const id = route.params.id

const client = useSupabaseClient()
const user = useSupabaseUser()

let isMe = false
if (user && user.value) {
  isMe = id === user.value.id
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

  let res = await client
    .from("followers")
    .select()
    .eq("user_id", id)
    .eq("follower", user.value.id)
    .single()

  let following = false
  if (!res.error) {
    following = true
  }

  let { data: followers } = await client
    .from("followers")
    .select()
    .eq("user_id", id)

  let { data: favorited } = await client
    .from("fAVORITEDpOSTS")
    .select("*, post_id(user_id(username))")
    .eq("user_id", id)

  let { data: comments } = await client
    .from("comments")
    .select("*, user_id(username)")
    .eq("user_id", id)

  let { data: subs } = await client
    .from("submembers")
    .select("sub_id(id, title)")
    .eq("user_id", id)

  let { data: userProfile } = await client
    .from("userdata")
    .select()
    .eq("id", id)
    .single()

  let { data: postVotes } = await client
    .from("votes-posts")
    .select("value, post_id(user_id)")
    .eq("post_id.user_id", id)
  postVotes = postVotes.filter((item) => item.post_id !== null)

  let { data: commentVotes } = await client
    .from("votes-")
    .select("value, comment_id(user_id)")
    .eq("comment_id.user_id", id)
  commentVotes = commentVotes.filter((item) => item.comment_id !== null)

  let allVotes = [
    ...commentVotes.map((item) => item.value),
    ...postVotes.map((item) => item.value),
  ]

  let upvotes = allVotes.filter((item) => item > 0).length
  let downvotes = allVotes.filter((item) => item < 0).length
  let karma = upvotes - downvotes

  return {
    posts,
    comments,
    following,
    followers,
    favorited,
    subs,
    userProfile,
    karma,
  }
})

const followUser = async () => {
  if (!user.value) return

  let res = await client.from("followers").insert({
    user_id: id,
    follower: user.value.id,
  })
  console.log(res)
  window.location.reload()
}
const unFollowUser = async () => {
  if (!user.value) return
  let res = await client
    .from("followers")
    .delete()
    .eq("user_id", id)
    .eq("follower", user.value.id)
  console.log(res)
  window.location.reload()
}
</script>
