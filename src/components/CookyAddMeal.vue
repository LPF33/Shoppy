<template>
  <div class="cooky-add-meal">
    <span @click.self="closeModal">🌭🍕🍔🍳🧇🥞🍖🥩🍣🍩</span>
    <span @click.self="closeModal">🥑🍐🍏🍈🍉🍋🍆🌽🍅🍓🥦</span>
    <span @click.self="closeModal">🍿🧈🥯🌯🥗🍗🍙🍱🍍🥭🍎</span>
    <span @click.self="closeModal">🥨🥐🍞🧈🥗🍙🍭🍹🥛🧁</span>
    <form @submit.prevent>
      <h1>Was soll's sein?</h1>
      <input type="text" v-model="meal" placeholder="?" />
      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />
      <button @click="addNewMeal">➕</button>
      <button id="delete-meal" v-if="existingKey" @click="deleteMeal">
        ❌
      </button>
    </form>
  </div>
</template>

<script>
import { shoppyFirestore } from "@/firebase/config";

export default {
  name: "CookyAddMeal",
  props: {
    dataObject: {
      type: [Object, null],
    },
  },
  data() {
    return {
      today: new Date(),
      startDate: null,
      endDate: null,
      meal: "",
      existingKey: false,
    };
  },
  watch: {
    dataObject: {
      deep: true,
      handler(dataObj) {
        this.meal = "";
        this.existingKey = false;

        if ("key" in dataObj) {
          this.startDate = dataObj.startDate;
          this.existingKey = dataObj.key;
          this.meal = dataObj.meal || "";
          this.endDate = dataObj.endDate;
          return;
        }

        this.startDate = this.dateFormat(
          dataObj.startDate.getFullYear(),
          dataObj.startDate.getMonth(),
          dataObj.startNum
        );

        this.autoNextDay();
      },
      startDate() {
        this.autoNextDay();
      },
    },
  },
  methods: {
    dateFormat(year, month, day) {
      return `${year}-${this.padTime(++month)}-${this.padTime(day)}`;
    },
    autoNextDay() {
      let nextDay = new Date(this.startDate);
      nextDay.setDate(nextDay.getDate() + 1);
      this.endDate = this.dateFormat(
        nextDay.getFullYear(),
        nextDay.getMonth(),
        nextDay.getDate()
      );
    },
    padTime(val, len = 2) {
      return val.toString().padStart(len, "0");
    },
    closeModal() {
      this.$emit("close");
    },
    async addNewMeal() {
      try {
        // insert new data
        if (this.meal && !this.existingKey) {
          const ref = await shoppyFirestore.collection("cooky").add({
            meal: this.meal,
            startDate: this.startDate,
            endDate: this.endDate,
          });
          await shoppyFirestore.collection("cooky").doc(ref.id).set(
            {
              key: ref.id,
            },
            { merge: true }
          );
        } else {
          // or do update existing data
          await shoppyFirestore
            .collection("cooky")
            .doc(this.existingKey)
            .update({
              meal: this.meal,
              startDate: this.startDate,
              endDate: this.endDate,
            });
          this.$emit("close");
        }
        this.meal = "";
      } catch (error) {
        this.$store.commit("setError", error);
      }
    },
    async deleteMeal() {
      try {
        await shoppyFirestore
          .collection("cooky")
          .doc(this.existingKey)
          .delete();
        this.$emit("close");
      } catch (error) {
        this.$store.commit("setError", error);
      }
    },
  },
};
</script>

<style scoped>
.cooky-add-meal {
  position: relative;
  width: 500px;
  max-width: 100vw;
  height: 60vh;
  margin: 0 auto;
  background-color: rgb(0, 0, 0);
  color: white;
  border-radius: 10px;
  margin-top: 10px;
  overflow: hidden;
}

h1 {
  background-color: black;
  border-radius: 10px;
}

span {
  padding: 10px;
  white-space: nowrap;
  width: 100%;
  height: 2rem;
  font-size: 2rem;
}

span:nth-of-type(2) {
  position: absolute;
  top: 0;
  right: 0;
  transform: rotate(-90deg) translate(-2rem, -200%);
  transform-origin: top right;
}

span:nth-of-type(3) {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(90deg) translate(2rem, -200%);
  transform-origin: top left;
}

span:nth-of-type(4) {
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateY(-100%);
}

form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

input {
  font-size: 1.5rem;
  margin: 10px 0;
  padding: 5px;
  color: "slategrey";
  height: 45px;
  text-align: center;
  background-color: white;
  border-radius: 10px;
}

[type="date"] {
  display: block;
  margin: 0 auto;
  margin-top: 10px;
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
  margin: 10px 0 0 10px;
  user-select: none;
}
</style>
