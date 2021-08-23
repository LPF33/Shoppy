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
      <option value="Supermarkt">Supermarkt</option>
      <option value="Drogerie">Drogerie</option>
      <option value="Versicherung">Versicherung</option>
      <option value="Rundfunk">Rundfunk</option>
      <option value="Bofrost">Bofrost</option>
      <option value="Urlaub">Urlaub</option>
      <option value="Amazon">Amazon</option>
    </select>
    <button>💲</button>
  </form>
</template>

<script>
import { shoppyFirestore } from "@/firebase/config";

export default {
  name: "AddExpense",
  data() {
    return {
      amount: null,
      name: "Caroline",
      category: "Supermarkt",
      closed: false,
    };
  },
  methods: {
    async addExpense() {
      let { amount, name, category, closed } = this;
      amount = amount.replace(",", ".");
      amount = parseFloat(amount);
      if (Number.isNaN(amount) || amount <= 0) {
        this.amount = "";
        return;
      }
      const item = {
        amount: parseInt(amount * 100),
        name,
        category,
        created_at: new Date(),
        closed,
      };
      await shoppyFirestore.collection("budget").add(item);
      this.amount = "";
    },
    close() {
      this.$emit("close-add-expense");
    },
  },
};
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
