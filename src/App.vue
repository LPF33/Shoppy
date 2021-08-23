<template>
  <main>
    <router-view />
  </main>
  <Navbar />
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: { Navbar },
  mounted() {
    this.$store.dispatch("checkAuth");
  },
  unmounted() {
    // safe is safe ...
    this.$store.commit("unsubscribeFirebase");
  },
};
</script>

<style>
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

main {
  flex-grow: 1;
}
</style>
