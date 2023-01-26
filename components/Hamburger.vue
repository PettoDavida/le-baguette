<template>
  <div class="flex flex-row-reverse px-4">
    <button class="hamburger" type="button" @click="menuOpen = !menuOpen">
      <span class="material-symbols-outlined text-white"> menu </span>
    </button>

    <div
      v-if="user"
      class="row dropdown"
      :class="{ 'dropdown-after': menuOpen }"
    >
      <div class="mb-12 text-center">
        <p>u/{{ profileName }}</p>
        <p
          class="hover:cursor-pointer m-4"
          @click="logout() && (menuOpen = !menuOpen)"
        >
          Logout
        </p>
      </div>

      <ul class="navlist">
        <li class="navlistitem">
          <NuxtLink to="/newpost" class="" @click="menuOpen = !menuOpen"
            >New Post</NuxtLink
          >
        </li>
        <li class="navlistitem">
          <NuxtLink to="/createsub" class="" @click="menuOpen = !menuOpen"
            >Create Sub</NuxtLink
          >
        </li>
        <li class="navlistitem">
          <button
            class="btn btn-primary"
            @click="gotoProfile() && (menuOpen = !menuOpen)"
          >
            Profile
          </button>
        </li>
      </ul>
      <div>
        <select
          class="my-2 block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
          @change="setShownSubs"
        >
          <option value="followed">Joined Subs</option>
          <option value="popular">Popular Subs</option>
        </select>

        <div
          v-if="selectedSub === 'followed'"
          class="text-black overflow-scroll"
        >
          <div v-for="sub in followedSubs" :key="sub.id">
            <NuxtLink :to="'/le/' + sub.id"> le/{{ sub.id }}</NuxtLink>
          </div>
        </div>
        <div v-else class="text-black overflow-scroll">
          <div v-for="sub in subs" :key="sub.id">
            <NuxtLink :to="'/le/' + sub.id" @click="menuOpen = !menuOpen">
              le/{{ sub.id }}</NuxtLink
            >
          </div>
        </div>
      </div>
    </div>
    <div v-else class="row dropdown" :class="{ 'dropdown-after': menuOpen }">
      <div class="text-white">
        <p
          class="my-2 block py-2.5 px-0 text-sm bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
        >
          Subs
        </p>
        <div
          v-for="sub in subs"
          :key="sub.id"
          class="block py-2.5 px-0 w-full text-sm bg-transparent appearance-none focus:outline-none focus:ring-0 peer overflow-scroll"
        >
          <NuxtLink :to="'/le/' + sub.id"> le/{{ sub.id }}</NuxtLink>
        </div>
      </div>
      <ul class="navlist">
        <li class="navlistitem">
          <NuxtLink to="/login" class="" @click="menuOpen = !menuOpen"
            >Log in</NuxtLink
          >
        </li>
        <li class="navlistitem">
          <NuxtLink to="/register" class="" @click="menuOpen = !menuOpen"
            >Register</NuxtLink
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  profileName: {
    type: String,
    required: true,
  },
})
const router = useRouter()

const client = useSupabaseAuthClient()
const user = useSupabaseUser()

const logout = async () => {
  await client.auth.signOut()

  router.replace("/")
}

const gotoProfile = async () => {
  router.push(`/profile/${user.value.id}`)
}

const selectedSub = ref("followed")

const setShownSubs = async (event) => {
  selectedSub.value = event.target.value
}

const { data: subs } = await useAsyncData("subs", async () => {
  const { data } = await client.from("subs").select()
  return data
})

const { data: followedSubs } = await useAsyncData("joinedSubs", async () => {
  let { data: subMembers } = await client
    .from("submembers")
    .select()
    .eq("user_id", user.value.id)
  let subs = subMembers.map((item) => item.sub_id)
  const { data } = await client.from("subs").select().in("id", subs)
  return data
})
</script>

<script>
export default {
  name: "hamburger",
  data() {
    return {
      menuOpen: false,
    }
  },
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");

.dropdown {
  padding-top: 3rem;
  width: 0;
  height: 0px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-after {
  position: absolute;
  top: 5rem;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100% - 5rem);
  width: 100%;
  transition: height 0.2s ease;
  z-index: 1000;
}

.navlist {
  list-style: none;
}

.navlistitem {
  text-transform: uppercase;
  text-align: center;
  padding: 20px;
}

.navlistitem a {
  color: black;
}
</style>
