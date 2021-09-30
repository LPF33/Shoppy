<template>
  <section>
    <h1>Budget</h1>
    <div>
      <AddExpense
        v-if="showAddExpense"
        @close-add-expense="toggleExpense"
        :min-month="minOpenMonth"
      />
      <CurrentExpenses
        v-if="openExpenses.length > 0"
        :current-expenses="openExpenses"
        :min-month="minOpenMonth"
      />
      <div id="monthly-expenses">
        <ExpensesChart
          v-if="monthlyExpenses.length > 0"
          :monthly-expenses="monthlyExpenses"
        />
      </div>
    </div>
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
import AddExpense from "@/components/Budget/AddExpense.vue";
import CurrentExpenses from "@/components/Budget/CurrentExpenses.vue";
import ExpensesChart from "@/components/Budget/ExpensesChart.vue";
import { shoppyFirestore } from "@/firebase/config";
import { IBudgetData, IExpenses, IMonthlyExpenses } from "@/Types/Budget";
import { useStore } from "vuex";
import { IStoreState, MutationTypes } from "@/Types/Store";

export default defineComponent({
  name: "Budget",
  components: {
    AddExpense,
    CurrentExpenses,
    ExpensesChart,
  },
  emit: ["click"],
  setup() {
    const state: IBudgetData = reactive({
      showAddExpense: false,
      expenses: [],
      unsubscribeExpenses: null,
    });

    const store = useStore<IStoreState>();

    const openExpenses = computed(
      () => state.expenses.filter((item) => !item.closed) as IExpenses[]
    );

    const monthlyExpenses = computed(
      () => state.expenses.filter((item) => item.closed) as IMonthlyExpenses[]
    );

    const minOpenMonth = computed(() => {
      if (!openExpenses.value.length) {
        return null;
      }
      const minMonthVal = openExpenses.value.reduce((acc, cur) =>
        acc.monthNum < cur.monthNum ? acc : cur
      );
      return minMonthVal.month;
    });

    function toggleExpense() {
      state.showAddExpense = !state.showAddExpense;
    }

    (() => {
      try {
        state.unsubscribeExpenses = shoppyFirestore
          .collection("budget")
          .onSnapshot((doc) => {
            state.expenses = doc.docs.map((item) => item.data()) as IExpenses[];
          });
      } catch (error) {
        store.commit(MutationTypes.SET_ERROR, error.message);
      }
    })();

    onBeforeUnmount(() => {
      if (typeof state.unsubscribeExpenses === "function") {
        state.unsubscribeExpenses();
      }
    });

    return {
      ...toRefs(state),
      openExpenses,
      monthlyExpenses,
      minOpenMonth,
      toggleExpense,
    };
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

section > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: calc(2rem + 20px);
  bottom: 8rem;
  max-width: 500px;
  width: 90vw;
  overflow-y: auto;
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
