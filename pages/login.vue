<template>
  <div class="grid place-items-center">
    <h1>Login</h1>

    <Form :validation-schema="validationSchema" @submit="login">
      <label for="username" class="textfield-label">Username</label>
      <Field
        name="username"
        type="text"
        placeholder="Username"
        class="textfield"
      />
      <ErrorMessage name="username" class="block text-red-500" />

      <label for="password" class="textfield-label">Password</label>
      <Field
        name="password"
        type="password"
        placeholder="Password"
        class="textfield"
      />
      <ErrorMessage name="password" class="block text-red-500" />

      <button type="submit" class="btn btn-primary">Login</button>
    </Form>
  </div>
</template>

<script setup>
import { Field, Form, ErrorMessage } from "vee-validate"
import { toFormValidator } from "@vee-validate/zod"
import * as zod from "zod"

const router = useRouter()

const validationSchema = toFormValidator(
  zod.object({
    username: zod.string().min(3, "Username cant be less than 3 characters"),
    password: zod.string().min(5, "Password needs to be atleast 6 characters"),
  })
)

const client = useSupabaseAuthClient()

const login = async (values) => {
  // TODO: Handle errors
  let res = await client.auth.signInWithPassword({
    email: values.username,
    password: values.password,
  })

  router.replace("/")
}
</script>
