<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ attrs }">
      <v-btn v-bind="attrs" color="primary" @click="openModal">
        View Session
      </v-btn>
    </template>

    <v-card>
      <v-card-title>
        <span v-if="isEditing">Edit Session</span>
        <span v-else>Session Details</span>
      </v-card-title>

      <v-card-text>
        <div v-if="isEditing">
          <v-form ref="editForm">
            <v-text-field
              v-model="sessionData.title"
              label="Title"
              readonly
              required
            ></v-text-field>
            <v-textarea
              v-model="sessionData.description"
              label="Description"
              readonly
              required
            ></v-textarea>
            <div v-if="role === 'client'">
              <v-menu
                v-if="sessionData.status !== 'closed'"
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
                    v-model="sessionData.date"
                    label="Date"
                    readonly
                  ></v-text-field>
                </template>
                <v-date-picker v-model="sessionData.date" />
              </v-menu>
              <v-time-picker
                v-if="sessionData.status !== 'closed'"
                v-model="sessionData.time"
                label="Time"
                format="24hr"
                required
              ></v-time-picker>
              <v-checkbox
                v-if="sessionData.status === 'booked'"
                v-model="isComplete"
                label="Complete?"
              />
              <v-textarea
                v-if="isComplete"
                v-model="sessionData.feedback"
                label="Feedback"
              ></v-textarea>
            </div>
          </v-form>
        </div>
        <div v-else>
          <p v-if="role === 'client'">
            <strong>Therapist:</strong>
            {{ sessionData.therapistName }}
          </p>
          <p v-else><strong>Client:</strong> {{ sessionData.clientName }}</p>
          <p><strong>Title:</strong> {{ sessionData.title }}</p>
          <p><strong>Description:</strong> {{ sessionData.description }}</p>
          <p><strong>Status:</strong> {{ sessionData.status }}</p>
          <p><strong>Date:</strong> {{ sessionData.date }}</p>
          <p><strong>Time:</strong> {{ sessionData.time }}</p>
          <p v-if="sessionData.status === 'closed'">
            <strong>Feedback:</strong>
            {{ sessionData.feedback }}
          </p>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="closeModal">Cancel</v-btn>
        <v-btn
          v-if="sessionData.status !== 'closed'"
          color="red"
          @click="deleteSession"
        >
          Delete
        </v-btn>
        <v-btn
          color="primary"
          @click="isEditing ? saveChanges() : startEditing()"
        >
          {{ isEditing ? "Save" : "Edit" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    session: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      isEditing: false,
      sessionData: { ...this.session },
      formValid: false,
      menu: false,
      isComplete: false,
      role: localStorage.getItem("userRole"),
    };
  },
  methods: {
    startEditing() {
      this.isEditing = true;
    },
    saveChanges() {
      if (this.$refs.editForm.validate()) {
        this.sessionData.status = this.isComplete
          ? "closed"
          : this.sessionData.date && this.sessionData.time
          ? "booked"
          : "open";
        this.$emit("updateSession", this.sessionData);
        this.isEditing = false;
        this.dialog = false;
      }
    },
    deleteSession() {
      this.$emit("delete-session", this.sessionData.id);
      this.dialog = false;
    },
    openModal() {
      this.isComplete = this.sessionData.status === "closed" ? true : false;
      this.dialog = true;
    },
    closeModal() {
      this.dialog = false;
      this.isEditing = false;
    },
  },
};
</script>
