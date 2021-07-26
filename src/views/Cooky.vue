<template>
  <main>
    <h1>👩‍🍳 👨‍🍳</h1>
    <h1>Wann kochen wir was?</h1>
    <CookyCalendar
      v-show="!modalVisible"
      :meals="mealList"
      @open-modal="openCookyAddMeal"
    />
    <CookyAddMeal
      v-show="modalVisible"
      @click.self="modalVisible = false"
      @close="modalVisible = false"
      :data-object="mealData"
    />
  </main>
</template>

<script>
import CookyCalendar from "@/components/CookyCalendar.vue";
import CookyAddMeal from "@/components/CookyAddMeal.vue";

export default {
  name: "Cooky",
  components: {
    CookyCalendar,
    CookyAddMeal,
  },
  data() {
    return {
      modalVisible: false,
      mealData: null,
    };
  },
  methods: {
    getMealDay(date) {
      date = new Date(date);
      return date.getDate();
    },
    openCookyAddMeal(meal) {
      this.mealData = meal;
      this.modalVisible = true;
    },
  },
  computed: {
    mealList() {
      return this.$store.state.mealList.map((item) => {
        const randomNum = Math.floor(Math.random() * (361 - 200) + 200);
        item.color = `hsl(${randomNum}, 80%, 70%)`;
        item.startNum = this.getMealDay(item.startDate);
        item.endNum = this.getMealDay(item.endDate);
        return item;
      });
    },
  },
};
</script>

<style scoped>
main {
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
