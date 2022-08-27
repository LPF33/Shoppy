<template>
  <table ref="tableDom">
    <caption>
      <button @click="switchMonth(DIRECTION.LEFT)">&lt;</button>
      {{
        month
      }}<button @click="switchMonth(DIRECTION.RIGHT)">&gt;</button>
    </caption>
    <thead>
      <tr>
        <th v-for="day in weekday" :key="day">{{ day }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(week, index) in daysOfMonth" :key="index">
        <td
          v-for="(day, index2) in week"
          :key="index2"
          @click="setMeal(day)"
          :class="{ active: checkDay(day, today) }"
          :style="{ backgroundColor: setCookyCalendar(day, true) }"
        >
          <p>{{ day }}</p>
          <p>{{ setCookyCalendar(day) }}</p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import {
  ref,
  watch,
  defineComponent,
  PropType,
  reactive,
  computed,
  toRefs,
} from "vue";
import useDetectSwipe, { DIRECTION } from "@/composables/useDetectSwipe";
import getDaysOfMonth from "@/utilities/getDaysOfMonth";
import { checkMonth, checkDay } from "@/utilities/calendarFunctions";
import { IComputedMealList, INewMeal } from "@/Types/Cooky";

export default defineComponent({
  name: "CookyCalendar",
  props: {
    meals: {
      type: Object as PropType<null | Required<IComputedMealList[]>>,
    },
  },
  setup(props, context) {
    const data = reactive({
      weekday: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
      today: new Date(),
    });

    const month = computed(() =>
      data.today.toLocaleString("de-DE", { month: "long", year: "numeric" })
    );

    const daysOfMonth = computed(() => getDaysOfMonth(data.today as Date));

    const tableDom = ref<HTMLTableElement | null>(null);
    const { swipeDirection } = useDetectSwipe(tableDom);

    watch(swipeDirection, function (newVal) {
      switchMonth(newVal);
    });

    function switchMonth(para: DIRECTION) {
      let now;
      switch (para) {
        case DIRECTION.RIGHT:
          if (data.today.getMonth() === 11) {
            now = new Date(data.today.getFullYear() + 1, 0);
            break;
          }
          now = new Date(data.today.getFullYear(), data.today.getMonth() + 1);
          break;
        case DIRECTION.LEFT:
          if (data.today.getMonth() === 0) {
            now = new Date(data.today.getFullYear() - 1, 11);
            break;
          }
          now = new Date(data.today.getFullYear(), data.today.getMonth() - 1);
          break;
        default:
          return;
      }
      data.today = now;
    }

    const setCookyCalendar = computed(
      () =>
        (day: number, color: boolean = false) => {
          if (!props.meals) {
            return "";
          }
          const foundMeal = props.meals.find(
            (item) =>
              (item.startNum === day &&
                checkMonth(item.startDate, data.today as Date)) ||
              (item.endNum === day &&
                checkMonth(item.endDate, data.today as Date))
          );
          return color ? foundMeal?.color : foundMeal?.meal || "";
        }
    );

    function setMeal(day: number | "") {
      if (day === "") {
        return;
      }
      const meal = props.meals?.find(
        (item) =>
          (item.startNum === day &&
            checkMonth(item.startDate, data.today as Date)) ||
          (item.endNum === day && checkMonth(item.endDate, data.today as Date))
      );
      context.emit(
        "open-modal",
        meal ??
          ({
            startNum: day,
            startDate: new Date(
              data.today.getFullYear(),
              data.today.getMonth(),
              day
            ),
          } as INewMeal)
      );
    }

    return {
      ...toRefs(data),
      tableDom,
      DIRECTION,
      daysOfMonth,
      switchMonth,
      month,
      swipeDirection,
      setCookyCalendar,
      setMeal,
      checkDay,
    };
  },
});
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
