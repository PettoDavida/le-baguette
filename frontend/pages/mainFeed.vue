<template>
    <div  class="flex flex-col justify-center items-center">
        <post
            v-for="postProperties in postPropsArray"
            v-bind:key="postProperties.textContent"
            :postProperties = postProperties
        />
    </div>
  </template>
  
<script>
    export default{
  components:{
    
  },
  data(){
    return{
      postPropsArray:[
        {
          upVotes: "139",
          thread: "r/sweden",
          user: "Körner",
          timePosted: "Today: 14:19",
          textContent: "Vilken är den fulaste staden i sverige?",

        },
        {
          upVotes: "530",
          thread: "r/norway",
          user: "Körner",
          timePosted: "Today: 14:23",
          textContent: "Varför är Sverige mycket bättre än Norge?",

        },
      ],
    }
  }
}
</script>