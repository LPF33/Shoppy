<template>
  <div id="logout-modal">
    <h2>Logout</h2>
    <h2>Wirklich ausloggen?</h2>
    <div>
      <button @click="userLogout" class="buttons">✔</button>
      <button @click="closeLogout" class="buttons">❌</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Logout",
  methods: {
    userLogout() {
      this.$store.commit("unsubscribeFirebase");
      this.$store.commit("logout");
    },
    closeLogout() {
      this.$emit("close-logout");
    },
  },
};
</script>

<style scoped>
#logout-modal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
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
