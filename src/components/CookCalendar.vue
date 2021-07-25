<template>
  <table v-show="!modalVisible">
    <caption>
      {{
        month
      }}
    </caption>
    <thead>
      <tr>
        <th v-for="day in weekday" :key="day">{{ day }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(week, index) in getDaysOfMonth" :key="index">
        <td
          v-for="(day, index2) in week"
          :key="index2"
          @click="setMeal(day)"
          :class="{ active: day === today.getDate() }"
          :style="{ backgroundColor: setCookyCalendar(day, true) }"
        >
          {{ day }}
          <p>{{ setCookyCalendar(day) }}</p>
        </td>
      </tr>
    </tbody>
  </table>
  <CookMeal
    v-show="modalVisible"
    @click.self="modalVisible = false"
    @close="modalVisible = false"
    :date="mealData"
  />
</template>

<script>
import CookMeal from "@/components/CookMeal.vue";
import { shoppyFirestore } from "@/firebase/config";

export default {
  name: "CookCalendar",
  components: {
    CookMeal,
  },
  data() {
    const today = new Date();
    const options = { month: "long" };
    const localDateString = today.toLocaleString("de-DE", options);
    return {
      today,
      weekday: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
      month: localDateString,
      modalVisible: false,
      mealData: null,
      mealList: null,
      unsubscribe: null,
    };
  },
  computed: {
    getDaysOfMonth() {
      const monthArr = [];
      monthArr.push(new Array(7).fill(""));
      const today = new Date();
      let currentDay = new Date(today.getFullYear(), today.getMonth());
      let counterWeekArray = currentDay.getDay() - 1;
      let counterWeeksArray = 0;
      while (currentDay.getMonth() === today.getMonth()) {
        monthArr[counterWeeksArray][counterWeekArray] = currentDay.getDate();
        currentDay.setDate(currentDay.getDate() + 1);
        // if next day is a monday and not next month
        if (
          currentDay.getDay() === 1 &&
          currentDay.getMonth() === today.getMonth()
        ) {
          counterWeekArray = 0;
          counterWeeksArray++;
          monthArr.push(new Array(7).fill(""));
        } else {
          counterWeekArray++;
        }
      }
      return monthArr;
    },
    setCookyCalendar() {
      return (day, color = false) => {
        if (!this.mealList) {
          return "";
        }
        const foundMeal = this.mealList.find(
          (item) =>
            (item.startNum === day && this.checkMonth(item.startDate)) ||
            (item.endNum === day && this.checkMonth(item.endDate))
        );
        return color ? foundMeal?.color : foundMeal?.meal || "";
      };
    },
  },
  methods: {
    setMeal(day) {
      const meal = this.mealList.find(
        (item) => item.startNum === day || item.endNum === day
      );
      this.mealData = meal ?? { startNum: day };
      this.modalVisible = true;
    },
    getMealDay(date) {
      date = new Date(date);
      return date.getDate();
    },
    checkMonth(date) {
      date = new Date(date);
      return date.getMonth() === this.today.getMonth();
    },
  },
  async created() {
    try {
      this.unsubscribe = shoppyFirestore.collection("cooky").onSnapshot(
        (doc) => {
          this.mealList = doc.docs
            .map((item) => item.data())
            .map((item) => {
              const randomNum = Math.floor(Math.random() * (361 - 200) + 200);
              item.color = `hsl(${randomNum}, 80%, 70%)`;
              item.startNum = this.getMealDay(item.startDate);
              item.endNum = this.getMealDay(item.endDate);
              return item;
            });
        },
        (err) => console.log(err)
      );
    } catch (err) {
      console.log(err);
    }
  },
  unmounted() {
    if (typeof this.unsubscribe == "function") {
      this.unsubscribe();
    }
  },
};
</script>

<style scoped>
table {
  background-color: white;
  border-collapse: collapse;
  width: 500px;
  max-width: 100vw;
  margin: 0 auto;
}

caption {
  font-size: 1.5rem;
  margin-top: 10px;
  background-color: rgb(0, 0, 0);
  padding: 10px;
  border-radius: 10px 10px 0 0;
  color: white;
}

th {
  width: calc(100% / 7);
  padding: 10px;
  background-color: rgb(248, 124, 87);
  color: white;
  font-weight: bold;
}

tr {
  display: flex;
}

tbody td {
  width: calc(500px / 7);
  max-width: calc(100vw / 7);
  height: calc(80vh / 7);
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  padding-top: 5px;
}

tbody td.active {
  color: rgb(2, 146, 103);
  font-weight: bold;
}

tbody td p {
  width: 100%;
  word-wrap: break-word;
  overflow: hidden;
}
</style>
