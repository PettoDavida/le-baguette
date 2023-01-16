<template>
  <p v-if="pending">Loading...</p>
  <div v-else>
    <h1>Sub: {{ data?.sub.title }}</h1>
    <h1>ID: {{ data?.sub.id }}</h1>

    <button
      v-if="isOwner(user?.id || '')"
      class="btn btn-primary"
      @click="deleteSub"
    >
      Delete Sub
    </button>

    <button
      v-if="!isMember(user?.id || '')"
      class="btn btn-primary"
      @click="joinSub"
    >
      Join Sub
    </button>

    <button
      v-if="isMember(user?.id || '')"
      class="btn btn-primary"
      @click="leaveSub"
    >
      Leave Sub
    </button>

    <p>Members:</p>
    <div v-for="member in data?.members" :key="member.id" class="flex gap-1">
      <p>Username: {{ member.user_id.username }}</p>
      <p v-if="isOwner(member.user_id.id)">(OWNER)</p>
      <p v-if="isMod(member.user_id.id)">(MOD)</p>

      <button
        v-if="
          isCurrentUserOwner() &&
          isMod(member.user_id.id) &&
          !isOwner(member.user_id.id)
        "
        class="btn btn-primary"
        @click="makeUserOwner(member.user_id.id)"
      >
        Make Owner
      </button>

      <button
        v-if="isCurrentUserOwner() && !isMod(member.user_id.id)"
        class="btn btn-primary"
        @click="makeUserMod(member.user_id.id)"
      >
        Make Mod
      </button>

      <button
        v-if="isCurrentUserOwner() && isMod(member.user_id.id)"
        class="btn btn-primary"
        @click="removeUserMod(member.user_id.id)"
      >
        Kill Mod
      </button>
    </div>

    <div class="mt-10">
      <p class="text-2xl mb-5">Posts</p>
      <div
        v-for="post in data?.posts"
        :key="post.id"
        class="flex items-center gap-10"
      >
        <Post
          :id="post.id || 'Error'"
          :title="post.title || 'Error'"
          :content="post.content || 'Error'"
          :sub="post.sub_id.title || 'Error'"
          :creator="post.user_id.username || 'Error'"
        />
        <button class="btn btn-primary" @click="deletePost(post.id)">
          Delete Post
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Post from "~/components/Post"

const route = useRoute()
const router = useRouter()

const client = useSupabaseClient()
const user = useSupabaseUser()

let id = route.params.id

type Sub = {
  id: string
  title: string
  owner: User
}

type Mod = {
  id: string
  user_id: string
  sub_id: string
}

type User = {
  id: string
  username: string
}

type Member = {
  id: string
  user_id: User
  sub_id: string
}

type Post = {
  id: string
  title: string
  content: string
  user_id: User
  sub_id: Sub
}

type Data = {
  sub: Sub
  members: Member[]
  mods: Mod[]
  posts: Post[]
}

const fetchPosts = async (sub_id: string) => {
  let { data: posts } = await client
    .from("posts")
    .select("*, user_id(username), sub_id(title)")
    .eq("sub_id", sub_id)

  return posts as Post[]
}

const fetchMembers = async (sub_id: string) => {
  let { data: members } = await client
    .from("submembers")
    .select("*, user_id(id, username)")
    .eq("sub_id", sub_id)

  return members as Member[]
}

const fetchMods = async (sub_id: string) => {
  let { data: mods } = await client
    .from("submods")
    .select()
    .eq("sub_id", sub_id)

  return mods as Mod[]
}

let { data, pending } = useAsyncData(async () => {
  let { data: subData, error } = await client
    .from("subs")
    .select("*, owner(id, username)")
    .eq("id", id)
    .single()

  if (error) return null

  let sub = subData as unknown as Sub

  let members = await fetchMembers(sub.id)
  let mods = await fetchMods(sub.id)
  let posts = await fetchPosts(sub.id)

  return { sub, members, mods, posts } as Data
})

