<template>
  <section>
    <img :src="`${publicPath}img/wedding.JPG`" alt="wedding-photo" />
    <div v-if="schaetzchen" v-html="greeting" class="header"></div>
    <div v-else class="emoji">🦋</div>
    <aside>{{ wedding }} Tage bis zur Hochzeit</aside>
    <footer>
      <router-link :to="{ name: 'Budget' }" class="buttons">💰</router-link>
      <router-link :to="{ name: 'Jambo' }" class="buttons">🎲</router-link>
      <button @click="userLogout" class="buttons">🔒</button>
    </footer>
  </section>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  methods: {
    userLogout() {
      this.$store.commit("unsubscribeFirebase");
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
section {
  position: relative;
  background-color: #ffffff;
  height: 100%;
  color: #232323;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 1;
}

img {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  max-width: 100vw;
  max-height: 100%;
  object-fit: contain;
  z-index: -1;
}

.header {
  padding: 20px;
}

aside {
  font-size: 1.5rem;
  padding: 20px;
  margin: auto 0;
  background-color: rgba(0, 0, 0, 0.507);
  border-radius: 10px;
  color: rgb(255, 255, 255);
}

footer {
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
}

.buttons {
  background-color: transparent;
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
  text-decoration: none;
}

.emoji {
  font-size: 3rem;
  padding: 10px;
  margin-top: 1rem;
  user-select: none;
}
</style>
