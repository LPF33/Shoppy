<template>
  <nav v-if="isLoggedIn">
    <router-link :to="{ name: 'Main' }"
      ><span>🏠</span>
      <p>Home</p>
    </router-link>
    <router-link :to="{ name: 'Shoppy' }">
      <span>🛒</span>
      <p>Shoppy</p>
    </router-link>
    <router-link :to="{ name: 'Cooky' }">
      <span>🧑‍🍳</span>
      <p>Cooky</p>
    </router-link>
    <router-link :to="{ name: 'Jambo' }" class="buttons">
      <span>🎲</span>
      <p>Jambo</p>
    </router-link>
    <router-link :to="{ name: 'Logout' }" class="buttons">
      <span>🔒</span>
      <p>Logout</p>
    </router-link>
  </nav>
  <div v-if="error" class="error-nav">❗</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Navbar",
  computed: {
    isLoggedIn: function () {
      return this.$store.state.isAuthenticated;
    },
    error() {
      return this.$store.state.error;
    },
  },
});
</script>

<style>
nav {
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: center;
  background: #232323;
}

nav a {
  text-align: center;
  width: 150px;
  text-decoration: none;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

nav a > span {
  margin: 5px;
  padding: 5px;
  font-size: 1.7rem;
  border-radius: 15px;
  background-color: rgba(184, 184, 184, 0.3);
}

nav a.router-link-exact-active > span {
  background-color: #ffeda3;
}

nav a > p {
  font-size: 0.8rem;
  color: #686868;
}

nav a.router-link-exact-active > p {
  color: #ffeda3;
}

.error-nav {
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 2rem;
  height: 3rem;
  width: 3rem;
  border: 1px solid grey;
  border-radius: 50%;
  line-height: 1.5;
  text-align: center;
  background-color: red;
}
</style>
