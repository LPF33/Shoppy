<template>
  <div class="cooky-add-meal">
    <span @click.self="closeModal">🌭🍕🍔🍳🧇🥞🍖🥩🍣🍩</span>
    <span @click.self="closeModal">🥑🍐🍏🍈🍉🍋🍆🌽🍅🍓🥦</span>
    <span @click.self="closeModal">🍿🧈🥯🌯🥗🍗🍙🍱🍍🥭🍎</span>
    <span @click.self="closeModal">🥨🥐🍞🧈🥗🍙🍭🍹🥛🧁</span>
    <section>
      <h1>Was soll's sein?</h1>
      <input type="text" v-model="meal" placeholder="?" />
      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />
      <button @click="addNewMeal">➕</button>
      <button id="delete-meal" v-if="existingKey" @click="deleteMeal">
        ❌
      </button>
    </section>
  </div>
</template>

<script>
import { shoppyFirestore } from "@/firebase/config";

export default {
  name: "CookyAddMeal",
  props: ["dataObject"],
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

        this.startDate = this.dateFormat(
          this.today.getFullYear(),
          this.today.getMonth(),
          dataObj.startNum
        );
        if ("key" in dataObj) {
          this.existingKey = dataObj.key;
          this.meal = dataObj?.meal || "";
          this.endDate = dataObj.endDate;
          return;
        }

        this.autoNextDay();
      },
      startDate() {
        this.autoNextDay();
      },
    },
  },
  methods: {
    dateFormat(year, month, day) {
      month = month + 1;
      return `${year}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
      }`;
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
        console.log(error);
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
        console.log(error);
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

section {
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
