<template>
  <main>
    <router-view />
  </main>
  <Navbar />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ActionTypes, MutationTypes } from "@/Types/Store";
import Navbar from "@/components/Navbar.vue";

export default defineComponent({
  components: { Navbar },
  mounted() {
    this.$store.dispatch(ActionTypes.CHECK_AUTH);
  },
  unmounted() {
    this.$store.commit(MutationTypes.UNSUBSCRIBE_FIREBASE);
  },
});
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
