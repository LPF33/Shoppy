<template>
  <div class="shopping-item">
    <div @click="selectedItem" :class="{ done: item.done }">
      <p>{{ item.name }}</p>
      <p v-if="item.value">{{ item.value }}</p>
    </div>
    <button @click="deleteItem">❌</button>
  </div>
</template>

<script>
import { shoppyFirestore } from "@/firebase/config";

export default {
  name: "ShoppingItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async deleteItem() {
      try {
        await shoppyFirestore.collection("shoppy").doc(this.item.key).delete();
      } catch (err) {
        console.log(err);
      }
    },
    async selectedItem() {
      try {
        await shoppyFirestore
          .collection("shoppy")
          .doc(this.item.key)
          .update({ done: !this.item.done });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.shopping-item {
  display: flex;
  width: 100%;
  border-bottom: 1px solid grey;
  user-select: none;
}

.shopping-item > div {
  display: flex;
  flex-grow: 1;
  cursor: pointer;
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
