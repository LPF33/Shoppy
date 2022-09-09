<template>
  <section>
    <div class="grid">
      <div class="img">
        <img :src="`${publicPath}img/cuddly_bears.gif`" alt="cuddly bears" />
      </div>
      <div class="routes">
        <router-link :to="{ name: 'Budget' }">
          <span
            ><font-awesome-icon
              icon="fa-duotone fa-sack-dollar"
              class="icon sack"
          /></span>
        </router-link>
        <router-link :to="{ name: 'Settings' }">
          <span
            ><font-awesome-icon icon="fa-duotone fa-gear" class="icon"
          /></span>
        </router-link>
      </div>
      <div class="message"></div>
      <CookyPreview class="cooky" />
      <CheckSport class="sport" />
    </div>
    <aside v-html="greeting()"></aside>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CookyPreview from "@/components/CookyPreview.vue";
import CheckSport from "@/components/CheckSport.vue";

export default defineComponent({
  name: "Main",
  components: { CookyPreview, CheckSport },
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
        return `<span class="emoji main-emoji">🌞</span><h2>Guten Morgen!</h2>${
          !this.self ? "<h3>Schönen Tag, meine Kleine 🦋</h3>" : ""
        }`;
      } else if (11 < hours && hours <= 14) {
        return `<span class="emoji main-emoji">🦋</span><h2>Schönen Mittag!</h2>${
          !this.self ? "<h3>Caroline 🦋</h3>" : ""
        }`;
      } else if (14 < hours && hours <= 17) {
        return `<span class="emoji main-emoji">🌼</span><h2>Schönen Nachmittag!</h2>${
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
  justify-content: space-between;
}

.grid {
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: 55% repeat(3, min(150px, 15%));
  grid-template-columns: repeat(4, min(150px, 25%));
  justify-content: center;
  align-content: center;
  grid-template-areas:
    "img img img settings"
    "info info info info"
    "sport sport cooky cooky"
    "sport sport cooky cooky";
  max-width: 100%;
  height: calc(90% - 40px);
}

.grid .sport {
  grid-area: sport;
}

.grid .img {
  background-color: white;
  border-radius: 10px;
  grid-area: img;
}

.grid .cooky {
  grid-area: cooky;
}

.grid img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.grid .routes {
  grid-area: settings;
  justify-self: end;
  padding: 5px 10px 0 0;
}

.grid .routes a {
  display: inline-block;
  padding: 5px;
}

.grid .icon {
  font-size: 2rem;
  --fa-secondary-opacity: 1;
  --fa-primary-color: black;
  --fa-secondary-color: rgb(209, 209, 209);
}

.grid .icon.sack {
  --fa-primary-color: rgb(64, 64, 64);
  --fa-secondary-color: rgb(255, 196, 0);
}

aside {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 11%;
  background-color: #232323;
  color: rgb(255, 255, 255);
  border-radius: 50px 0 0 0;
  padding-left: 60px;
}
</style>
