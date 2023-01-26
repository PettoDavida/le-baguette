<template>
  <div class="flex justify-center items-center flex-col mt-8">
    <div class="bg-white rounded-md text-center w-full md:w-auto shadow-lg p-4 md:px-8 md:py-4">
      <h1>Register</h1>

      <Form
        class="text-start flex justify-center flex-col"
        :validation-schema="validationSchema"
        @submit="register"
      >
        <label for="username" class="textfield-label mt-4">Email</label>
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

        <label for="confirmPassword" class="textfield-label mt-8">
          Confirm Password
        </label>
        <Field
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          class="textfield"
        />
        <ErrorMessage name="confirmPassword" class="block text-red-500" />

        <p v-if="error" class="text-red-500">{{ error }}</p>

        <button type="submit" class="btn btn-primary">Register</button>
      </Form>
      <span
        >Already have an account?
        <NuxtLink to="/login">Login here</NuxtLink></span
      >
    </div>
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
      username: zod
        .string()
        .min(3, "Please enter you email")
        .email("Must be a valid email"),
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

const error = ref(null)

const register = async (values) => {
  let res = await client.auth.signUp({
    email: values.username,
    password: values.password,
  })
  console.log("Register", res)

  if (res.error) {
    error.value = "Email is already in use"
    return
  }

  router.replace("/accountsetup")
}
</script>
