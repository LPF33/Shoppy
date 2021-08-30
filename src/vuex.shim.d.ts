import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";
import { IStoreState } from "@/Types/Store";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<IStoreState>;
  }
}
