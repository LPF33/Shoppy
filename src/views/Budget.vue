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

<script>
import AddExpense from "@/components/AddExpense.vue";
import CurrentExpenses from "@/components/CurrentExpenses.vue";
import { shoppyFirestore } from "@/firebase/config";

export default {
  name: "Budget",
  components: {
    AddExpense,
    CurrentExpenses,
  },
  data() {
    return {
      showAddExpense: false,
      expenses: [],
      unsubscribeExpenses: null,
    };
  },
  methods: {
    toggleExpense() {
      this.showAddExpense = !this.showAddExpense;
    },
  },
  computed: {
    filterOpenExpenses() {
      return this.expenses.filter((item) => !item.closed);
    },
  },
  mounted() {
    this.unsubscribeExpenses = shoppyFirestore
      .collection("budget")
      .onSnapshot((doc) => {
        this.expenses = doc.docs.map((item) => item.data());
      });
  },
  beforeUnmount() {
    if (typeof this.unsubscribeExpenses === "function") {
      this.unsubscribeExpenses();
    }
  },
};
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
