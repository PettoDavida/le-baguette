<template>
    <div class="flex flex-row justify-center mt-4 mb-4">
        <div class="flex flex-row justify-center bg-white rounded-lg max-w-md">
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
                <div class="flex flex-row gap-4"><span class="material-symbols-outlined text-black cursor-pointer">
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
  
  <script>
  
  
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
  