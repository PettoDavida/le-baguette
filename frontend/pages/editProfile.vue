<template>
    <div class="grid place-items-center">
        <div class="bg-white rounded-md w-1/3 text-center shadow-lg p-4">
            <h1>Edit Profile</h1>
            
            <Form class="text-start flex justify-center flex-col" :validation-schema="validationSchema">
                
                <label for="image" class="textfield-label mt-8">Image</label>
                <Field
                  name="image"
                  type="text"
                  placeholder="Image (URL)"
                  class="textfield mb-8"
                />
                <ErrorMessage name="image" class="block text-red-500" />

        <label for="username" class="textfield-label">Username</label>
          <Field
            name="username"
            type="text"
            placeholder="Username"
            class="textfield"
          />
          <ErrorMessage name="thread" class="block text-red-500" />

          <label for="biography" class="textfield-label">Biography</label>
          <Field
            name="biography"
            type="text"
            placeholder="Biography"
            class="textfield"
          />
          <ErrorMessage name="title" class="block text-red-500" />
        
          <div class="flex flex-row justify-around items-center mt-8">
            <button type="submit" class="btn btn-primary">Delete account</button>
            <button type="submit" class="btn btn-primary">Save changes</button>
          </div>
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
  