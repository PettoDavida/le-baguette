import { defineStore } from "pinia"

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("user_token") || "",
  }),
  getters: {
    userToken: (state) => state.token,
    isLoggedIn: (state) => state.token?.length !== 0,
  },
  actions: {
    async login(username: string, password: string) {
      console.log("User Login")
      console.log("Username", username)
      console.log("Password", password)

      // TODO: Move baseURL
      const result = await fetch("http://localhost:3001/api/user/login", {
        method: "POST",
        body: JSON.stringify({
          email: username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await result.json()
      const token = data.token
      localStorage.setItem("user_token", token)
      this.token = token
    },

    async register(username: string, password: string) {
      console.log("User Register")
      console.log("Username", username)
      console.log("Password", password)

      const _result = await fetch("http://localhost:3001/api/user", {
        method: "POST",
        body: JSON.stringify({
          email: username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      await this.login(username, password)
    },

    async logout() {
      localStorage.clear()
      this.token = ""
    },
  },
})
