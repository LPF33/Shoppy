<template>
  <div v-if="error" class="error">{{ errorMessage }}</div>
  <form @submit.prevent="submit">
    <h1>Login</h1>
    <input
      type="email"
      required
      placeholder="email"
      v-model="email"
      ref="input"
    />
    <input type="password" required placeholder="password" v-model="password" />
    <button type="submit">Submit</button>
  </form>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    submit() {
      this.$store.dispatch("signIn", {
        email: this.email,
        password: this.password,
      });
    },
  },
  computed: {
    error() {
      return this.$store.state.error;
    },
    errorMessage() {
      return this.$store.state.errorMessage;
    },
  },
  mounted() {
    this.$refs.input.focus();
  },
};
</script>

<style scoped>
h1 {
  padding-bottom: 10vh;
}

form {
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

button[type="submit"] {
  background-color: #39a9cb;
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 30px;
  margin: 20px 10%;
}
button[type="submit"]:hover {
  background-color: #2940d3;
}
input {
  margin: 5px;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  padding: 10px;
  border-radius: 30px;
  margin: 20px 10%;
}
</style>
