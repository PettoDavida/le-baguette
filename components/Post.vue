<template>
  <div class="shadow-lg px-10 py-5 bg-lime-300">
    <p>Sub: {{ props.sub }}</p>
    <h2>Title: {{ props.title }}</h2>
    <p>Creator: {{ props.creator }}</p>
    <span>Content: {{ props.content }}</span>
    <UpVote title="Up Vote" fill-color="#" />
    <UpVoted title="Remove Vote" fill-color="#ff4500" />
    <DownVote title="Down Vote" fill-color="#" />
    <DownVoted title="Remove Vote" fill-color="#7193ff" />
  </div>
</template>

<script setup lang="ts">
import UpVoted from "vue-material-design-icons/ArrowUpBold.vue"
import UpVote from "vue-material-design-icons/ArrowUpBoldOutline.vue"
import DownVoted from "vue-material-design-icons/ArrowDownBold.vue"
import DownVote from "vue-material-design-icons/ArrowDownBoldOutline.vue"

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  sub: {
    type: String,
    required: true,
  },
})
</script>
