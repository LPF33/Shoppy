<template>
  <form @submit.prevent="addExpense" @click.self="close">
    <label for="amount">Wie viel ?</label>
    <input type="text" v-model="amount" id="amount" placeholder="0.00€" />
    <label for="name">Wer ?</label>
    <select v-model="name">
      <option value="Caroline">Caroline</option>
      <option value="Lars">Lars</option>
    </select>
    <label for="category">Kategorie ?</label>
    <select v-model="category">
      <option v-for="item in categories" :value="item" :key="item">
        {{ item }}
      </option>
    </select>
    <button>💲</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { shoppyFirestore } from "@/firebase/config";
import { IExpenses, CategoryTuple } from "@/Types/Budget";

export default defineComponent({
  name: "AddExpense",
  emit: ["submit", "click", "close-add-expense"],
  setup() {
    const amount = ref("");
    const categories: CategoryTuple = [
      "Supermarkt",
      "Drogerie",
      "Versicherung",
      "Rundfunk",
      "Bofrost",
      "Urlaub",
      "Amazon",
    ];
    const state: Omit<IExpenses, "created_at" | "amount"> = reactive({
      name: "Caroline",
      category: "Supermarkt",
      closed: false,
    });

    async function addExpense() {
      let { name, category, closed } = state;
      let str = amount.value;
      str = str.replace(",", ".");
      let num = parseFloat(str);
      if (Number.isNaN(num) || num <= 0) {
        amount.value = "";
        return;
      }
      const item: IExpenses = {
        amount: Math.floor(num * 100),
        name,
        category,
        created_at: new Date(),
        closed,
      };
      await shoppyFirestore.collection("budget").add(item);
      amount.value = "";
    }

    return { amount, categories, ...toRefs(state), addExpense };
  },
  methods: {
    close() {
      this.$emit("close-add-expense");
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
  padding: 20px;
  background-color: #2940d3;
  z-index: 100;
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
  border-radius: 10px;
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
