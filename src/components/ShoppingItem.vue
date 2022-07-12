<template>
  <div class="shopping-item">
    <div @click="selectedItem" :class="{ done: item.done }">
      <p>{{ item.name }}</p>
      <p v-if="item.value">{{ item.value }}</p>
    </div>
    <button @click="deleteItem">❌</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { MutationTypes, ISupermarktItem, IDrogerieItem } from "@/Types/Store";
import { shoppyFirestore } from "@/firebase/config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

export default defineComponent({
  name: "ShoppingItem",
  props: {
    item: {
      type: Object as PropType<ISupermarktItem | IDrogerieItem>,
      required: true,
    },
  },
  methods: {
    async deleteItem() {
      try {
        await deleteDoc(doc(shoppyFirestore, "shoppy", this.item.key));
      } catch (error) {
        this.$store.commit(MutationTypes.SET_ERROR, error);
      }
    },
    async selectedItem() {
      try {
        await updateDoc(doc(shoppyFirestore, "shoppy", this.item.key), {
          done: !this.item.done,
        });
      } catch (error) {
        this.$store.commit(MutationTypes.SET_ERROR, error);
      }
    },
  },
});
</script>

<style scoped>
.shopping-item {
  display: flex;
  width: 100%;
  border-bottom: 1px solid grey;
  user-select: none;
  overflow: hidden;
}

.shopping-item > div {
  display: flex;
  flex-grow: 1;
  cursor: pointer;
  white-space: nowrap;
  overflow-x: auto;
}

.shopping-item > div.done {
  text-decoration: line-through;
  color: grey;
}

p {
  padding: 10px;
  font-size: 1.5rem;
}

button {
  font-size: 2rem;
  cursor: pointer;
  background: none;
}
</style>
