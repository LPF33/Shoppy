<template>
  <section>
    <header>
      <button
        @click="switchCategory('Supermarkt')"
        :class="{ active: category === 'Supermarkt' }"
      >
        <font-awesome-icon icon="fa-duotone fa-carrot" />
      </button>
      <h1>Shoppy</h1>
      <button
        @click="switchCategory('Drogerie')"
        :class="{ active: category === 'Drogerie' }"
      >
        <font-awesome-icon icon="fa-duotone fa-toothbrush" />
      </button>
    </header>
    <div ref="list">
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
      <AddItem
        :index="index"
        :selected="category"
        @new-item-added="focus = true"
      />
    </div>
  </section>
</template>

<script>
import AddItem from "@/components/AddItem.vue";
import ShoppingItem from "@/components/ShoppingItem.vue";
import { shoppyFirestore } from "@/firebase/config";
import { VueDraggableNext } from "vue-draggable-next";
import { doc, updateDoc } from "firebase/firestore";

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
      index: this.$store.state.shoppyIndex ?? 0,
      unwatch: null,
    };
  },
  methods: {
    switchCategory(category) {
      this.category = category;
    },
    scrollToTop() {
      this.$refs.list.scrollTop = this.$refs.list.scrollHeight;
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
      await updateDoc(doc(shoppyFirestore, "shoppy", item.key), {
        list_id: item.list_id,
      });
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
  mounted() {
    this.scrollToTop();
    window.addEventListener("resize", this.scrollToTop.bind(this));
  },
  updated() {
    this.$refs.list.scrollTop = this.$refs.list.scrollHeight;
  },
  beforeUnmount() {
    if (typeof this.unwatch === "function") {
      this.unwatch();
    }
    window.removeEventListener("resize", this.scrollToTop.bind(this));
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

header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 0;
}

header h1 {
  margin: 0 30px;
  height: 1.5em;
}

header > button {
  height: 3rem;
  width: 3rem;
  font-size: 1.5rem;
  border: 1px solid grey;
  border-radius: 50%;
  line-height: 1.2;
  padding: 10px;
  cursor: pointer;
  user-select: none;
}

header button.active {
  background-color: #ffeda3;
}

section > div {
  position: absolute;
  top: calc(3rem + 20px);
  bottom: 1rem;
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
</style>
