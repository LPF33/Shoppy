<template>
  <div id="check-sport">
    <span
      ><font-awesome-icon
        icon="fa-duotone fa-person-swimming"
        class="main-icon"
        :class="[status]"
    /></span>
    <div>
      <label for="first" v-if="firstDone"
        ><font-awesome-icon
          icon="fa-duotone fa-person-swimming"
          class="swimmer"
      /></label>
      <label for="first" v-else
        ><font-awesome-icon icon="fa-duotone fa-water-ladder" class="ladder"
      /></label>
      <input type="checkbox" id="first" v-model="firstDone" />
      <label for="second" v-if="secondDone"
        ><font-awesome-icon
          icon="fa-duotone fa-person-swimming"
          class="swimmer"
      /></label>
      <label for="second" v-else
        ><font-awesome-icon icon="fa-duotone fa-water-ladder" class="ladder"
      /></label>
      <input type="checkbox" id="second" v-model="secondDone" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import { IStoreState, MutationTypes } from "@/Types/Store";
import { shoppyFirestore } from "@/firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { checkDateIfSameWeek, dateFormat } from "@/utilities/calendarFunctions";

export default defineComponent({
  name: "CheckSport",
  setup() {
    const store = useStore<IStoreState>();

    const firstDone = ref(store.state.sport?.first ?? false);
    const secondDone = ref(store.state.sport?.second ?? false);

    const status = computed<"done" | "info" | "warning">(() => {
      if (store.state.sport === null) {
        return "warning";
      }
      if (firstDone.value && secondDone.value) {
        return "done";
      }
      if (
        ((firstDone.value || secondDone.value) && new Date().getDay() === 0) ||
        (!firstDone.value &&
          !secondDone.value &&
          [5, 6, 7].includes(new Date().getDay()))
      ) {
        return "warning";
      }
      return "info";
    });

    async function updateFirebase(
      first: boolean,
      second: boolean,
      date: string
    ): Promise<void> {
      try {
        await updateDoc(doc(shoppyFirestore, "general", "sport"), {
          first,
          second,
          date,
        });
      } catch (err) {
        store.commit(MutationTypes.SET_ERROR, "Firebase update sport");
      }
    }

    watch([firstDone, secondDone], ([first, second]) =>
      updateFirebase(
        first,
        second,
        dateFormat(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        )
      )
    );

    watch(
      () => store.state.sport,
      (newVal) => {
        if (newVal === null) {
          return;
        }
        if (!checkDateIfSameWeek(new Date(newVal.date))) {
          updateFirebase(
            false,
            false,
            dateFormat(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate()
            )
          );
        }
        firstDone.value = newVal.first;
        secondDone.value = newVal.second;
      },
      { immediate: true }
    );

    return { firstDone, secondDone, status };
  },
});
</script>

<style scoped>
#check-sport {
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

#check-sport > span {
  display: inline-block;
  margin-bottom: 10px;
}
.main-icon {
  font-size: 4rem;
  --fa-secondary-opacity: 1;
  --fa-secondary-color: rgb(110, 110, 248);
}

.main-icon.info {
  --fa-primary-color: rgb(208, 208, 208);
}

.main-icon.warning {
  --fa-primary-color: red;
}

.main-icon.done {
  --fa-primary-color: green;
}

input {
  display: none;
}

label {
  display: inline-block;
  width: 50px;
  height: 50px;
}

label + input + label {
  margin-left: 20px;
}

label .swimmer {
  font-size: 2rem;
  --fa-secondary-opacity: 1;
  --fa-primary-color: black;
  --fa-secondary-color: rgb(110, 110, 248);
}

label .ladder {
  font-size: 2rem;
  --fa-secondary-opacity: 1;
  --fa-primary-color: rgb(78, 78, 78);
  --fa-secondary-color: rgb(110, 110, 248);
}
</style>
