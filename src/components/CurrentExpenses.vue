<template>
  <table id="current-expenses">
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
        <td>{{ amountCaroline }}€</td>
        <td>{{ amountLars }}€</td>
      </tr>
      <tr class="difference">
        <td>{{ difference.caroline }}</td>
        <td>{{ difference.lars }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="2">
          <button>{{ month }} abschließen ?</button>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script lang="ts">
import { computed, reactive, defineComponent, PropType, watch, ref } from "vue";
import { IExpenses } from "@/Types/Budget";

export default defineComponent({
  name: "CurrentExpenses",
  props: {
    currentExpenses: { type: Array as PropType<IExpenses[]>, required: true },
  },
  setup(props) {
    const total = computed((): string =>
      (
        props.currentExpenses.reduce((acc, cur) => acc + cur.amount, 0) / 100
      ).toFixed(2)
    );
    const amountCaroline = computed((): string => personAmount("Caroline"));
    const amountLars = computed((): string => personAmount("Lars"));
    const difference = reactive({ caroline: "", lars: "" });
    const date = new Date();
    const month = ref(date.toLocaleString("de-DE", { month: "long" }));

    watch(
      () => props.currentExpenses,
      (newValue) => {
        const half = newValue.reduce((acc, cur) => acc + cur.amount, 0) / 200;
        difference.caroline =
          +amountCaroline.value > +amountLars.value
            ? ""
            : (half - +amountCaroline.value).toFixed(2) + "€";
        difference.lars =
          +amountCaroline.value > +amountLars.value
            ? (half - +amountLars.value).toFixed(2) + "€"
            : "";
      },
      { immediate: true }
    );

    function personAmount(name: "Lars" | "Caroline"): string {
      return (
        props.currentExpenses.reduce((acc, cur) => {
          if (cur.name === name) {
            return acc + cur.amount;
          }
          return acc;
        }, 0) / 100
      ).toFixed(2);
    }

    return { total, amountCaroline, amountLars, difference, month };
  },
});
</script>

<style>
#current-expenses {
  border-collapse: collapse;
  width: 300px;
  max-width: 100vw;
  border-radius: 10px;
  overflow: hidden;
}

#current-expenses caption {
  font-size: 1.5rem;
  margin-top: 10px;
  background-color: rgb(255, 255, 255);
  padding: 10px;
  border-radius: 10px 10px 0 0;
  color: rgb(0, 0, 0);
}

#current-expenses th {
  width: calc(100% / 2);
  padding: 10px;
  background-color: rgb(248, 124, 87);
  color: rgb(153, 55, 55);
  font-weight: bold;
}

#current-expenses td {
  width: calc(100% / 2);
  padding: 10px;
  background-color: white;
  color: black;
}

#current-expenses tr.difference > td {
  color: rgb(248, 124, 87);
  font-weight: bold;
}

#current-expenses tfoot button {
  font-weight: 1rem;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
}
</style>
