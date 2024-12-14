<template>
  <v-container class="align-center fill-height mx-auto" max-width="1800">
    <v-row>
      <Cards
        :total="total"
        :totalAdmin="totalAdmin"
        :totalUsuarios="totalUsuarios"
      />

      <v-col cols="12">
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="users"
          :items-length="total"
          :loading="loading"
          :search="search"
          item-value="nome"
          @update:options="loadUsers"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Usuários</v-toolbar-title>

              <v-btn class="mb-2" color="primary" dark @click="openForm(null)">
                Cadastrar Usuário
              </v-btn>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>

          <template v-slot:[`item.created_at`]="{ item }">
            {{ formatDate(item.created_at.toString()) }}
          </template>

          <template v-slot:[`item.acoes`]="{ item }">
            <v-icon
              class="me-2 text-green-lighten-1"
              size="small"
              @click="openForm(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              class="text-red-lighten-1"
              size="small"
              @click="deleteUser(item)"
            >
              mdi-delete
            </v-icon>
          </template>

          <template v-slot:tfoot>
            <tr>
              <td>
                <v-text-field
                  v-model="search"
                  class="ma-2"
                  density="compact"
                  placeholder="Buscar por nome..."
                  hide-details
                ></v-text-field>
              </td>
            </tr>
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog" max-width="900px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="6">
              <v-text-field v-model="form.nome" label="Nome"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="6">
              <v-text-field v-model="form.email" label="E-mail"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field v-model="form.cpf" label="CPF"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-select
                v-model="form.perfil"
                :items="perfis"
                item-value="nome"
                item-title="descricao"
                label="Perfil"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4" sm="6">
              <v-text-field
                v-model="form.password"
                label="Senha"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="close">
          Cancelar
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="save">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card class="py-4 px-2">
      <v-card-title class="text-h5">
        Tem certeza que deseja excluir o usuário?
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
          >Cancelar</v-btn
        >
        <v-btn color="blue-darken-1" variant="text" @click="deleteUserConfirm"
          >Confirmar</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import BaseService from "@/services/BaseService";

export default {
  data: () => ({
    itemsPerPage: 10,
    dialog: false,
    dialogDelete: false,
    headers: [
      { title: "Nome", key: "nome", align: "start" },
      { title: "CPF", key: "cpf", align: "end" },
      { title: "E-mail", key: "email", align: "end" },
      { title: "Adicionado(a) em", key: "created_at", align: "end" },
      { title: "Perfil", key: "perfil.descricao", align: "end" },
      { title: "Ações", key: "acoes", align: "end" },
    ],
    users: [],
    perfis: [],
    loading: true,
    total: 0,
    totalAdmin: 0,
    totalUsuarios: 0,
    search: "",
    rowId: "",
    form: {
      nome: "",
      cpf: "",
      email: "",
      perfil: "",
      password: "",
    },
    defaultForm: {
      nome: "",
      cpf: "",
      email: "",
      perfil: "",
      password: "",
    },
  }),

  watch: {
    nome() {
      this.search = String(Date.now());
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  computed: {
    formTitle() {
      return !this.rowId ? "Novo Usuário" : "Editar Usuário";
    },
  },

  methods: {
    loadUsers({ page }) {
      this.loading = true;
      BaseService.get(`users?page=${page}`)
        .then((res) => {
          const response = res.data;
          const items = response.data;

          this.users = items;
          this.loading = false;
        })
        .catch((err) => {
          console.error(err.response.data.message);
        });

      BaseService.get(`users/count`)
        .then((res) => {
          const response = res.data;
          this.total = response.admin + response.usuario;
          this.totalAdmin = response.admin;
          this.totalUsuarios = response.usuario;
        })
        .catch((err) => {
          console.error(err.response.data.message);
        });

      BaseService.get(`perfis`)
        .then((res) => {
          const response = res.data;

          this.perfis = res.data;
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err.response.data.message);
        });
    },

    openForm(user: any) {
      if (user) {
        this.rowId = user.id;
        this.form = Object.assign({}, user);
      }
      this.dialog = true;
    },

    deleteUser(user: any) {
      this.rowId = user.id;
      this.form = Object.assign({}, user);
      this.dialogDelete = true;
    },

    deleteUserConfirm() {
      BaseService.delete(`users/${this.rowId}`)
        .then(() => {})
        .catch((err) => {
          console.error(err.response.data.message);
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.form = Object.assign({}, this.defaultForm);
        this.rowId = "";
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.form = Object.assign({}, this.defaultForm);
        this.rowId = "";
      });
    },

    save() {
      if (!this.rowId) {
        BaseService.post(`users`, this.form)
          .then((res) => {})
          .catch((err) => {
            console.error(err.response.data.message);
          });
      } else {
        BaseService.put(`users/${this.rowId}`, this.form)
          .then((res) => {})
          .catch((err) => {
            console.error(err.response.data.message);
          });
      }
      this.close();
    },

    formatDate(date: string) {
      const formattedDate = new Date(date);
      return new Intl.DateTimeFormat("pt-BR").format(formattedDate);
    },
  },
};
</script>
