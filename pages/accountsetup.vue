<template>
  <div class="grid place-items-center">
    <h1>Final setup</h1>

    <Form :validation-schema="validationSchema" @submit="uploadUserInfo">
      <label for="displayname" class="textfield-label">Display Name</label>
      <Field
        name="displayname"
        type="text"
        placeholder="Display Name"
        class="textfield"
      />
      <ErrorMessage name="displayname" class="block text-red-500" />

      <input ref="fileInput" name="fileInput" type="file" accept="image/*" />
      <ErrorMessage name="fileInput" class="block text-red-500" />

      <button type="submit" class="btn btn-primary">Submit</button>
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
    displayname: zod
      .string({ required_error: "Display Name is required" })
      .min(3, "Display Name cant be less than 3 characters"),
  })
)

const client = useSupabaseAuthClient()
const user = useSupabaseUser()

const fileInput = ref(null)

const uploadUserInfo = async (values) => {
  let file = fileInput.value.files[0]
  console.log("Form", file)
  let filepath = "public/" + crypto.randomUUID() + file?.name
  await client.storage.from("images").upload(filepath, file)

  let res = client.storage.from("images").getPublicUrl(filepath)
  let imageUrl = res.data.publicUrl

  {
    let res = await client.from("userdata").insert({
      id: user.value.id,
      username: values.displayname,
      avatar: imageUrl,
    })
    console.log(res)
  }

  router.replace("/")
}
</script>
