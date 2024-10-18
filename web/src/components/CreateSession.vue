<template>
  <v-card-title>
    <span class="headline">Create New Session</span>
  </v-card-title>
  <v-card-text>
    <v-form ref="createSessionFormRef" v-model="valid" lazy-validation>
      <v-select
        v-model="session.clientId"
        :items="clients"
        item-title="username"
        item-value="id"
        label="Client"
        :loading="loading"
        :rules="[rules.required]"
        required
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>No clients available</v-list-item-title>
          </v-list-item>
        </template>
      </v-select>

      <v-text-field
        v-model="session.title"
        :rules="[rules.required]"
        label="Title"
        required
      ></v-text-field>

      <v-textarea
        v-model="session.description"
        :rules="[rules.required]"
        label="Description"
        required
      ></v-textarea>
      <v-btn @click="submit" color="success">Create</v-btn>
      <v-snackbar v-model="snackbar" color="success" timeout="3000">
        Session created successfully!
      </v-snackbar>
    </v-form>
  </v-card-text>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      snackbar: false,
      datePicker: false,
      timePicker: false,
      session: {},
      rules: {
        required: (value) => !!value || "Required.",
      },
      loading: false,
      clients: [],
    };
  },
  emits: ["update-sessions"],
  mounted() {
    this.getClients();
    this.resetForm();
  },
  methods: {
    async submit() {
      if ((await this.$refs.createSessionFormRef.validate()).valid !== true) {
        return;
      }
      await this.$axios.post("/sessions", this.session).then(() => {
        this.snackbar = true;
        this.resetForm();
        this.$emit("update-sessions");
      });
    },
    resetForm() {
      this.session = {
        title: "",
        description: "",
        clientId: "",
      };
      this.$refs.createSessionFormRef.reset();
    },
    async getClients() {
      this.loading = true;
      await this.$axios.get("users/clients/").then((response) => {
        this.clients = response.data;
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
