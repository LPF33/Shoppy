<template>
  <button @click="closeMonth">{{ minMonth }} abschließen 📆</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IMonthlyExpenses, IExpenses, TMonth } from "@/Types/Budget";
import { shoppyFirestore } from "@/firebase/config";
import { useStore } from "vuex";
import { IStoreState, MutationTypes } from "@/Types/Store";

export default defineComponent({
  name: "CloseMonth",
  props: {
    minMonth: { type: String as PropType<TMonth>, required: true },
    minMonthExpenses: { type: Array as PropType<IExpenses[]>, required: true },
  },
  setup(props) {
    async function closeMonth() {
      const store = useStore<IStoreState>();
      const date = new Date();
      const monthlyExpenses: IMonthlyExpenses = {
        Supermarkt: 0,
        Drogerie: 0,
        Versicherung: 0,
        Rundfunk: 0,
        Bofrost: 0,
        Urlaub: 0,
        Amazon: 0,
        month: props.minMonth,
        year: date.getFullYear(),
        closed: true,
      };
      try {
        for (let item of props.minMonthExpenses) {
          monthlyExpenses[item.category] += item.amount;
          await shoppyFirestore.collection("budget").doc(item.key).delete();
        }

        await shoppyFirestore.collection("budget").add(monthlyExpenses);
      } catch (error) {
        store.commit(MutationTypes.SET_ERROR, error.message);
      }
    }

    return { closeMonth };
  },
});
</script>

<style></style>
