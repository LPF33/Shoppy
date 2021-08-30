import { GetterTree } from "vuex";
import { IStoreState, IDrogerieItem, ISupermarktItem } from "@/Types/Store";

interface IShoppyStateGetter {
  supermarktItems: ISupermarktItem[] | null;
  drogerieItems: IDrogerieItem[] | null;
  shoppyIndex: number | null;
}

export type TGetters = {
  shoppyState(state: IStoreState): IShoppyStateGetter;
};

const getters: GetterTree<IStoreState, IStoreState> & TGetters = {
  shoppyState: (state) => {
    return {
      supermarktItems: state.supermarktItems,
      drogerieItems: state.drogerieItems,
      shoppyIndex: state.shoppyIndex,
    };
  },
};

export default getters;
