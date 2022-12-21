<template>
  <div v-if="sub">
    <h1>Sub: {{ sub.title }}</h1>
    <h1>ID: {{ sub.id }}</h1>
    <div>
      <button v-if="isOwner" class="btn btn-primary" @click="deleteSub">
        Delete Sub
      </button>

      <button v-if="!isMember" class="btn btn-primary" @click="joinSub">
        Join Sub
      </button>

      <div>
        <p>Owner: {{ sub.owner }}</p>
        <p>Members</p>
        <div
          v-for="member in members"
          :key="member.userID"
          class="flex items-center gap-4"
        >
          <p>{{ member.userID }}</p>
          <p v-if="isUserMod(member.userID)">MOD</p>
          <button
            v-if="isOwner && !isUserMod(member.userID)"
            class="btn btn-primary"
            @click="makeUserMod(member.userID)"
          >
            Make Mod
          </button>
          <button
            v-if="isOwner && isUserMod(member.userID)"
            class="btn btn-primary"
            @click="removeUserMod(member.userID)"
          >
            Kill Mod
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const client = useSupabaseClient()
const user = useSupabaseUser()

let id = route.params.id

const { data: sub } = await client.from("subs").select().eq("id", id).single()
const { data: members } = await client
  .from("submembers")
  .select()
  .eq("subID", sub.id)

let isOwner = user.value.id === sub.owner
let isMod = sub.mods
  ? sub.mods.findIndex((item) => item === user.value.id) !== -1
  : false

let isMember = members.findIndex((item) => item.userID === user.value.id) !== -1
isMember = isMember || isOwner

const isUserMod = (userID) => {
  if (!sub.mods) return false

  return sub.mods.findIndex((item) => item === userID) !== -1
}

const deleteSub = async () => {
  // TODO: Handle errors
  let res = await client.from("subs").delete().eq("id", id)
  console.log(res)
  router.replace("/")
}

const joinSub = async () => {
  // TODO: Handle errors
  let res = await client
    .from("submembers")
    .insert({ userID: user.value.id, subID: id, mod: true })
  console.log(res)
}

const makeUserMod = async (userID) => {
  // TODO: Handle errors
  let { data: old } = await client
    .from("subs")
    .select("mods")
    .eq("id", id)
    .single()
  let mods = old.mods || []

  for (let mod of mods) {
    if (mod === userID) {
      return
    }
  }

  // TODO: Handle errors
  let res = await client
    .from("subs")
    .update({ mods: [...mods, userID] })
    .eq("id", id)
  console.log(res)
}

const removeUserMod = async (userID) => {
  // TODO: Handle errors
  let { data: old } = await client
    .from("subs")
    .select("mods")
    .eq("id", id)
    .single()
  let mods = old.mods || []

  let newModList = mods.filter((item) => item !== userID)

  // TODO: Handle errors
  let res = await client
    .from("subs")
    .update({ mods: [...newModList] })
    .eq("id", id)
  console.log(res)
}
</script>
