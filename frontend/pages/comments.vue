<template>
    <div class="flex flex-col justify-center items-center">
          <post
            v-for="postProperties in postPropsArray"
            v-bind:key="postProperties.textContent"
            :postProperties = postProperties
          />
          <h2 class="text-white text-start">Comments: </h2>
          <comment
            v-for="commentProperties in commentPropsArray"
            v-bind:key="commentProperties.id"
            :commentProperties = commentProperties
          />
    </div>
  </template>
  
<script>
  import subscribedThreadsVue from '~~/components/subscribedThreads.vue';

export default{
  components:{
    subscribedThreadsVue
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
      ],
      commentPropsArray:[
        {
            user: "u/Körner",
            textContent: "Uddevalla",
            id:0,
        },
        {
            user: "u/Edwin",
            textContent: "Örebro",
            id:1,
        },
      ]
    }
  }
}


</script>
