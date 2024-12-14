import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      user: "davi",
    };
  },
  getters: {},
  actions: {
    async storeToken() {
    },
  },
});
