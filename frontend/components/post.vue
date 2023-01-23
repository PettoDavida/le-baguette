<template>
    <div :key="postProperties.id" class="flex flex-row justify-center mt-4 mb-4 w-full">
            <div class="flex flex-row justify-start bg-white rounded-lg w-1/4">
                <div class="text-white rounded-lg p-2 h-full bgRedPrimary flex flex-col items-center justify-center">
                <span class="material-symbols-outlined text-white cursor-pointer">
                    expand_less
                </span>
                    <p>{{ postProperties.upVotes }}</p>
                <span class="material-symbols-outlined text-white cursor-pointer">
                    expand_more
                </span>
                </div>
                <div class="flex flex-col justify-center items-center mx-4">
                    <div class="flex flex-row gap-4"><p>{{postProperties.thread}}</p><p>{{postProperties.user}}</p><p>{{postProperties.timePosted}}</p></div>
                    <div class=""><h2 class="font-bold max-w-xs break-words">{{ postProperties.textContent }}</h2></div>
                    <div class="flex flex-row gap-4"><span class="material-symbols-outlined text-black cursor-pointer" v-on:click="rerouteComments">
                        comment
                    </span>
                    <span class="material-symbols-outlined text-black cursor-pointer">
                        bookmark
                    </span>
                </div>
                </div>
            </div>
    </div>
  </template>
  
  <script setup>
  
    import { useUserStore } from "~/stores/user"

    const user = useUserStore()
    const router = useRouter()
        const rerouteComments = () => {
            router.replace(`/comments/`)
        }
    </script>

  <script>
  const router = useRouter()
  export default {
    name: 'post',
    components: {
    },
    props: {
      postProperties: Object,
    },
    data() {
        return{
            postProps: this.postProperties
        }
    },
  }
  </script>

  <script setup>
    
</script>
  