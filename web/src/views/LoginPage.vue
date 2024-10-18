<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <span class="headline">Welcome to Therapist Scheduler</span>
          </v-card-title>
          <v-card-text>
            <v-tabs v-model="tab" background-color="transparent">
              <v-tab @click="setLoginMode">Login</v-tab>
              <v-tab @click="setRegisterMode">Register</v-tab>
            </v-tabs>

            <v-alert
              v-if="errorMessage"
              class="my-2"
              type="error"
              variant="tonal"
              dismissible
              @click="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <v-form
              ref="loginFormRef"
              v-if="isLoginMode"
              @submit.prevent="login"
            >
              <v-text-field
                label="Email"
                v-model="loginForm.email"
                :rules="[rules.required]"
                required
              >
              </v-text-field>
              <v-text-field
                label="Password"
                v-model="loginForm.password"
                type="password"
                :rules="[rules.required]"
                required
              >
              </v-text-field>
              <v-btn color="primary" type="submit">Login</v-btn>
            </v-form>

            <v-form
              ref="registerFormRef"
              v-if="isRegisterMode"
              @submit.prevent="register"
            >
              <v-text-field
                label="Username"
                v-model="registerForm.username"
                :rules="[rules.required]"
                required
              >
              </v-text-field>
              <v-text-field
                label="Email"
                v-model="registerForm.email"
                :rules="[rules.required]"
                required
              >
              </v-text-field>
              <v-text-field
                label="Password"
                v-model="registerForm.password"
                type="password"
                :rules="[rules.required]"
                required
              >
              </v-text-field>
              <v-select
                label="Role"
                v-model="registerForm.role"
                :items="roles"
                :rules="[rules.required]"
                required
                data-cy="role"
              ></v-select>
              <v-btn color="primary" type="submit">Submit</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      tab: null,
      isLoginMode: true,
      isRegisterMode: false,
      roles: ["Therapist", "Client"],
      loginForm: {
        email: "",
        password: "",
      },
      registerForm: {
        username: "",
        email: "",
        password: "",
        role: "",
      },
      rules: {
        required: (value) => !!value || "Required",
      },
      errorMessage: "",
    };
  },
  methods: {
    setLoginMode() {
      this.tab = 0;
      this.isLoginMode = true;
      this.isRegisterMode = false;
    },
    setRegisterMode() {
      this.tab = 1;
      this.isLoginMode = false;
      this.isRegisterMode = true;
    },
    async login() {
      if ((await this.$refs.loginFormRef.validate()).valid !== true) {
        return;
      }
      await this.$axios
        .post("auth/login", this.loginForm)
        .then((response) => {
          const { token, user } = response.data;
          localStorage.setItem("authToken", token);
          localStorage.setItem("userRole", user.role);

          this.reset();
          this.$router.push("/session-dashboard");
        })
        .catch((error) => {
          this.errorMessage =
            error?.response?.data?.message || "Registration failed";
        });
    },
    async register() {
      if ((await this.$refs.registerFormRef.validate()).valid !== true) {
        return;
      }
      await this.$axios
        .post("auth/register", this.registerForm)
        .then(() => {
          this.reset();
          this.setLoginMode();
        })
        .catch((error) => {
          this.errorMessage = error?.response?.data?.message || "Login failed";
        });
    },
    reset() {
      this.loginForm = {
        email: "",
        password: "",
      };
      this.registerForm = {
        username: "",
        email: "",
        password: "",
        role: "",
      };
      this.errorMessage = "";
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
