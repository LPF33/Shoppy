<template>
  <div
    v-for="month in monthlyExpenses"
    :key="month.month + month.year"
    class="month"
  >
    <h2>{{ month.month }}</h2>
    <template v-for="(value, key) in month" :key="key">
      <template v-if="typeof value === 'number' && key !== 'year' && value > 0">
        <p>{{ key }} {{ value / 100 }}€</p></template
      >
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IMonthlyExpenses } from "@/Types/Budget";

export default defineComponent({
  name: "MonthlyExpenses",
  props: {
    monthlyExpenses: {
      type: Array as PropType<IMonthlyExpenses[]>,
      required: true,
    },
  },
});
</script>

<style>
.month {
  margin-top: 10px;
}
</style>
