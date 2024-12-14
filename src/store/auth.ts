import BaseService from "@/services/BaseService";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      token: "",
      email: "",
      errors: {
        enabled: false,
        message: "",
      },
    };
  },
  getters: {
    isLoggedIn: (state) => !!state.token 
  },
  actions: {
    async login(loginForm: any) {
      BaseService.post("login", loginForm)
        .then((response) => {
            localStorage.setItem('token', response.data)

            this.token = response.data;
            this.email = loginForm.email;
        })
        .catch((err) => {
          this.errors = {
            enabled: true,
            message: err.response.data.message,
          };
        });
    },
  },
});
