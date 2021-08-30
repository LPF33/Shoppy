<template>
  <form @submit.prevent="addNewItem" @click.self="close">
    <input type="text" placeholder="Add item" v-model="item.name" />
    <input type="text" placeholder="How much?" v-model="item.value" />
    <select v-model="item.category">
      <option value="Supermarkt">Supermarkt</option>
      <option value="Drogerie">Drogerie</option>
    </select>
    <button>🛒</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { shoppyFirestore } from "@/firebase/config";

export default defineComponent({
  name: "AddItem",
  props: {
    index: {
      type: Number,
      default: 1,
    },
    selected: {
      type: String as PropType<"Supermarkt" | "Drogerie">,
      required: true,
      default: "Supermarkt",
    },
  },
  data() {
    return {
      item: {
        name: "",
        value: "",
        category: this.selected,
        done: false,
        list_id: this.index,
      },
    };
  },
  methods: {
    async addNewItem() {
      if (this.item?.name) {
        const ref = await shoppyFirestore.collection("shoppy").add(this.item);
        await shoppyFirestore.collection("shoppy").doc(ref.id).set(
          {
            key: ref.id,
          },
          { merge: true }
        );
        this.item.name = this.item.value = "";
      }
    },
    close() {
      this.$emit("close");
    },
  },
  watch: {
    index(id: number) {
      this.item.list_id = id;
    },
  },
});
</script>

<style scoped>
form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  margin: 5px;
  height: 60vh;
  background-color: #2940d3;
}

input,
select {
  font-size: 1.5rem;
  margin: 10px 0;
  padding: 5px;
  color: "slategrey";
  height: 45px;
  text-align: center;
  background-color: #ffeda3;
}

select {
  font-size: 1rem;
}

button {
  font-size: 3rem;
  height: 6rem;
  width: 6rem;
  border: 1px solid grey;
  border-radius: 50%;
  line-height: 1.5;
  padding: 10px;
  cursor: pointer;
  margin-top: 0.5rem;
  user-select: none;
}
</style>
