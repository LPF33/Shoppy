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

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { dateFormat } from "@/utilities/calendarFunctions";
import { IComputedMealList, ICookyAddMealData, INewMeal } from "@/Types/Cooky";
import { IStoreState, MutationTypes } from "@/Types/Store";
import { shoppyFirestore } from "@/firebase/config";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default defineComponent({
  name: "CookyAddMeal",
  props: {
    dataObject: {
      type: Object as PropType<IComputedMealList | INewMeal>,
      required: true,
    },
  },
  setup(props, context) {
    const data = reactive<ICookyAddMealData>({
      today: new Date(),
      startDate: null,
      endDate: null,
      meal: "",
      existingKey: false,
    });

    const store = useStore<IStoreState>();

    onMounted(function handler() {
      const newValue = props.dataObject;

      if ("key" in newValue) {
        data.startDate = newValue.startDate;
        data.existingKey = newValue.key!;
        data.meal = newValue.meal || "";
        data.endDate = newValue.endDate;
        return;
      }

      data.startDate = dateFormat(
        newValue.startDate.getFullYear(),
        newValue.startDate.getMonth(),
        newValue.startNum
      );

      autoNextDay();
    });

    function autoNextDay() {
      let nextDay = new Date(data.startDate!);
      nextDay.setDate(nextDay.getDate() + 1);
      data.endDate = dateFormat(
        nextDay.getFullYear(),
        nextDay.getMonth(),
        nextDay.getDate()
      );
    }

    function closeModal() {
      context.emit("close");
    }

    async function addNewMeal() {
      try {
        // insert new data
        if (data.meal && !data.existingKey) {
          const ref = await addDoc(collection(shoppyFirestore, "cooky"), {
            meal: data.meal,
            startDate: data.startDate,
            endDate: data.endDate,
          });
          await setDoc(ref, { key: ref.id }, { merge: true });
        } else if (data.existingKey && typeof data.existingKey === "string") {
          // or do update existing data
          await updateDoc(doc(shoppyFirestore, "cooky", data.existingKey), {
            meal: data.meal,
            startDate: data.startDate,
            endDate: data.endDate,
          });
          context.emit("close");
        }
        data.meal = "";
      } catch (error) {
        store.commit(MutationTypes.SET_ERROR, error.message);
      }
    }

    async function deleteMeal() {
      if (!data.existingKey || typeof data.existingKey !== "string") {
        return;
      }
      try {
        await deleteDoc(doc(shoppyFirestore, "cooky", data.existingKey));
        context.emit("close");
      } catch (error) {
        store.commit(MutationTypes.SET_ERROR, error.message);
      }
    }

    return { ...toRefs(data), closeModal, addNewMeal, deleteMeal };
  },
});
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
