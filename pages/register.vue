<template>
  <div class="grid place-items-center">
    <h1>Register</h1>

    <Form :validation-schema="validationSchema" @submit="register">
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

      <label for="confirmPassword" class="textfield-label">
        Confirm Password
      </label>
      <Field
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="textfield"
      />
      <ErrorMessage name="confirmPassword" class="block text-red-500" />

      <button type="submit" class="btn btn-primary">Register</button>
    </Form>
  </div>
</template>

<script setup>
import { Field, Form, ErrorMessage } from "vee-validate"
import { toFormValidator } from "@vee-validate/zod"
import * as zod from "zod"

const router = useRouter()

const validationSchema = toFormValidator(
  zod
    .object({
      username: zod.string().min(3, "Username cant be less than 3 characters"),
      password: zod
        .string()
        .min(6, "Password needs to be atleast 6 characters"),
      confirmPassword: zod.string().min(6, {
        message: "Confirm Password needs to be atleast 6 characters",
      }),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          path: ["confirmPassword"],
          code: "custom",
          message: "Passwords don't match",
        })
      }
    })
)

const client = useSupabaseAuthClient()

const register = async (values) => {
  // TODO: Handle errors
  let res = await client.auth.signUp({
    email: values.username,
    password: values.password,
  })
  console.log(res)

  router.replace("/")
}
</script>
