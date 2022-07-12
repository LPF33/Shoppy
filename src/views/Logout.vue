<template>
  <section>
    <h2>Logout</h2>
    <h2>Wirklich ausloggen?</h2>
    <div>
      <button @click="userLogout" class="buttons">✔</button>
      <button @click="closeLogout" class="buttons">❌</button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MutationTypes } from "@/Types/Store";
import router from "@/router";

export default defineComponent({
  name: "Logout",
  methods: {
    userLogout() {
      this.$store.commit(MutationTypes.UNSUBSCRIBE_FIREBASE);
      this.$store.commit(MutationTypes.LOGOUT);
    },
    closeLogout() {
      router.push("/");
    },
  },
});
</script>

<style scoped>
section {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #232323;
  color: white;
}

h1,
h2 {
  margin-bottom: 10px;
}

.buttons {
  background-color: transparent;
  font-size: 3rem;
  height: 6rem;
  width: 6rem;
  background-color: white;
  border-radius: 50%;
  line-height: 1.5;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  margin: 20px;
}
</style>
