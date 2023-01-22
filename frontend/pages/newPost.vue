<template>
    <div class="grid place-items-center">
      <div class="bg-white rounded-md w-1/3 text-center shadow-lg p-4">
        <h1>Create New Post</h1>
    
        <Form class="text-start flex justify-center flex-col" :validation-schema="validationSchema">

        <label for="thread" class="textfield-label">Thread</label>
          <Field
            name="thread"
            type="text"
            placeholder="Thread"
            class="textfield"
          />
          <ErrorMessage name="thread" class="block text-red-500" />

          <label for="title" class="textfield-label">Title</label>
          <Field
            name="title"
            type="text"
            placeholder="Title"
            class="textfield"
          />
          <ErrorMessage name="title" class="block text-red-500" />
    
          <label for="text" class="textfield-label mt-8">Text</label>
          <Field
            name="text"
            type="text"
            placeholder="Text"
            class="textfield mb-8"
          />
          <ErrorMessage name="text" class="block text-red-500" />

          <label for="image" class="textfield-label mt-8">Image</label>
          <Field
            name="image"
            type="text"
            placeholder="Image (URL)"
            class="textfield mb-8"
          />
          <ErrorMessage name="image" class="block text-red-500" />
    
          <button type="submit" class="btn btn-primary">Create post</button>
        </Form>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { Field, Form, ErrorMessage } from "vee-validate"
  import { toFormValidator } from "@vee-validate/zod"
  import * as zod from "zod"
  import { useUserStore } from "~/stores/user"
  
  const user = useUserStore()
  const router = useRouter()
  
  const validationSchema = toFormValidator(
    zod.object({
        title: zod.string().min(3, "Title cant be less than 3 characters"),
        text: zod.string().min(10, "Text needs to be atleast 10 characters"),
    })
  )
  
  const login = (values) => {
    user.login(values.username, values.password)
    router.replace("/")
  }
  </script>
  