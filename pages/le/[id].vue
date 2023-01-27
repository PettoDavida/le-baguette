<template>
  <p v-if="pending">Loading...</p>
  <div v-else>
    <div class="flex flex-col items-center">
      <div
        class="flex flex-col shadow-lg bg-white rounded-b-lg py-8 px-12 w-full justify-around h-min"
      >
        <div class="flex h-min">
          <div>
            <h1 class="text-4xl">{{ data?.sub.title }}</h1>
            <h2 class="">le/{{ data?.sub.id }}</h2>
          </div>
          <div class="ml-6">
            <button
              v-if="!isMember(user?.id || '')"
              class="btn btn-primary"
              @click="joinSub"
            >
              Join
            </button>

            <button
              v-if="isMember(user?.id || '')"
              class="btn btn-primary"
              @click="leaveSub"
            >
              Leave
            </button>
          </div>
          <p v-if="isCurrentUserBanned()">You are banned from this group</p>
        </div>
        <div class="flex flex-col">
          <div v-if="isCurrentUserOwner()" class="overflow-scroll">
            <h3 class="mb-4 mt-4">Members</h3>
            <div class="flex flex-col">
              <div
                v-for="member in getMembers()"
                :key="member.id"
                class="flex my-1"
              >
                <NuxtLink :to="`/profile/${member.user_id.id}`">{{
                  member.user_id.username
                }}</NuxtLink>
                <p v-if="isOwner(member.user_id.id)"><Owner /></p>
                <p
                  v-if="isMod(member.user_id.id) && !isOwner(member.user_id.id)"
                >
                  <Mod />
                </p>
                <div>
                  <button
                    v-if="
                      isCurrentUserOwner() &&
                      isMod(member.user_id.id) &&
                      !isOwner(member.user_id.id)
                    "
                    class="btn btn-primary"
                    @click="makeUserOwner(member.user_id.id)"
                  >
                    Transfer Ownership
                  </button>

                  <button
                    v-if="isCurrentUserOwner() && !isMod(member.user_id.id)"
                    class="btn btn-primary"
                    @click="makeUserMod(member.user_id.id)"
                  >
                    Mod
                  </button>

                  <button
                    v-if="
                      isCurrentUserOwner() &&
                      isMod(member.user_id.id) &&
                      !isOwner(member.user_id.id)
                    "
                    class="btn btn-primary"
                    @click="removeUserMod(member.user_id.id)"
                  >
                    Unmod
                  </button>

                  <button
                    v-if="
                      (isCurrentUserOwner() && !isOwner(member.user_id.id)) ||
                      (isCurrentUserMod() && !isMod(member.user_id.id))
                    "
                    class="btn btn-primary"
                    @click="banUser(member.user_id.id)"
                  >
                    Ban
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p v-if="isCurrentUserOwner()" class="mt-10">Banned</p>
            <div v-if="isCurrentUserOwner()">
              <p v-if="getBannedUsers().length <= 0">No Banned Users</p>
              <div v-for="member in getBannedUsers()" :key="member.id">
                <NuxtLink :to="`/profile/${member.user_id.id}`">{{
                  member.user_id.username
                }}</NuxtLink>

                <button
                  v-if="isCurrentUserOwner()"
                  class="btn btn-primary"
                  @click="removeUserBan(member.user_id.id)"
                >
                  Unban
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          v-if="isOwner(user?.id || '')"
          class="btn btn-primary"
          @click="deleteSub"
        >
          Delete
        </button>
      </div>
      <div class="mt-10 flex flex-col justify-center items-start">
        <p class="text-2xl mb-5 text-white text-center w-full">Posts</p>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Owner from "vue-material-design-icons/Crown.vue"
import Mod from "vue-material-design-icons/StarCircleOutline.vue"

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

let { data, pending } = useAsyncData("specSubPosts", async () => {
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
</script>
