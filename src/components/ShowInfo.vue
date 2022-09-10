<template>
  <div v-if="message">
    <span>
      <font-awesome-icon icon="fa-duotone fa-info" class="icon" />
    </span>
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import { IStoreState } from "@/Types/Store";

export default defineComponent({
  name: "ShowInfo",
  setup() {
    const store = useStore<IStoreState>();

    const message = ref(store.state.info);

    watch(
      () => store.state.info,
      (newVal) => (message.value = newVal)
    );

    return { message };
  },
});
</script>

<style scoped>
div {
  width: 90%;
  height: 90%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

span {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: inset 3px 3px 6px #dedede, inset -3px -3px 6px #ffffff;
}

.icon {
  font-size: 1rem;
  --fa-secondary-opacity: 1;
  --fa-primary-color: black;
  --fa-secondary-color: red;
}

p {
  margin-left: 10px;
  word-break: break-all;
  max-width: calc(100% - 50px);
}
</style>
