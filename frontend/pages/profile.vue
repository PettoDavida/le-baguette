<template>
    <div class="flex flex-row justify-around items-start">
        <section class="flex justify-center items-center flex-col w-1/3">
            <h2 class="text-white text-center">Subscribed threads: </h2>
            <SubscribedThreads
                v-for="threadProperties in threadPropsArray"
                v-bind:key="threadProperties.threadName"
                :threadProperties = threadProperties
            />
        </section>
        <section class="flex justify-center items-center flex-col w-1/3">
          <post
            v-for="postProperties in postPropsArray"
            v-bind:key="postProperties.textContent"
            :postProperties = postProperties
          />
        </section>
        <section class="flex justify-center items-center flex-col w-1/3">
            <ProfileBadge
                v-for="badgeProperties in badgePropsArray"
                v-bind:key="badgeProperties.badgeName"
                :badgeProperties = badgeProperties
            />
        </section>
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
      threadPropsArray:[
        {
          threadImage: "https://riksarkivet.se/Media/Bilder/heraldik/flagga_small.gif",
          threadName: "r/Sweden",
        },
        {
          threadImage: "https://www.varldensflaggor.se/bilder/original/norges-flagga.png",
          threadName: "r/Norway",
        },
      ],
      badgePropsArray:[
        {
            badgeImage: "https://riksarkivet.se/Media/Bilder/heraldik/flagga_small.gif",
            badgeName: "Körner",
            bio: "AAAAAA AAA aa a a a aa A AAAAAA  "
        }
      ],
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

// if(!user.isLoggedIn){
    //     router.replace("/login")
    // }
</script>
  