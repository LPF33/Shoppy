<template>
  <nav v-if="isLoggedIn">
    <router-link :to="{ name: 'Main' }"
      ><span
        ><font-awesome-icon icon="fa-duotone fa-planet-ringed" class="icon"
      /></span>
      <p>Home</p>
    </router-link>
    <router-link :to="{ name: 'Shoppy' }">
      <span
        ><font-awesome-icon icon="fa-duotone fa-basket-shopping" class="icon"
      /></span>
      <p>Shoppy</p>
    </router-link>
    <router-link :to="{ name: 'Cooky' }">
      <span
        ><font-awesome-icon icon="fa-duotone fa-cauldron" class="icon"
      /></span>
      <p>Cooky</p>
    </router-link>
    <router-link :to="{ name: 'Jambo' }" class="buttons">
      <span><font-awesome-icon icon="fa-duotone fa-chess" class="icon" /></span>
      <p>Jambo</p>
    </router-link>
    <router-link :to="{ name: 'Logout' }" class="buttons">
      <span><font-awesome-icon icon="fa-duotone fa-lock" class="icon" /></span>
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

nav a > span .icon {
  --fa-secondary-opacity: 1;
  --fa-primary-color: black;
  --fa-secondary-color: white;
}

nav a.router-link-exact-active > span {
  background-color: black;
}

nav a.router-link-exact-active > span .icon {
  --fa-primary-color: rgb(255, 92, 92);
  --fa-secondary-color: white;
}

nav a > p {
  font-size: 0.8rem;
  color: #686868;
}

nav a.router-link-exact-active > p {
  color: white;
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
