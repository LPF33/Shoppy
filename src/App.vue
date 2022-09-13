<template>
  <main>
    <router-view />
  </main>
  <Navbar />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";
import { ActionTypes, MutationTypes, IStoreState } from "@/Types/Store";
import { useStore } from "vuex";
import Navbar from "@/components/Navbar.vue";

export default defineComponent({
  components: { Navbar },
  setup() {
    const store = useStore<IStoreState>();

    onMounted(() => {
      store.dispatch(ActionTypes.CHECK_AUTH);
    });

    onUnmounted(() => {
      store.commit(MutationTypes.UNSUBSCRIBE_FIREBASE);
    });
  },
});
</script>

<style>
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
}

:root {
  --dark-grey: #232323;
  --light-grey: rgba(184, 184, 184);
  --color-red: rgb(255, 92, 92);
  --yellow: #ffeda3;
}

#app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: var(--vh, 100vh);
}

h2,
h3 {
  font-weight: normal;
}

main {
  flex-grow: 1;
  background-color: var(--dark-grey);
}

span.emoji {
  font-size: 2.5rem;
  vertical-align: middle;
}

.main-emoji {
  position: absolute;
  top: 90%;
  left: 15px;
  transform: translateY(-50%);
}
</style>
