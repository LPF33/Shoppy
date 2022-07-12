<template>
  <button @click="toggleModal = !toggleModal" v-if="!toggleModal">
    {{ minMonth }} abschließen 📆
  </button>
  <div v-else>
    <button @click="closeMonth" class="modal-buttons">✔</button>
    <button @click="toggleModal = !toggleModal" class="modal-buttons">
      ❌
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { IMonthlyExpenses, IExpenses, TMonth } from "@/Types/Budget";
import { shoppyFirestore } from "@/firebase/config";
import { collection, doc, addDoc, deleteDoc } from "firebase/firestore";
import { useStore } from "vuex";
import { IStoreState, MutationTypes } from "@/Types/Store";

export default defineComponent({
  name: "CloseMonth",
  props: {
    minMonth: { type: String as PropType<TMonth>, required: true },
    minMonthExpenses: { type: Array as PropType<IExpenses[]>, required: true },
  },
  setup(props) {
    const toggleModal = ref(false);

    async function closeMonth() {
      const store = useStore<IStoreState>();
      const monthlyExpenses: IMonthlyExpenses = {
        Supermarkt: 0,
        Drogerie: 0,
        Versicherung: 0,
        Rundfunk: 0,
        Bofrost: 0,
        Urlaub: 0,
        Amazon: 0,
        month: props.minMonth,
        year: Date.now(),
        closed: true,
      };
      try {
        for (let item of props.minMonthExpenses) {
          monthlyExpenses[item.category] += item.amount;
          await deleteDoc(doc(shoppyFirestore, "budget", item.key));
        }

        await addDoc(collection(shoppyFirestore, "budget"), monthlyExpenses);
      } catch (error) {
        store.commit(MutationTypes.SET_ERROR, error.message);
      }
    }

    return { closeMonth, toggleModal };
  },
});
</script>

<style>
.modal-buttons {
  background-color: transparent;
  font-size: 3rem;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  margin: 20px;
}
</style>
