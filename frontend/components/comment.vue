<template>
    <div :key="id" class="flex flex-row justify-center mt-4 mb-4 w-full">
        <div class="flex flex-row justify-start bg-white rounded-lg w-1/4">
            <div class="flex flex-col justify-center items-center mx-4">
                <div class="flex flex-row gap-4"><p>{{commentProperties.user}}</p></div>
                <div class=""><h2 class="font-bold max-w-xs break-words">{{commentProperties.textContent}}</h2></div>
            </div>
        </div>
    </div>
</template>

<script>
  
  
  export default {
    name: 'comment',
    components: {
    },
    props: {
      commentProperties: Object,
    },
    data() {
        return{
            commentProps: this.commentProperties
        }
    },
  }
  </script>