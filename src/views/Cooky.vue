<template>
  <section>
    <h1>👩‍🍳 👨‍🍳</h1>
    <h1>Wann kochen wir was?</h1>
    <CookyCalendar
      v-show="!modalVisible"
      :meals="mealList"
      @open-modal="openCookyAddMeal"
    />
    <CookyAddMeal
      v-if="modalVisible"
      @click.self="modalVisible = false"
      @close="modalVisible = false"
      :data-object="mealData"
    />
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { getDateOfMonth } from "@/utilities/calendarFunctions";
import { IMeal, IComputedMealList, INewMeal } from "@/Types/Cooky";
import { IStoreState } from "@/Types/Store";
import CookyCalendar from "@/components/CookyCalendar.vue";
import CookyAddMeal from "@/components/CookyAddMeal.vue";

export default defineComponent({
  name: "Cooky",
  components: {
    CookyCalendar,
    CookyAddMeal,
  },
  setup() {
    const data = reactive({
      modalVisible: false,
      mealData: null as null | IMeal | INewMeal,
    });

    const store = useStore<IStoreState>();

    const mealList = computed((): Required<IComputedMealList[]> | null => {
      return store.state.mealList?.length && store.state.mealList.length > 0
        ? store.state.mealList.map((item) => {
            const copy: IComputedMealList = { ...item };
            const randomNum = Math.floor(Math.random() * (361 - 200) + 200);
            copy.color = `hsl(${randomNum}, 80%, 70%)`;
            copy.startNum = getDateOfMonth(copy.startDate as string);
            copy.endNum = getDateOfMonth(copy.endDate as string);
            return copy;
          })
        : null;
    });

    function openCookyAddMeal(meal: IMeal | INewMeal) {
      data.mealData = meal;
      data.modalVisible = true;
    }

    return { ...toRefs(data), openCookyAddMeal, mealList };
  },
});
</script>

<style scoped>
section {
  position: relative;
  background-color: #39a9cb;
  width: 100%;
  height: 100%;
  color: #232323;
  text-align: center;
}

h1 {
  margin-bottom: 10px;
}
</style>
