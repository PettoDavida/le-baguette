<template>
  <div class="container mx-auto">
    <Header />
    <slot />
  </div>
</template>

<script>
import { useUserStore } from "~/stores/user"

let user = useUserStore()
const router = useRouter()
let currentRoute = router.currentRoute.value.fullPath;
console.log(currentRoute);
if(currentRoute === "/"){
  router.replace("/mainfeed")
}
</script>