<template>
  <div class="main-section">
    <div v-if="schaetzchen" v-html="greeting" class="header"></div>
    <div v-else class="emoji">🦋</div>
    <aside>{{ wedding }} Tage bis zur Hochzeit 👰</aside>
    <router-link :to="{ name: 'Budget' }" id="budget-route">💰</router-link>
    <button @click="userLogout" id="logout-button">🔒</button>
  </div>
</template>

<script>
export default {
  name: "Main",
  methods: {
    userLogout() {
      this.$store.commit("logout");
    },
  },
  computed: {
    wedding() {
      const weddingDate = new Date(2021, 8, 7);
      const now = new Date();
      return (
        Math.floor(
          (weddingDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
        ) + 1
      );
    },
    schaetzchen() {
      return this.$store.state.user !== "lars@gmail.com";
    },
    greeting() {
      const now = new Date();
      const hours = now.getHours();
      if (5 <= hours && hours <= 11) {
        return "<h1>Guten Morgen 🌞!</h1><h1>Schönen Tag, meine Kleine ♥</h1>";
      } else if (11 < hours && hours <= 14) {
        return "<h1>Schönen Mittag 🌼🦋</h1>";
      } else if (14 < hours && hours <= 17) {
        return "<h1>Schönen Nachmittag ☕</h1>";
      } else if (17 < hours && hours <= 22) {
        return "<h1>Schönen Abend 🥰</h1><h1>mein kleines Schätzchen 🥰</h1>";
      } else {
        return "<h1>Schlaf schön 😴</h1><h1> Gute Nacht, meine Kleine ♥</h1>";
      }
    },
  },
};
</script>

<style scoped>
.main-section {
  position: relative;
  background-color: #39a9cb;
  height: 100%;
  color: #232323;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.header {
  padding: 20px;
}

aside {
  font-size: 1.5rem;
  padding: 20px;
  margin: auto 0;
  background-color: #ffeda3;
  border-radius: 10px;
}

#logout-button {
  background-color: transparent;
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 3rem;
  height: 6rem;
  width: 6rem;
  border: 1px solid grey;
  border-radius: 50%;
  line-height: 1.5;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 0 8px black;
}

#budget-route {
  background-color: transparent;
  position: absolute;
  bottom: 10px;
  left: 10px;
  text-decoration: none;
  font-size: 3rem;
  height: 6rem;
  width: 6rem;
  border: 1px solid grey;
  border-radius: 50%;
  line-height: 1.5;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 0 8px black;
}

.emoji {
  font-size: 3rem;
  padding: 10px;
  margin-top: 1rem;
  user-select: none;
}
</style>
