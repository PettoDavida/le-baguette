<template>
  <main class="flex flex-col justify-center items-center mt-12">
    <div
      class="bg-white text-center rounded-md w-10/12 sm:w-2/3 lg:w-auto shadow-lg p-4"
    >
      <h1>Create Sub</h1>

      <Form
        class="flex flex-col justify-center items-center"
        :validation-schema="validationSchema"
        @submit="create"
      >
        <label for="id" class="textfield-label mt-4">Name</label>
        <Field name="id" type="text" placeholder="Name" class="textfield" />
        <ErrorMessage name="id" class="block text-red-500" />

        <label for="title" class="textfield-label mt-8">Title</label>
        <Field name="title" type="text" placeholder="Title" class="textfield" />
        <ErrorMessage name="title" class="block text-red-500" />

        <!-- <label for="image" class="textfield-label"> Image </label>
      <Field name="image" type="text" placeholder="Image" class="textfield" />
      <ErrorMessage name="image" class="block text-red-500" /> -->

        <button type="submit" class="btn btn-primary mt-4">Create Sub</button>
      </Form>
    </div>
  </main>
</template>

<script setup>
import { Field, Form, ErrorMessage } from "vee-validate"
import { toFormValidator } from "@vee-validate/zod"
import * as zod from "zod"

const router = useRouter()

const validationSchema = toFormValidator(
  zod.object({
    id: zod.string().min(3, "Name needs to be atleast 3 characters"),
    title: zod.string().min(6, "Title needs to be atleast 6 characters"),
  })
)

const client = useSupabaseClient()
const user = useSupabaseUser()

const create = async (values) => {
  let res = await client
    .from("subs")
    .insert({ ...values, owner: user.value.id })
    .select()
    .single()

  console.log("Create Sub", res)
  let sub_id = res.data.id

  res = await client
    .from("submembers")
    .insert({ user_id: user.value.id, sub_id })
  console.log("Join", res)

  res = await client.from("submods").insert({ user_id: user.value.id, sub_id })
  console.log("Modded", res)

  router.replace("/")
}
</script>
