<template>
  <p v-if="pending">Loading...</p>
  <div v-else class="flex flex-col items-center">
    <div class="flex flex-col w-72">
      <img src="" alt="" />
      <h1 class="text-white">u/{{ data?.userProfile.username }}</h1>
      <span class="text-white">karma = {{ data?.karma }}</span>
      <span class="text-white">followers = {{ data?.followers.length }}</span>
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
    <div class="overflow-hidden bg-slate-100 flex justify-evenly w-fit">
      <button
        class="bg-slate-100 px-3 py-4"
        :class="{ 'bg-red-500': selectedTab === 'posts' }"
        @click="openTab('posts')"
      >
        Posts
      </button>
      <button
        class="bg-slate-100 px-3 py-4"
        :class="{ 'bg-red-500': selectedTab === 'comments' }"
        @click="openTab('comments')"
      >
        Comments
      </button>
      <button
        class="bg-slate-100 px-3 py-4"
        :class="{ 'bg-red-500': selectedTab === 'subs' }"
        @click="openTab('subs')"
      >
        Subs
      </button>
      <button
        v-if="isMe"
        class="bg-slate-100 px-3 py-4"
        :class="{ 'bg-red-500': selectedTab === 'favorited' }"
        @click="openTab('favorited')"
      >
        Favorited
      </button>
    </div>
    <div v-if="selectedTab === 'subs'" id="subs" class="mt-4">
      <div
        v-for="sub in data?.subs"
        :key="sub.sub_id.id"
        class="flex gap-4 text-white"
      >
        <NuxtLink class="mb-2" :to="'/le/' + sub.sub_id.id"
          >le/{{ sub.sub_id.id }} {{ sub.sub_id.title }}</NuxtLink
        >
      </div>
    </div>

    <div v-if="selectedTab === 'posts'" id="posts">
      <div
        v-for="post in data?.posts"
        :key="post.id"
        class="mt-4 w-full sm:w-[36rem] lg:w-[40rem]"
      >
        <Post
          :id="post.id || 'Error'"
          :key="post.id"
          :title="post.title || 'Error'"
          :content="post.content || 'Error'"
          :sub="post.sub_id.id || 'Error'"
          :creator="post.user_id.username || 'Error'"
        />
      </div>
    </div>

    <div v-if="selectedTab === 'comments'" id="comments">
      <div
        v-for="comment in data?.comments"
        :key="comment.id"
        class="mt-4 w-fit"
      >
        <Comment
          :id="comment.id || 'Error'"
          :content="comment.content || 'Error'"
          :creator="comment.user_id.username || 'Error'"
          :sub-id="post?.sub_id.id || 'Error'"
        />
      </div>
    </div>

    <div v-if="selectedTab === 'favorited'" id="favorited">
      <div
        v-for="favorites in data?.favorited"
        :key="favorites.id"
        class="mt-4 w-full sm:w-[36rem] lg:w-[40rem]"
      >
        <Post
          :id="favorites?.post_id.id || 'Error'"
          :key="favorites?.post_id.id"
          :title="favorites?.post_id.title || 'Error'"
          :content="favorites?.post_id.content || 'Error'"
          :sub="favorites?.post_id.sub_id.id || 'Error'"
          :creator="favorites?.post_id.user_id.username || 'Error'"
        />
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
    .select("*,sub_id(id), user_id(username)")
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

  let following = res.data.length > 0

  let { data: followers } = await client
    .from("followers")
    .select()
    .eq("user_id", id)

  let { data: favorited } = await client
    .from("fAVORITEDpOSTS")
    .select("post_id(*, user_id(username), sub_id(id))")
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

const selectedTab = ref("posts")

const openTab = (tabName) => {
  selectedTab.value = tabName
}
</script>
