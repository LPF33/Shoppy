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
    <label for="month">Monat ?</label>
    <select v-model="month">
      <option v-for="m in monthTuple" :value="m" :key="m">
        {{ m }}
      </option>
    </select>
    <button>💲</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { shoppyFirestore } from "@/firebase/config";
import { IExpenses, CategoryTuple, EMonth, TMonth } from "@/Types/Budget";
import { useStore } from "vuex";
import { IStoreState, MutationTypes } from "@/Types/Store";

export default defineComponent({
  name: "AddExpense",
  emit: ["submit", "click", "close-add-expense"],
  setup() {
    const store = useStore<IStoreState>();
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
    const monthTuple = Object.keys(EMonth).filter((item) =>
      Number.isNaN(+item)
    ) as TMonth[];
    const date = new Date();
    const state: Omit<IExpenses, "amount" | "year" | "monthNum" | "key"> =
      reactive({
        name: "Caroline",
        category: "Supermarkt",
        month: monthTuple[date.getMonth()],
        closed: false,
      });

    async function addExpense() {
      let { name, category, closed, month } = state;
      let str = amount.value;
      str = str.replace(",", ".");
      let num = parseFloat(str);
      if (Number.isNaN(num) || num <= 0) {
        amount.value = "";
        return;
      }
      const item: Omit<IExpenses, "key"> = {
        amount: Math.floor(num * 100),
        name,
        category,
        month,
        monthNum: EMonth[month],
        year: date.getFullYear(),
        closed,
      };
      try {
        const ref = await shoppyFirestore.collection("budget").add(item);
        await shoppyFirestore.collection("budget").doc(ref.id).set(
          {
            key: ref.id,
          },
          { merge: true }
        );
      } catch (error) {
        store.commit(MutationTypes.SET_ERROR, error.message);
      }

      amount.value = "";
    }

    return { amount, categories, ...toRefs(state), addExpense, monthTuple };
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  padding: 20px;
  background-color: rgb(248, 124, 87);
  z-index: 100;
}

label {
  color: rgb(153, 55, 55);
  font-weight: bold;
}

input,
select {
  font-size: 1.5rem;
  margin: 10px 0;
  padding: 5px;
  color: "slategrey";
  height: 45px;
  text-align: center;
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
