<template>
    <div class="flex flex-row justify-center mt-4 mb-4 max-w-sm">
        <div class="flex flex-row justify-center bg-white rounded-lg">
            <div class="flex flex-col justify-around gap-4 items-center mx-4 py-4 px-4">
                <img class="w-12 " :src="badgeProperties.badgeImage" alt="profileImage">
                <div class=""><h2 class="font-bold">Användarnamn: <p>u/{{badgeProperties.badgeName}}</p></h2></div>
                <h2>Biografi:</h2>
                <p class="w-1/2">{{ badgeProperties.bio }}</p>
                <button class="btn btn-primary">Redigera profil</button>
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
      badgeProperties: Object,
    },
    data() {
        return{
            badgeProps: this.badgeProperties
        }
    },
  }
  </script>