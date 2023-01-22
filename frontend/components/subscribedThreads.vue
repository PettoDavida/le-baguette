<template>
    <div class="flex flex-row justify-center mt-4 mb-4">
        <div class="flex flex-row justify-center bg-white rounded-lg">
            <div class="flex flex-row justify-around gap-4 items-center mx-4 py-4 px-4">
                <img class="w-12 " :src="threadProperties.threadImage" alt="subImage">
                <div class=""><h2 class="font-bold">{{threadProperties.threadName}}</h2></div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  
  
  export default {
    name: 'subscribed-threads',
    components: {
    },
    props: {
      threadProperties: Object,
    },
    data() {
        return{
            threadProps: this.threadProperties
        }
    },
  }
  </script>