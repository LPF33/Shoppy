<template>
  <section>
    <div class="grid">
      <div>Wochenereignisse</div>
      <div>
        <img :src="`${publicPath}img/cuddly_bears.gif`" alt="cuddly bears" />
      </div>
      <div>Kochen</div>
      <div></div>
      <div></div>
      <div>
        <router-link :to="{ name: 'Budget' }">
          <span
            ><font-awesome-icon icon="fa-duotone fa-chart-mixed" class="icon"
          /></span>
        </router-link>
      </div>
      <div>
        <router-link :to="{ name: 'Budget' }">
          <span
            ><font-awesome-icon icon="fa-duotone fa-gear" class="icon"
          /></span>
        </router-link>
      </div>
    </div>
    <aside v-html="greeting()"></aside>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Main",
  data() {
    return {
      publicPath: process.env.BASE_URL,
      self: this.$store.state.user === "lars@gmail.com",
    };
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
        return `<span class="emoji main-emoji">🌞</span><h2>Guten Morgen</h2>${
          !this.self ? "<h3>Schönen Tag, meine Kleine 🦋</h3>" : ""
        }`;
      } else if (11 < hours && hours <= 14) {
        return `<span class="emoji main-emoji">🦋</span><h2>Schönen Mittag</h2>${
          !this.self ? "<h3>Caroline 🦋</h3>" : ""
        }`;
      } else if (14 < hours && hours <= 17) {
        return `<span class="emoji main-emoji">🌼</span><h2>Schönen Nachmittag</h2>${
          !this.self ? "<h3>Caroline 🦋</h3>" : ""
        }`;
      } else if (17 < hours && hours <= 22) {
        return `<span class="emoji main-emoji">🌜</span><h2>Schönen Abend!</h2>${
          !this.self ? "<h3>Mein kleines Schätzchen 🥰</h3>" : ""
        }`;
      } else {
        return `<span class="emoji main-emoji">😴</span><h2>Schlaf schön!</h2>${
          !this.self ? "<h3> Gute Nacht, meine Kleine ♥️</h3>" : ""
        }`;
      }
    },
  },
});
</script>

<style scoped>
section {
  position: relative;
  background-color: white;
  width: 100%;
  height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid {
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: repeat(4, min(150px, 25%));
  grid-template-columns: repeat(4, min(150px, 25%));
  gap: 5px;
  justify-content: center;
  align-content: center;
  grid-template-areas:
    "event event img img"
    "event event img img"
    "cooky cooky icon icon2"
    "cooky cooky icon3 icon4";
  width: 100%;
  height: 90%;
}

.grid div:first-child {
  grid-area: event;
}

.grid div:nth-child(2) {
  background-color: white;
  border-radius: 10px;
  margin: 20px;
  grid-area: img;
}

.grid div:nth-child(3) {
  grid-area: cooky;
}

.grid img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.grid .icon {
  font-size: 5rem;
  --fa-secondary-opacity: 1;
  --fa-primary-color: black;
  --fa-secondary-color: white;
}

aside {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 10%;
  background-color: #232323;
  color: rgb(255, 255, 255);
  border-radius: 50px 0 0 0;
  padding-left: 60px;
}
</style>
