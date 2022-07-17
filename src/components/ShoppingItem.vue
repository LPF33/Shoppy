<template>
  <div class="shopping-item">
    <input type="checkbox" v-model="checked" />
    <input
      type="text"
      v-model="value"
      :class="{ done: item.done }"
      ref="inputRef"
    />
    <button @click="deleteItem">❌</button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  reactive,
  toRefs,
  watch,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import {
  MutationTypes,
  ISupermarktItem,
  IDrogerieItem,
  IStoreState,
} from "@/Types/Store";
import { shoppyFirestore } from "@/firebase/config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

export default defineComponent({
  name: "ShoppingItem",
  props: {
    item: {
      type: Object as PropType<ISupermarktItem | IDrogerieItem>,
      required: true,
    },
  },
  setup(props) {
    const timeoutId = ref<number>(0);
    const inputRef = ref<null | HTMLInputElement>(null);

    const data = reactive({
      checked: props.item.done,
      value: props.item.name,
    });

    const store = useStore<IStoreState>();

    onMounted(() => inputRef.value?.focus());

    watch(
      () => data.checked,
      (newValue) => {
        selectedItem(newValue);
      }
    );

    watch(
      () => data.value,
      (newValue) => {
        clearTimeout(timeoutId.value);
        updateItem(newValue);
      }
    );

    function updateItem(value: string) {
      timeoutId.value = setTimeout(async () => {
        try {
          await updateDoc(doc(shoppyFirestore, "shoppy", props.item.key), {
            name: value,
            last: false,
          });
        } catch (error) {
          store.commit(MutationTypes.SET_ERROR, error);
        }
      }, 500);
    }

    async function deleteItem() {
      try {
        await deleteDoc(doc(shoppyFirestore, "shoppy", props.item.key));
      } catch (error) {
        store.commit(MutationTypes.SET_ERROR, error);
      }
    }

    async function selectedItem(value: boolean) {
      try {
        await updateDoc(doc(shoppyFirestore, "shoppy", props.item.key), {
          done: value,
        });
      } catch (error) {
        store.commit(MutationTypes.SET_ERROR, error);
      }
    }

    return { ...toRefs(data), updateItem, deleteItem, selectedItem, inputRef };
  },
});
</script>

<style scoped>
.shopping-item {
  display: flex;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid grey;
  user-select: none;
  overflow: hidden;
}

.shopping-item > input[type="checkbox"] {
  width: 40px;
}

.shopping-item > input[type="text"] {
  display: flex;
  flex-grow: 1;
  cursor: pointer;
  white-space: nowrap;
  overflow-x: auto;
  font-size: 1.2rem;
  padding-left: 10px;
  background-color: inherit;
  color: inherit;
}

.shopping-item > input.done {
  text-decoration: line-through;
  color: grey;
}

button {
  font-size: 2rem;
  cursor: pointer;
  background: none;
}
</style>
