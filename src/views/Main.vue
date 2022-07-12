<template>
  <section>
    <img :src="`${publicPath}img/kukulcan.jpg`" alt="wedding-photo" />
    <aside>
      <div v-if="schaetzchen" v-html="greeting"></div>
      <div v-else><span class="emoji">🦋</span></div>
      <h3 v-if="special > 0">
        In <span class="highlight">{{ special }}</span> Tagen fliegen wir nach
        Mexiko
      </h3>
      <h3 v-else>Mexiko! Wir kommen! <span class="emoji">🇲🇽</span></h3>
    </aside>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Main",
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  computed: {
    special(): number {
      const specialDate = new Date(2022, 6, 19);
      const now = new Date();
      return (
        Math.floor(
          (specialDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
        ) + 1
      );
    },
    schaetzchen(): boolean {
      return this.$store.state.user !== "lars@gmail.com";
    },
    greeting(): string {
      const now = new Date();
      const hours = now.getHours();
      if (5 <= hours && hours <= 11) {
        return '<span class="emoji">🌞</span><h2>Guten Morgen</h2><h3>Schönen Tag, meine Kleine 🦋</h3>';
      } else if (11 < hours && hours <= 14) {
        return '<span class="emoji">🌼</span><h2>Schönen Mittag</h2>';
      } else if (14 < hours && hours <= 17) {
        return '<span class="emoji">☕</span><h2>Schönen Nachmittag</h2>';
      } else if (17 < hours && hours <= 22) {
        return '<span class="emoji">🌜</span><h2>Schönen Abend,</h2><h3>mein kleines Schätzchen 🥰</h3>';
      } else {
        return '<span class="emoji">😴</span><h2>Schlaf schön!</h2><h3> Gute Nacht, meine Kleine ♥️</h3>';
      }
    },
  },
});
</script>

<style scoped>
section {
  position: relative;
  background-color: #ffffff;
  width: 100%;
  height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

img {
  max-width: 100%;
  height: 50%;
  padding: 30px;
  object-fit: contain;
}

aside {
  height: 50%;
  width: 100%;
  background-color: #232323;
  color: rgb(255, 255, 255);
  border-radius: 50px 0 0 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.highlight {
  color: rgb(233, 131, 131);
  font-weight: bold;
  width: 30px;
  height: 30px;
  line-height: 166%;
  text-align: center;
  vertical-align: baseline;
  border-radius: 50%;
  display: inline-block;
  background-color: rgba(184, 184, 184, 0.3);
}
</style>
