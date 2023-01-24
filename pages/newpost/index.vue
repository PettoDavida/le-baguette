<template>
  <div class="max-w-sm mx-auto mt-8">
    <div class="bg-white rounded-md text-center shadow-lg p-4">
    <Form :validation-schema="validationSchema" @submit="newPost">
      <label for="title" class="textfield-label">Title</label>
      <Field name="title" type="text" placeholder="Title" class="textfield" />
      <ErrorMessage name="title" class="block text-red-500" />

      <label for="content" class="textfield-label">Content</label>
      <Field
        as="textarea"
        name="content"
        placeholder="Content"
        class="textfield resize-none"
        rows="5"
      />
      <ErrorMessage name="content" class="block text-red-500" />

      <label for="sub" class="textfield-label">Sub</label>
      <Field name="sub" placeholder="sub" as="select" class="block">
        <option
          v-for="sub in userSubs"
          :key="sub.sub_id.id"
          :value="sub.sub_id.id"
        >
          {{ sub.sub_id.title }}
        </option>
      </Field>
      <ErrorMessage name="sub" class="block text-red-500" />

      <button type="submit" class="btn btn-primary">Create Post</button>
    </Form>
  </div>
  </div>
</template>

<script setup>
import { Field, Form, ErrorMessage } from "vee-validate"
import { toFormValidator } from "@vee-validate/zod"
import * as zod from "zod"

const validationSchema = toFormValidator(
  zod.object({
    title: zod.string().min(3, "Title can't be less than 3 characters"),
    content: zod.string().optional(),
    sub: zod.string(),
  })
)

const router = useRouter()

const client = useSupabaseClient()
const user = useSupabaseUser()

let { data: userSubs } = await client
  .from("submembers")
  .select("sub_id(id, title)")
  .eq("user_id", user.value.id)
console.log(userSubs)

const newPost = async (values) => {
  if (!values.content) values.content = ""

  let obj = {
    title: values.title,
    content: values.content,
    user_id: user.value.id,
    sub_id: values.sub,
  }

  let res = await client.from("posts").insert(obj)
  console.log(res)
  router.replace("/")
}
</script>
