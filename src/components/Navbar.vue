<template>
  <nav v-if="isLoggedIn">
    <router-link :to="{ name: 'Main' }">Main</router-link>
    <router-link :to="{ name: 'Shoppy' }">Shoppy</router-link>
    <router-link :to="{ name: 'Cook' }">Cooky</router-link>
  </nav>
  <nav v-else>
    <router-link :to="{ name: 'Login' }">Login</router-link>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  computed: {
    isLoggedIn: function () {
      return this.$store.state.isAuthenticated;
    },
  },
};
</script>

<style>
nav {
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  background: #232323;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  border: 2px solid rgb(184, 184, 184);
  padding: 10px;
  width: 150px;
  text-align: center;
  margin: 0 10px;
  color: #ffeda3;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #39a9cb;
}
</style>
