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
        >
          {{ day }}
          <p :ref="`day` + day"></p>
        </td>
      </tr>
    </tbody>
  </table>
  <CookMeal
    v-show="modalVisible"
    @click.self="modalVisible = false"
    @close="modalVisible = false"
    :date="mealDate"
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
      mealDate: null,
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
  },
  methods: {
    setMeal(day) {
      this.mealDate = day;
      this.modalVisible = true;
    },
    fillTableData(item, date, color) {
      date = new Date(date);
      if (date.getMonth() !== this.today.getMonth()) {
        return;
      }
      const refName = "day" + date.getDate();
      this.$refs[refName].textContent = item.meal;
      this.$refs[refName].parentNode.style.backgroundColor = color;
    },
  },
  async created() {
    try {
      this.unsubscribe = shoppyFirestore.collection("cooky").onSnapshot(
        (doc) => {
          this.mealList = doc.docs.map((item) => item.data());
          this.mealList.forEach((item) => {
            const randomNum = Math.floor(Math.random() * (361 - 200) + 200);
            const color = `hsl(${randomNum}, 80%, 70%)`;
            this.fillTableData(item, item.startDate, color);
            this.fillTableData(item, item.endDate, color);
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
  background-color: rgb(2, 146, 103);
}

tbody td p {
  width: 100%;
  word-wrap: break-word;
  overflow-x: hidden;
}
</style>
