<template>
  <p v-if="pending">Loading...</p>
  <div v-else>
    <div
      class="flex flex-col md:flex-row justify-around gap-12 items-center md:items-start mt-4"
    >
      <div
        class="flex shadow-lg bg-white rounded-lg py-8 px-12 w-full justify-between"
      >
        <div>
          <p v-if="isCurrentUserBanned()">You are banned</p>

          <h1 class="mb-4">Sub: {{ data?.sub.title }}</h1>
          <h2 class="mb-4">ID: {{ data?.sub.id }}</h2>

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
        </div>
        <div class="overflow-scroll h-full">
          <h3 class="mb-4 mt-4">Members:</h3>
          <div class="flex flex-col">
            <div
              v-for="member in getMembers()"
              :key="member.id"
              class="flex my-1"
            >
              <NuxtLink :to="`/profile/${member.user_id.id}`">{{
                member.user_id.username
              }}</NuxtLink>
              <p v-if="isOwner(member.user_id.id)">!</p>
              <p v-if="isMod(member.user_id.id)">*</p>

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

              <button
                v-if="
                  (isCurrentUserOwner() && !isOwner(member.user_id.id)) ||
                  (isCurrentUserMod() && !isMod(member.user_id.id))
                "
                class="btn btn-primary"
                @click="banUser(member.user_id.id)"
              >
                Ban User
              </button>
            </div>
          </div>
        </div>

        <p v-if="isCurrentUserOwner()" class="mt-10">Banned Members</p>
        <div v-if="isCurrentUserOwner()">
          <div v-for="member in getBannedUsers()" :key="member.id">
            <NuxtLink :to="`/profile/${member.user_id.id}`">{{
              member.user_id.username
            }}</NuxtLink>

            <button
              v-if="isCurrentUserOwner()"
              class="btn btn-primary"
              @click="removeUserBan(member.user_id.id)"
            >
              Unban User
            </button>
          </div>
        </div>
      </div>
      <div class="mt-10 flex flex-col justify-center items-center">
        <p class="text-2xl mb-5 text-white">Posts</p>
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
          <button
            v-if="isCurrentUserOwner()"
            class="btn btn-primary"
            @click="deletePost(post.id)"
          >
            Delete Post
          </button>
        </div>
      </div>
      <div class=""></div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const client = useSupabaseClient()
const user = useSupabaseUser()

let id = route.params.id

const fetchPosts = async (sub_id) => {
  let { data: posts } = await client
    .from("posts")
    .select("*, user_id(username), sub_id(title)")
    .eq("sub_id", sub_id)

  return posts
}

const fetchMembers = async (sub_id) => {
  let { data: members } = await client
    .from("submembers")
    .select("*, user_id(id, username)")
    .eq("sub_id", sub_id)

  return members
}

const fetchMods = async (sub_id) => {
  let { data: mods } = await client
    .from("submods")
    .select()
    .eq("sub_id", sub_id)

  return mods
}

const fetchBannedUsers = async (sub_id) => {
  let { data: users } = await client
    .from("bannedusers")
    .select("*, user_id(id, username)")
    .eq("sub_id", sub_id)

  return users
}

let { data, pending } = useAsyncData(async () => {
  let { data: subData, error } = await client
    .from("subs")
    .select("*, owner(id, username)")
    .eq("id", id)
    .single()

  if (error) return null

  let sub = subData

  let members = await fetchMembers(sub.id)
  let mods = await fetchMods(sub.id)
  let posts = await fetchPosts(sub.id)
  let bannedUsers = await fetchBannedUsers(sub.id)

  return { sub, members, mods, posts, bannedUsers }
})

const isMember = (user_id) => {
  if (data.value) {
    return (
      data.value.members.findIndex((item) => item.user_id.id === user_id) !== -1
    )
  }

  return false
}

const isOwner = (user_id) => {
  if (data.value) {
    return data.value.sub.owner.id === user_id
  }

  return false
}

const isCurrentUserOwner = () => {
  if (user.value) return isOwner(user.value.id)
  return false
}

const isCurrentUserMod = () => {
  if (user.value) return isMod(user.value.id)
  return false
}

const isCurrentUserBanned = () => {
  if (user.value) return isUserBanned(user.value.id)
  return false
}

const isMod = (user_id) => {
  if (data.value) {
    return data.value.mods.findIndex((item) => item.user_id === user_id) !== -1
  }

  return false
}

const isUserBanned = (user_id) => {
  if (data.value) {
    return (
      data.value.bannedUsers.findIndex(
        (item) => item.user_id.id === user_id
      ) !== -1
    )
  }

  return false
}

const getBannedUsers = () => {
  if (data.value) {
    return data.value.bannedUsers
  }

  return []
}

const getMembers = () => {
  if (data.value) {
    return data.value.members.filter((item) => !isUserBanned(item.user_id.id))
  }

  return []
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
    }

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

    let newOwner = undefined

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

const makeUserMod = async (user_id) => {
  if (!isCurrentUserOwner()) return

  let res = await client.from("submods").insert({ user_id, sub_id: id })
  console.log("Make User Mod", res)
}

const removeUserMod = async (user_id) => {
  if (!isCurrentUserOwner()) return

  let res = await client
    .from("submods")
    .delete()
    .eq("user_id", user_id)
    .eq("sub_id", id)
  console.log("Remove User Mod", res)
}

const makeUserOwner = async (user_id) => {
  if (!isCurrentUserOwner()) return

  let res = await client.from("subs").update({ owner: user_id }).eq("id", id)
  console.log(res)
}

const banUser = async (user_id) => {
  if (!isCurrentUserOwner() || !isCurrentUserMod()) return

  let res = await client
    .from("submembers")
    .delete()
    .eq("user_id", user_id)
    .eq("sub_id", id)

  res = await client.from("bannedusers").insert({
    user_id,
    sub_id: id,
  })
  console.log(res)
}

const removeUserBan = async (user_id) => {
  let res = await client
    .from("bannedusers")
    .delete()
    .eq("user_id", user_id)
    .eq("sub_id", id)
  console.log(res)
}

const deletePost = async (post_id) => {
  let res = await client.from("comments").select().eq("post_id", post_id)
  if (res.data) {
    for (const comment of res.data) {
      await client.from("votes-").delete().eq("comment_id", comment.id)
    }
  }

  await client.from("comments").delete().eq("post_id", post_id)
  await client.from("votes-posts").delete().eq("post_id", post_id)
  await client.from("posts").delete().eq("id", post_id)
}
</script>
