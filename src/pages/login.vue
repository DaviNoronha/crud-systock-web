<template>
  <div>
    <v-img class="mx-auto my-6" height="150" src="@/assets/logo.png" />

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <v-form validate-on="blur" @submit.prevent="login" ref="form">
        <div class="text-subtitle-1 text-medium-emphasis">E-mail</div>

        <v-text-field
          density="compact"
          placeholder="Digite seu e-mail"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="loginForm.email"
          :rules="validateEmail"
          required
        ></v-text-field>

        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
        >
          Senha
        </div>

        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Digite sua senha"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          v-model="loginForm.password"
          :error="errors.enabled"
          :error-messages="errors.message"
          :onclick="clearErrors"
          :rules="validatePassword"
          required
          @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-btn
          class="my-4"
          color="blue"
          size="large"
          variant="tonal"
          block
          type="submit"
        >
          Entrar
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from "@/store/auth";
import BaseService from "@/services/BaseService";
import { validateEmail, validatePassword } from "@/utils/rules";

const { storeToken } = useAuthStore();

export default {
  data: () => ({
    visible: false,
    storeToken,
    errors: {
      enabled: false,
      message: "",
    },
    loginForm: {
      email: "",
      password: "",
    },
    validateEmail,
    validatePassword,
  }),

  methods: {
    login(formLogin: any) {
      if (this.$refs.form.isValid) {
        BaseService.post("login", formLogin)
          .then((response) => {
            console.log(response.data);
          })
          .catch((err) => {
            this.errors = {
              enabled: true,
              message: err.response.data.message,
            };
          });
      }
    },
    clearErrors() {
      this.errors = {
        enabled: false,
        message: "",
      };
    },
  },
};
</script>
