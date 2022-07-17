<template>
  <section @click.self="setVisible">
    <h1>Shoppy</h1>
    <div>
      <div class="section-draggable" v-if="category === 'Supermarkt'">
        <VueDraggableNext
          v-model="supermarktItems"
          @change="onDrop"
          class="draggable-next"
        >
          <span v-for="it in supermarktItems" :key="it.key">🖐</span>
        </VueDraggableNext>
        <div>
          <ShoppingItem
            v-for="it in supermarktItems"
            :key="it.key"
            :item="it"
          />
        </div>
      </div>
      <div class="section-draggable" v-if="category === 'Drogerie'">
        <VueDraggableNext
          v-model="drogerieItems"
          @change="onDrop"
          class="draggable-next"
        >
          <span v-for="it in drogerieItems" :key="it.key">🖐</span>
        </VueDraggableNext>
        <div>
          <ShoppingItem v-for="it in drogerieItems" :key="it.key" :item="it" />
        </div>
      </div>
      <AddItem :index="index" :selected="category" />
    </div>
    <footer>
      <button
        @click="switchCategory('Supermarkt')"
        :class="{ active: category === 'Supermarkt' }"
      >
        🧀
      </button>
      <button>🎨</button>
      <button
        @click="switchCategory('Drogerie')"
        :class="{ active: category === 'Drogerie' }"
      >
        🧴
      </button>
    </footer>
  </section>
</template>

<script>
import AddItem from "@/components/AddItem.vue";
import ShoppingItem from "@/components/ShoppingItem.vue";
import { shoppyFirestore } from "@/firebase/config";
import { VueDraggableNext } from "vue-draggable-next";

export default {
  name: "Shoppy",
  components: {
    AddItem,
    ShoppingItem,
    VueDraggableNext,
  },
  data() {
    return {
      supermarktItems: this.$store.state.supermarktItems,
      drogerieItems: this.$store.state.drogerieItems,
      category: "Supermarkt",
      visible: false,
      index: this.$store.state.shoppyIndex ?? 0,
      unwatch: null,
    };
  },
  methods: {
    setVisible() {
      this.visible = !this.visible;
    },
    switchCategory(category) {
      this.category = category;
    },
    onDrop(e) {
      const { oldIndex, newIndex, element: draggedItem } = e.moved;
      const itemsList =
        draggedItem.category === "Supermarkt"
          ? [...this.supermarktItems]
          : [...this.drogerieItems];
      let newDraggedIndex;
      if (newIndex === oldIndex) {
        return;
      }
      if (newIndex < oldIndex) {
        newDraggedIndex = itemsList[newIndex + 1].list_id;
        itemsList.forEach((item) => {
          if (
            item.list_id >= newDraggedIndex &&
            item.list_id !== draggedItem.list_id
          ) {
            item.list_id++;
            this.updateFirebase(item);
          }
        });
      } else {
        newDraggedIndex = itemsList[newIndex - 1].list_id;
        itemsList.forEach((item) => {
          if (
            item.list_id <= newDraggedIndex &&
            item.list_id !== draggedItem.list_id
          ) {
            item.list_id--;
            this.updateFirebase(item);
          }
        });
      }
      draggedItem.list_id = newDraggedIndex;
      this.updateFirebase(draggedItem);
    },
    async updateFirebase(item) {
      await shoppyFirestore
        .collection("shoppy")
        .doc(item.key)
        .update({ list_id: item.list_id });
    },
  },
  created() {
    this.unwatch = this.$store.watch(
      (state, getters) => getters.shoppyState,
      (newValue) => {
        this.supermarktItems = newValue.supermarktItems;
        this.drogerieItems = newValue.drogerieItems;
        this.index = newValue.shoppyIndex;
      }
    );
  },
  beforeUnmount() {
    if (typeof this.unwatch === "function") {
      this.unwatch();
    }
  },
};
</script>

<style scoped>
section {
  position: relative;
  background-color: #232323;
  width: 100%;
  height: 100%;
  color: #ffeda3;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  user-select: none;
}

h1 {
  margin: 10px 0;
  height: 1.5em;
}

section > div {
  position: absolute;
  top: calc(2rem + 20px);
  bottom: 8rem;
  max-width: 500px;
  width: 90vw;
  overflow-y: auto;
}

.section-draggable {
  display: flex;
  overflow: hidden;
}

.section-draggable > div:nth-child(2) {
  flex-grow: 1;
  overflow-x: auto;
}

.draggable-next {
  display: flex;
  flex-direction: column;
  margin-right: 5px;
}

.draggable-next span {
  height: 40px;
  font-size: 2rem;
  border-bottom: 1px solid transparent;
  cursor: move;
}

footer {
  position: absolute;
  bottom: 10px;
  margin-top: 2rem;
  display: flex;
  justify-content: space-evenly;
  max-width: 500px;
  width: 100vw;
}

footer > button {
  height: 6rem;
  width: 6rem;
  font-size: 3rem;
  border: 1px solid grey;
  border-radius: 50%;
  line-height: 1.5;
  padding: 10px;
  cursor: pointer;
  user-select: none;
}

button.active {
  background-color: #ffeda3;
}
</style>
