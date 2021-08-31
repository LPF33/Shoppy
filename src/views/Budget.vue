<template>
  <section>
    <h1>Budget</h1>
    <AddExpense v-if="showAddExpense" @close-add-expense="toggleExpense" />
    <CurrentExpenses
      v-if="filterOpenExpenses.length > 0"
      :current-expenses="filterOpenExpenses"
    />
    <footer>
      <button @click="toggleExpense">➕</button>
    </footer>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  reactive,
  toRefs,
} from "vue";
import AddExpense from "@/components/AddExpense.vue";
import CurrentExpenses from "@/components/CurrentExpenses.vue";
import { shoppyFirestore } from "@/firebase/config";
import { IBudgetData, IExpenses } from "@/Types/Budget";

export default defineComponent({
  name: "Budget",
  components: {
    AddExpense,
    CurrentExpenses,
  },
  emit: ["click"],
  setup() {
    const state: IBudgetData = reactive({
      showAddExpense: false,
      expenses: [],
      unsubscribeExpenses: null,
    });

    const filterOpenExpenses = computed(() =>
      state.expenses.filter((item) => !item.closed)
    );

    function toggleExpense() {
      state.showAddExpense = !state.showAddExpense;
    }

    (() => {
      state.unsubscribeExpenses = shoppyFirestore
        .collection("budget")
        .onSnapshot((doc) => {
          state.expenses = doc.docs.map((item) => item.data()) as IExpenses[];
        });
    })();

    onBeforeUnmount(() => {
      if (typeof state.unsubscribeExpenses === "function") {
        state.unsubscribeExpenses();
      }
    });

    return { ...toRefs(state), filterOpenExpenses, toggleExpense };
  },
});
</script>

<style scoped>
section {
  position: relative;
  background-color: #232323;
  width: 100%;
  height: 100%;
  color: #ffeda3;
  text-align: center;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  user-select: none;
}

footer {
  position: absolute;
  bottom: 10px;
  margin-top: 2rem;
  max-width: 500px;
  width: 100vw;
}

button {
  height: 6rem;
  width: 6rem;
  font-size: 3rem;
  border: 1px solid grey;
  border-radius: 50%;
  line-height: 1.5;
  padding: 10px;
  cursor: pointer;
  user-select: none;
}
</style>
