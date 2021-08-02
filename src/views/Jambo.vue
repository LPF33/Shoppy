<template>
  <div class="jambo-section">
    <h1>Jambo</h1>
    <h2 v-if="!counter">Start</h2>
    <h2 v-else>Spielzug: {{ counter }}</h2>
    <section v-if="visual">
      <div v-for="(item, index) in visual" :key="index" class="runde">🎲</div>
    </section>
    <button @click="increment">➕</button>
    <button @click="reset">⚪</button>
  </div>
</template>

<script>
export default {
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
    visual() {
      return this.counter > 0 ? new Array(this.counter) : null;
    },
  },
};
</script>

<style scoped>
.jambo-section {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #ffeda3;
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
