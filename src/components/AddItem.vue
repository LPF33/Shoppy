<template>
  <button @click="addNewItem">
    <span>+</span>
    <p>Listeneintrag</p>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { shoppyFirestore } from "@/firebase/config";
import { collection, addDoc, setDoc } from "firebase/firestore";
import { MutationTypes } from "@/Types/Store";

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
        last: true,
        category: this.selected,
        done: false,
        list_id: this.index,
      },
    };
  },
  methods: {
    async addNewItem() {
      try {
        const ref = await addDoc(
          collection(shoppyFirestore, "shoppy"),
          this.item
        );
        await setDoc(ref, { key: ref.id }, { merge: true });
      } catch (error) {
        this.$store.commit(MutationTypes.SET_ERROR, error);
      }
    },
  },
  watch: {
    index(id: number) {
      this.item.list_id = id;
    },
    selected(selected: "Supermarkt" | "Drogerie") {
      this.item.category = selected;
    },
  },
});
</script>

<style scoped>
button {
  display: flex;
  gap: 10px;
  width: 100%;
  font-size: 1.5rem;
  line-height: 1.5;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  color: inherit;
  background-color: inherit;
}

button:hover {
  background-color: rgba(184, 184, 184, 0.3);
}
</style>
