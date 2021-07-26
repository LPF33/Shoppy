<template>
  <table>
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
          <p>{{ day }}</p>
          <p>{{ setCookyCalendar(day) }}</p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "CookyCalendar",
  props: {
    meals: [Array, null],
  },
  data() {
    const today = new Date();
    const options = { month: "long" };
    const localDateString = today.toLocaleString("de-DE", options);
    return {
      today,
      weekday: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
      month: localDateString,
      mealList: this.meals,
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
  watch: {
    meals: {
      deep: true,
      handler(newMeals) {
        this.mealList = newMeals;
      },
    },
  },
  methods: {
    setMeal(day) {
      const meal = this.mealList.find(
        (item) => item.startNum === day || item.endNum === day
      );
      this.$emit("open-modal", meal ?? { startNum: day });
    },
    checkMonth(date) {
      date = new Date(date);
      return date.getMonth() === this.today.getMonth();
    },
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

tbody td.active > p:first-child {
  color: #ffeda3;
  text-decoration: #ffeda3 overline;
  text-decoration-thickness: 5px;
}

tbody td > p:nth-child(2) {
  width: 100%;
  word-wrap: break-word;
  overflow: hidden;
}
</style>
