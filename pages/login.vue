<template>
  <div class="grid place-items-center">
    <div class="bg-white rounded-md w-1/3 text-center shadow-lg p-4">
    <h1>Login</h1>

    <Form class="text-start flex justify-center flex-col" :validation-schema="validationSchema" @submit="login">
      <label for="username" class="textfield-label">Email</label>
      <Field
        name="username"
        type="text"
        placeholder="Email"
        class="textfield"
      />
      <ErrorMessage name="username" class="block text-red-500" />

      <label for="password" class="textfield-label mt-8">Password</label>
      <Field
        name="password"
        type="password"
        placeholder="Password"
        class="textfield"
      />
      <ErrorMessage name="password" class="block text-red-500" />

      <p v-if="error" class="text-red-500">{{ error }}</p>

      <button type="submit" class="btn btn-primary">Login</button>
    </Form>
  </div>
  </div>
</template>

<script setup>
import { Field, Form, ErrorMessage } from "vee-validate"
import { toFormValidator } from "@vee-validate/zod"
import * as zod from "zod"

const router = useRouter()

const validationSchema = toFormValidator(
  zod.object({
    username: zod
      .string()
      .min(3, "Email cant be less than 3 characters")
      .email("Must be a valid email"),
    password: zod.string().min(5, "Password needs to be atleast 6 characters"),
  })
)

const client = useSupabaseAuthClient()

const error = ref(null)

const login = async (values) => {
  let res = await client.auth.signInWithPassword({
    email: values.username,
    password: values.password,
  })

  if (res.error) {
    error.value = "Email or password was incorrect"
    return
  }

  router.replace("/").then(() => {
    window.location.reload()
  })
}
</script>
