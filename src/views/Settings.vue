<template>
  <h1>Settings</h1>
  <router-link :to="{ name: 'Budget' }" class="route-budget">
    <span
      ><font-awesome-icon icon="fa-duotone fa-sack-dollar" class="sack"
    /></span>
  </router-link>
  <form @submit.prevent="saveInfo">
    <label for="info">Neue Info eingeben:</label>
    <input id="info" type="text" v-model="info" />
    <button type="submit">Info speichern</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { IStoreState, MutationTypes } from "@/Types/Store";
import { shoppyFirestore } from "@/firebase/config";
import { doc, updateDoc } from "firebase/firestore";

export default defineComponent({
  name: "Settings",
  setup() {
    const store = useStore<IStoreState>();

    const info = ref("");

    async function saveInfo() {
      try {
        await updateDoc(doc(shoppyFirestore, "general", "info"), {
          message: info.value,
        });
        info.value = "";
      } catch (err) {
        store.commit(MutationTypes.SET_ERROR, "Firebase update info");
      }
    }

    return { info, saveInfo };
  },
});
</script>

<style scoped>
h1 {
  color: var(--yellow);
  text-align: center;
}

form {
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  color: white;
}

input {
  font-size: 1.5rem;
  margin: 10px 0;
  padding: 5px;
  color: "slategrey";
  height: 45px;
  text-align: center;
  background-color: white;
  border-radius: 10px;
}

form button {
  font-size: 1rem;
  border: 1px solid grey;
  background-color: var(--light-grey);
  color: black;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  user-select: none;
}

.route-budget {
  position: absolute;
  top: 10px;
  right: 10px;
}
.sack {
  font-size: 2rem;
  --fa-secondary-opacity: 1;
  --fa-primary-color: rgb(64, 64, 64);
  --fa-secondary-color: rgb(255, 196, 0);
}
</style>
