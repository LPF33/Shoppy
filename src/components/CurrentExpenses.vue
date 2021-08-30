<template>
  <table>
    <caption>
      Insgesamt:
      {{
        this.total + "€"
      }}
    </caption>
    <thead>
      <tr>
        <th>Caroline</th>
        <th>Lars</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>{{ amountCaroline }}€</th>
        <th>{{ amountLars }}€</th>
      </tr>
      <tr>
        <th>{{ difference.caroline }}</th>
        <th>{{ difference.lars }}</th>
      </tr>
    </tbody>
    <tfoot>
      <button>Abschließen ?</button>
    </tfoot>
  </table>
</template>

<script lang="ts">
import {
  computed,
  reactive,
  toRefs,
  watch,
  defineComponent,
  PropType,
} from "vue";
import { IExpenses } from "@/Types/Budget";

export default defineComponent({
  name: "CurrentExpenses",
  props: {
    currentExpenses: { type: Array as PropType<IExpenses[]>, required: true },
  },
  setup(props) {
    console.log(props);
    const expensesObj = reactive({
      total: computed(() =>
        props.currentExpenses.reduce((acc, cur) => acc + cur.amount, 0)
      ),
      amountCaroline: computed(() => personAmount("Caroline")),
      amountLars: computed(() => personAmount("Lars")),
    });

    const expensesFixedObj = reactive({
      total: computed(() => (expensesObj.total / 100).toFixed(2)),
      amountCaroline: computed(() =>
        (expensesObj.amountCaroline / 100).toFixed(2)
      ),
      amountLars: computed(() => (expensesObj.amountLars / 100).toFixed(2)),
    });

    const difference = reactive({ caroline: "", lars: "" });

    function personAmount(name: "Lars" | "Caroline") {
      return props.currentExpenses.reduce((acc, cur) => {
        if (cur.name === name) {
          return acc + cur.amount;
        }
        return acc;
      }, 0);
    }

    watch(
      expensesObj,
      () => {
        const half = expensesObj.total / 2;
        const carolineHigherExpenses =
          expensesObj.amountCaroline > expensesObj.amountLars;
        difference.caroline = carolineHigherExpenses
          ? ""
          : ((half - expensesObj.amountCaroline) / 100).toFixed(2) + "€";
        difference.lars = carolineHigherExpenses
          ? ((half - expensesObj.amountLars) / 100).toFixed(2) + "€"
          : "";
      },
      { immediate: true }
    );

    return { ...toRefs(expensesFixedObj), difference };
  },
});
</script>

<style scoped></style>
