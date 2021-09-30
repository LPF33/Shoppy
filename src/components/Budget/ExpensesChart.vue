<template>
  <Highcharts :options="options" id="highcharts" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from "vue";
import { IMonthlyExpenses, CategoryTuple } from "@/Types/Budget";
import { Chart } from "highcharts-vue";

export default defineComponent({
  name: "ExpensesChart",
  components: {
    Highcharts: Chart,
  },
  props: {
    monthlyExpenses: {
      type: Array as PropType<IMonthlyExpenses[]>,
      required: true,
    },
  },
  setup(props) {
    const { monthlyExpenses } = toRefs(props);

    const sortedExpenses = computed(() =>
      [...monthlyExpenses.value].sort((a, b) => a.year - b.year)
    );

    const categories: CategoryTuple = [
      "Supermarkt",
      "Drogerie",
      "Versicherung",
      "Rundfunk",
      "Bofrost",
      "Urlaub",
      "Amazon",
    ];

    const options = computed(() => ({
      chart: {
        type: "column",
        width: 350,
        height: 300,
      },
      title: { text: "monatliche Ausgaben" },
      xAxis: {
        categories: sortedExpenses.value.map((item) => item.month),
      },
      yAxis: {
        title: { text: "Ausgaben in €" },
      },
      plotOptions: {
        series: {
          stacking: "normal",
        },
      },
      series: categories.map((item) => {
        return {
          name: item,
          data: sortedExpenses.value.map((mExp) => mExp[item] / 100),
        };
      }),
    }));

    return { options };
  },
});
</script>

<style scoped>
#highcharts {
  margin-top: 10px;
  border-radius: 10px;
}
</style>
