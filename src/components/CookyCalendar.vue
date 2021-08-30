<template>
  <table ref="tableDom">
    <caption>
      <button @click="switchMonth('LEFT')">&lt;</button>
      {{
        month
      }}<button @click="switchMonth('RIGHT')">&gt;</button>
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
          :class="{ active: checkDay(day) }"
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
import { ref, watch } from "vue";
import useDetectSwipe from "@/composables/useDetectSwipe";

export default {
  name: "CookyCalendar",
  props: {
    meals: [Array, null],
  },
  data() {
    return {
      weekday: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
      mealList: this.meals,
    };
  },
  setup() {
    const tableDom = ref(null);
    const { swipeDirection } = useDetectSwipe(tableDom.value);
    const today = ref(new Date());
    const options = { month: "long", year: "numeric" };
    const month = ref(today.value.toLocaleString("de-DE", options));

    watch(swipeDirection, function (newVal) {
      switchMonth(newVal);
    });

    function switchMonth(para) {
      let now;
      switch (para) {
        case "RIGHT":
          if (today.value.getMonth() === 11) {
            now = new Date(today.value.getFullYear() + 1, 0);
            break;
          }
          now = new Date(today.value.getFullYear(), today.value.getMonth() + 1);
          break;
        case "LEFT":
          if (today.value.getMonth() === 0) {
            now = new Date(today.value.getFullYear() - 1, 11);
            break;
          }
          now = new Date(today.value.getFullYear(), today.value.getMonth() - 1);
          break;
        default:
          return;
      }
      today.value = now;
      month.value = now.toLocaleString("de-DE", {
        month: "long",
        year: "numeric",
      });
    }

    return { tableDom, switchMonth, month, today, swipeDirection };
  },
  computed: {
    getDaysOfMonth() {
      const monthArr = [];
      monthArr.push(new Array(7).fill(""));
      let currentDay = new Date(
        this.today.getFullYear(),
        this.today.getMonth()
      );
      let counterWeekArray =
        currentDay.getDay() === 0 ? 6 : currentDay.getDay() - 1;
      let counterWeeksArray = 0;
      while (currentDay.getMonth() === this.today.getMonth()) {
        monthArr[counterWeeksArray][counterWeekArray] = currentDay.getDate();
        currentDay.setDate(currentDay.getDate() + 1);
        // if next day is a monday and not next month
        if (
          currentDay.getDay() === 1 &&
          currentDay.getMonth() === this.today.getMonth()
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
        (item) =>
          (item.startNum === day && this.checkMonth(item.startDate)) ||
          (item.endNum === day && this.checkMonth(item.endDate))
      );
      this.$emit(
        "open-modal",
        meal ?? {
          startNum: day,
          startDate: new Date(
            this.today.getFullYear(),
            this.today.getMonth(),
            day
          ),
        }
      );
    },
    checkMonth(date) {
      date = new Date(date);
      return date.getMonth() === this.today.getMonth();
    },
    checkDay(day) {
      const currentDate = new Date();
      if (
        currentDate.getFullYear() === this.today.getFullYear() &&
        currentDate.getMonth() === this.today.getMonth() &&
        currentDate.getDate() === day
      ) {
        return true;
      }
      return false;
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

caption button {
  line-height: 1.5rem;
  font-size: 1.5rem;
  background-color: transparent;
  color: white;
  margin: 0 5px 0 10px;
}

caption button:hover {
  color: #2940d3;
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
  height: calc(70vh / 7);
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  padding-top: 5px;
  overflow: auto;
}

tbody td::-webkit-scrollbar {
  width: 5px;
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
