<template>
  <section>
    <img
      class="main-img"
      :src="`${publicPath}img/cuddly_bears.gif`"
      alt="cuddly bears"
    />
    <aside>
      <div v-if="schaetzchen" v-html="greeting()"></div>
      <div v-else><span class="emoji main-emoji">🦋</span></div>
      <h3 v-if="special(2022, 7, 27) > 0">
        {{ schaetzchen ? "Du bist noch" : "Caroline ist noch " }}
        <span class="highlight">{{ special(2022, 7, 27) }}</span> Tage in London
        🏴󠁧󠁢󠁥󠁮󠁧󠁿
      </h3>
      <h3 v-else>London <span class="emoji">🚂</span> Düren</h3>
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
    schaetzchen(): boolean {
      return this.$store.state.user !== "lars@gmail.com";
    },
  },
  methods: {
    special(year: number, month: number, day: number): number {
      const now = new Date();
      const specialDate = new Date(year, month, day);
      return (
        Math.floor(
          (specialDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
        ) + 1
      );
    },
    greeting(): string {
      const now = new Date();
      const hours = now.getHours();
      if (5 <= hours && hours <= 11) {
        return '<span class="emoji main-emoji">🌞</span><h2>Guten Morgen</h2><h3>Schönen Tag, meine Kleine 🦋</h3>';
      } else if (11 < hours && hours <= 14) {
        return '<span class="emoji main-emoji">🌼</span><h2>Schönen Mittag</h2><h3>Caroline 🦋</h3>';
      } else if (14 < hours && hours <= 17) {
        return '<span class="emoji main-emoji">☕</span><h2>Schönen Nachmittag</h2><h3>Caroline 🦋</h3>';
      } else if (17 < hours && hours <= 22) {
        return '<span class="emoji main-emoji">🌜</span><h2>Schönen Abend,</h2><h3>mein kleines Schätzchen 🥰</h3>';
      } else {
        return '<span class="emoji main-emoji">😴</span><h2>Schlaf schön!</h2><h3> Gute Nacht, meine Kleine ♥️</h3>';
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

div + h3,
h3 + h3 {
  margin-top: 10px;
}

.main-img {
  max-width: 100%;
  height: 60%;
  padding: 30px;
  object-fit: contain;
}

aside {
  height: 41%;
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
