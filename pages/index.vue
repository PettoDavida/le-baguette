<template>
  <div class="flex justify-center relative">
    <div v-if="user" class="flex flex-col">
      <select
        class="my-2 block py-2.5 px-0 w-fit text-sm bg-transparent border-0 border-b-2 border-gray-200 appearance-none text-white dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
        @change="setShownPosts"
      >
        <option class="text-black" value="popular">Popular Posts</option>
        <option class="text-black" value="home">Sub Posts</option>
      </select>

      <div v-if="selected === 'home'">
        <Post
          v-for="post in subPosts"
          :id="post.id || 'Error'"
          :key="post.id"
          :title="post.title || 'Error'"
          :content="post.content || 'Error'"
          :sub="post.sub_id || 'Error'"
          :creator="post.user_id.username || 'Error'"
        />
      </div>
      <div v-else>
        <Post
          v-for="post in allPosts"
          :id="post.id || 'Error'"
          :key="post.id"
          :title="post.title || 'Error'"
          :content="post.content || 'Error'"
          :sub="post.sub_id || 'Error'"
          :creator="post.user_id.username || 'Error'"
        />
      </div>
    </div>
    <div v-else class="flex flex-col">
      <p
        class="my-2 block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 appearance-none text-white dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
      >
        Posts
      </p>
      <Post
        v-for="post in allPosts"
        :id="post.id || 'Error'"
        :key="post.id"
        :title="post.title || 'Error'"
        :content="post.content || 'Error'"
        :sub="post.sub_id || 'Error'"
        :creator="post.user_id.username || 'Error'"
      />
    </div>
    <div v-if="user" class="hidden md:block ml-8">
      <select
        class="my-2 block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 appearance-none text-white dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
        @change="setShownSubs"
      >
        <option class="text-black" value="followed">Joined Subs</option>
        <option class="text-black" value="popular">Popular Subs</option>
      </select>

      <div v-if="selectedSub === 'followed'" class="text-white">
        <div v-for="sub in followedSubs" :key="sub.id">
          <NuxtLink :to="'/le/' + sub.id"> le/{{ sub.id }}</NuxtLink>
        </div>
      </div>
      <div v-else class="text-white">
        <div v-for="sub in subs" :key="sub.id">
          <NuxtLink :to="'/le/' + sub.id"> le/{{ sub.id }}</NuxtLink>
        </div>
      </div>
    </div>
    <div v-else class="hidden md:block ml-8 text-white">
      <p
        class="my-2 block py-2.5 px-0 text-sm bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
      >
        Subs
      </p>
      <div
        v-for="sub in subs"
        :key="sub.id"
        class="block py-2.5 px-0 w-full text-sm bg-transparent appearance-none focus:outline-none focus:ring-0 peer"
      >
        <NuxtLink :to="'/le/' + sub.id"> le/{{ sub.id }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()

const user = useSupabaseUser()

const selected = ref("popular")

const setShownPosts = async (event) => {
  selected.value = event.target.value
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

const { data: subPosts } = await useAsyncData("subPosts", async () => {
  let { data: subMembers } = await client
    .from("submembers")
    .select()
    .eq("user_id", user.value.id)
  let subs = subMembers.map((item) => item.sub_id)
  let { data: posts } = await client
    .from("posts")
    .select("*, user_id(username)")
    .in("sub_id", subs)
  return posts
})

const { data: allPosts } = await useAsyncData("allSubPosts", async () => {
  let { data: posts } = await client
    .from("posts")
    .select("*, user_id(username)")
  return posts
})
</script>
