<template>
  <section>
    <h1>Jambo</h1>
    <h2 v-if="!counter">Start</h2>
    <h2 v-else>Spielzug: {{ counter }}</h2>
    <div v-if="visual">
      <div v-for="(item, index) in visual" :key="index" class="runde">
        <font-awesome-icon
          icon="fa-duotone fa-card-heart"
          style="
            --fa-secondary-opacity: 1;
            --fa-primary-color: rgb(255, 92, 92);
            --fa-secondary-color: white;
          "
        />
      </div>
    </div>
    <button @click="increment">
      <font-awesome-icon
        icon="fa-duotone fa-cards-blank"
        style="
          --fa-secondary-opacity: 1;
          --fa-primary-color: rgb(246, 90, 131);
          --fa-secondary-color: rgb(127, 183, 126);
        "
      />
    </button>
    <button @click="reset">
      <font-awesome-icon
        icon="fa-duotone fa-eraser"
        style="
          --fa-secondary-opacity: 1;
          --fa-primary-color: red;
          --fa-secondary-color: black;
        "
      />
    </button>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Jambo",
  data() {
    return {
      counter: 0,
    };
  },
  methods: {
    increment() {
      if (this.counter >= 5) {
        this.reset();
        return;
      }
      this.counter++;
    },
    reset() {
      this.counter = 0;
    },
  },
  computed: {
    visual(): any[] | null {
      return this.counter > 0 ? new Array(this.counter) : null;
    },
  },
});
</script>

<style scoped>
section {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: rgb(255, 232, 152);
  user-select: none;
}

h1,
h2 {
  margin: 10px 0;
}

button {
  display: block;
  font-size: 3rem;
  height: 6rem;
  width: 6rem;
  border: 1px solid grey;
  border-radius: 50%;
  background-color: transparent;
  line-height: 1.5;
  padding: 10px;
  cursor: pointer;
  margin-top: 2rem;
  user-select: none;
  box-shadow: 0 0 8px black;
}

.runde {
  font-size: 3rem;
}
</style>
