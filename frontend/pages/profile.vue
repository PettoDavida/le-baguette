<template>
    <div  class="flex flex-row justify-around items-start">
        <section class="flex justify-center items-center flex-col w-1/3">
            <h2 class="text-white text-center">Subscribed threads: </h2>
            <SubscribedThreads
                v-for="threadProperties in threadPropsArray"
                v-bind:key="threadProperties.threadName"
                :threadProperties = threadProperties
            />
        </section>
        <section class="flex justify-center items-center flex-col w-1/3">
            <Post/>
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
          threadImage: "../public/images/baguette.jpg",
          threadName: "r/Sweden",
        },
        {
          threadImage: "../public/images/baguette.jpg",
          threadName: "r/Norway",
        },
      ],
      badgePropsArray:[
        {
            badgeImage: "../public/images/baguette.jpg",
            badgeName: "Körner",
            bio: "AAAAAA AAA aa a a a aa A AAAAAA  "
        }
      ]
    }
  }
}
</script>

  <script setup>
    // if(!user.isLoggedIn){
    //     router.replace("/login")
    // }
  </script>
  