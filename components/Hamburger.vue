<template>
    <div class="flex flex-row">
        <button class="hamburger" type="button" @click="menuOpen = !menuOpen">
            <span class="material-symbols-outlined text-white">
            menu
          </span>          
        </button>

  <div v-if="user" class="row dropdown" :class="{ 'dropdown-after' : menuOpen }">
    <ul class="navlist">
      <li class="navlistitem">
        <NuxtLink to="/newpost" class="" @click="menuOpen = !menuOpen">New Post</NuxtLink>
      </li>
      <li class="navlistitem">
        <NuxtLink to="/createsub" class="" @click="menuOpen = !menuOpen">Create Sub</NuxtLink>
      </li>
      <li class="navlistitem">
        <button class="btn btn-primary" @click="gotoProfile(); menuOpen = !menuOpen">
          Profile
        </button>
      </li>
      <li class="navlistitem">
        <button class="btn btn-primary" @click="logout(); (menuOpen = !menuOpen)">Logout</button>
      </li>
    </ul>
  </div>
  <div v-else class="row dropdown" :class="{ 'dropdown-after' : menuOpen }">
    <ul class="navlist">
      <li class="navlistitem">
        <NuxtLink to="/login" class="" @click="menuOpen = !menuOpen">Log in</NuxtLink>
      </li>
      <li class="navlistitem">
          <NuxtLink to="/register" class="" @click="menuOpen = !menuOpen">Register</NuxtLink>
      </li>
    </ul>
  </div>

</div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");

.dropdown {
  margin-top: 5rem;
  height: 0px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-after {
    position:absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
  height: 100%;
  width: 100%;
  transition: height 0.2s ease;
  z-index: 1000;
}

.navlist {
  list-style: none;
}

.navlistitem {
  text-transform: uppercase;
  text-align: center;
  padding: 20px;
}

.navlistitem a {
  color: black;
}
</style>

<script setup>
const router = useRouter()

const client = useSupabaseAuthClient()
const user = useSupabaseUser()

const logout = async () => {
  await client.auth.signOut()

  router.replace("/")
}

const gotoProfile = async () => {
  router.push(`/profile/${user.value.id}`)
}
</script>

<script>
  export default {
    name: 'hamburger',
    data() {
        return{
            menuOpen: false,
        }
    }
  }
  </script>