<template>
  <v-container>
    <v-app-bar color="primary" dark>
      <v-toolbar-title>Session Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="my-5">
        <v-row>
          <v-col v-if="role === 'therapist'" cols="4">
            <div class="mr-4">
              <v-card class="mx-2 my-2" width="250">
                <CreateSession @update-sessions="fetchSessions" />
              </v-card>
            </div>
          </v-col>
          <v-col cols="8">
            <v-form @submit.prevent="fetchSessions">
              <v-row>
                <v-col cols="6" md="4">
                  <v-menu
                    v-model="menu"
                    ref="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        v-model="filters.date"
                        label="Date"
                        readonly
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="filters.date" />
                  </v-menu>
                </v-col>

                <v-col v-if="role === 'client'" cols="6" md="4">
                  <v-select
                    v-model="filters.therapistId"
                    :items="therapists"
                    item-title="username"
                    item-value="id"
                    label="Therapist"
                  ></v-select>
                </v-col>

                <v-col v-if="role === 'therapist'" cols="6" md="4">
                  <v-select
                    v-model="filters.clientId"
                    :items="clients"
                    item-title="username"
                    item-value="id"
                    label="Client"
                  ></v-select>
                </v-col>

                <v-col cols="6" md="4">
                  <v-btn text @click="clearFilters" class="mb-1 mr-1">
                    Clear
                  </v-btn>
                  <v-btn type="submit" color="primary">Apply</v-btn>
                </v-col>
              </v-row>
            </v-form>
            <v-row
              v-for="status in statuses"
              :key="status"
              class="mt-1"
              style="min-height: 150px"
            >
              <v-col>
                <v-row class="flex justify-center bg-secondary rounded">
                  <v-label>{{ status }} Sessions</v-label>
                </v-row>
                <div class="scrollable-container my-2">
                  <v-slide-group show-arrows>
                    <v-slide-group-item
                      v-for="(session, index) in sessions.filter(
                        (session) =>
                          session.status === status.toLocaleLowerCase()
                      )"
                      :key="index"
                    >
                      <div class="mr-4">
                        <v-card class="mx-2 mt-2" width="150">
                          <v-card-title>{{ session.title }}</v-card-title>
                          <v-card-text>{{ session.description }}</v-card-text>
                          <v-card-actions>
                            <SessionModal
                              :session="session"
                              @update-session="updateSession"
                              @delete-session="deleteSession"
                            />
                          </v-card-actions>
                        </v-card>
                      </div>
                    </v-slide-group-item>
                  </v-slide-group>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer color="primary" app>
      <v-col class="text-center white--text">
        &copy; 2024 - Therapy Scheduler
      </v-col>
    </v-footer>
  </v-container>
</template>

<script>
import CreateSession from "@/components/CreateSession.vue";
import SessionModal from "@/components/SessionModal.vue";

export default {
  components: {
    CreateSession,
    SessionModal,
  },
  data() {
    return {
      sessions: [],
      role: localStorage.getItem("userRole"),
      statuses: ["Open", "Booked", "Closed"],
      clients: [],
      therapists: [],
      filters: {
        date: null,
        clientId: null,
        therapistId: null,
      },
      menu: false,
    };
  },
  mounted() {
    this.fetchSessions();
    this.fetchClients();
    this.fetchTherapists();
  },
  methods: {
    logout() {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      this.$router.push("/login");
    },
    async fetchSessions() {
      await this.$axios
        .get("sessions/", {
          params: {
            date: this.filters.date?.toISOString() || null,
            clientId: this.filters.clientId || null,
            therapistId: this.filters.therapistId || null,
          },
        })
        .then((response) => {
          this.sessions = response.data;
        });
    },
    async updateSession(updatedSession) {
      await this.$axios
        .put(`/sessions/${updatedSession.id}`, updatedSession)
        .then(() => {
          this.fetchSessions();
        });
    },
    async deleteSession(sessionId) {
      await this.$axios.delete(`/sessions/${sessionId}`).then(() => {
        this.fetchSessions();
      });
    },
    async fetchClients() {
      await this.$axios.get("users/clients").then((response) => {
        this.clients = response.data;
      });
    },
    async fetchTherapists() {
      await this.$axios.get("users/therapists").then((response) => {
        this.therapists = response.data;
      });
    },
    clearFilters() {
      this.filters = {
        date: null,
        clientId: null,
        therapistId: null,
      };
      this.fetchSessions();
    },
  },
};
</script>

<style scoped>
.scrollable-container {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: thin;
}

.scrollable-container::-webkit-scrollbar {
  height: 8px;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>