const isMember = (user_id: string) => {
  if (data.value) {
    return (
      data.value.members.findIndex((item) => item.user_id.id === user_id) !== -1
    )
  }

  return false
}

const isOwner = (user_id: string) => {
  if (data.value) {
    return data.value.sub.owner.id === user_id
  }

  return false
}

const isCurrentUserOwner = () => {
  if (user.value) return isOwner(user.value.id)
  return false
}

const isMod = (user_id: string) => {
  if (data.value) {
    return data.value.mods.findIndex((item) => item.user_id === user_id) !== -1
  }

  return false
}

const deleteSub = async () => {
  // TODO: Handle errors
  let res = await client.from("submembers").delete().eq("sub_id", id)
  console.log("Delete Submembers", res)

  res = await client.from("submods").delete().eq("sub_id", id)
  console.log("Delete Submods", res)

  res = await client.from("posts").delete().eq("sub_id", id)
  console.log("Delete Posts", res)

  res = await client.from("subs").delete().eq("id", id)
  console.log("Delete Sub", res)

  router.replace("/")
}

const joinSub = async () => {
  if (user.value) {
    let obj = {
      user_id: user.value.id,
      sub_id: id,
    } as never

    // TODO: Handle errors
    let res = await client.from("submembers").insert([obj])
    console.log("Join Sub", res)
  }
}

const leaveSub = async () => {
  // TODO: Handle errors

  if (!user.value) return
  if (!data.value) return

  let sub = data.value.sub

  if (isCurrentUserOwner()) {
    if (!data.value.sub) return

    let mods = await fetchMods(sub.id)
    mods = mods.filter((item) => item.user_id !== sub.owner.id)

    let newOwner: string | undefined = undefined

    if (mods.length > 0) {
      console.log("Picking from mods")
      newOwner = mods[0].user_id
    } else {
      let members = await fetchMembers(sub.id)
      members = members.filter((item) => item.user_id.id !== sub.owner.id)
      console.log(members)

      if (members.length > 0) {
        console.log("Picking from members")
        newOwner = members[0].user_id.id
      }
    }

    console.log("New Owner", newOwner)

    if (newOwner === undefined) {
      await deleteSub()
      router.replace("/")
      return
    } else {
      let res = await client
        .from("submembers")
        .delete()
        .eq("user_id", user.value.id)
        .eq("sub_id", sub.id)
      console.log("Delete Members", res)

      res = await client
        .from("submods")
        .delete()
        .eq("user_id", user.value.id)
        .eq("sub_id", sub.id)
      console.log("Delete Subs", res)

      await makeUserOwner(newOwner)
    }
  }
}

const makeUserMod = async (user_id: string) => {
  if (!isCurrentUserOwner()) return

  let res = await client
    .from("submods")
    .insert({ user_id, sub_id: id } as never)
  console.log("Make User Mod", res)
}

const removeUserMod = async (user_id: string) => {
  if (!isCurrentUserOwner()) return

  let res = await client
    .from("submods")
    .delete()
    .eq("user_id", user_id)
    .eq("sub_id", id)
  console.log("Remove User Mod", res)
}

const makeUserOwner = async (user_id: string) => {
  if (!isCurrentUserOwner()) return

  let res = await client
    .from("subs")
    .update({ owner: user_id } as never)
    .eq("id", id)
  console.log(res)
}

const deletePost = async (post_id: string) => {
  let res = await client.from("comments").select().eq("post_id", post_id)
  if (res.data) {
    for (const comment of res.data) {
      await client
        .from("votes")
        .delete()
        .eq("comment_id", (comment as any).id)
    }
  }

  await client.from("comments").delete().eq("post_id", post_id)
  await client.from("votes").delete().eq("post_id", post_id)
  await client.from("posts").delete().eq("id", post_id)
}
</script>
