<template>
  <div id="cooky-preview">
    <span>
      <font-awesome-icon icon="fa-duotone fa-user-chef" class="main-icon" />
    </span>
    <p>{{ eatMessage }}</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { IStoreState, IMealList } from "@/Types/Store";
import { checkDateIfToday } from "@/utilities/calendarFunctions";

export default defineComponent({
  name: "CookyPreview",
  setup() {
    const store = useStore<IStoreState>();

    const eatMessage = computed<string>(() => {
      const meals = store.state.mealList;
      if (!meals) {
        return "Kochen planen!";
      }
      let today = new Date();
      if (today.getHours() >= 17) {
        today.setDate(today.getDate() + 1);
      }
      let mealOfToday: null | IMealList = null;
      let item: IMealList;
      for (item of meals) {
        if (
          checkDateIfToday(new Date(item.startDate), today) ||
          checkDateIfToday(new Date(item.endDate), today)
        ) {
          mealOfToday = item;
          break;
        }
      }
      return !mealOfToday
        ? "Was kochen wir?"
        : `${today.getHours() >= 17 ? "Morgen:" : "Heute:"} ${
            mealOfToday.meal
          }`;
    });

    return { eatMessage };
  },
});
</script>

<style scoped>
#cooky-preview {
  width: 90%;
  height: 90%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: inset 9px 9px 16px #dedede, inset -9px -9px 16px #ffffff;
}

#cooky-preview > span {
  display: inline-block;
  margin-bottom: 20px;
}

.main-icon {
  font-size: 4rem;
}

p {
  white-space: nowrap;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
