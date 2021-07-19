<template>
  <div class="shoppy-section" @click.self="setVisible">
    <h1>Shoppy</h1>
    <main class="section-draggable">
      <VueDraggableNext v-model="items" @change="onDrop" class="draggable-next">
        <span v-for="it in items" :key="it.key">🖐</span>
      </VueDraggableNext>
      <div>
        <ShoppingItem v-for="it in items" :key="it.key" :item="it" />
      </div>
    </main>
    <AddItem v-if="visible" @close="setVisible" :index="index" />
    <button v-else @click="setVisible">➕</button>
  </div>
</template>

<script>
import AddItem from "@/components/AddItem";
import ShoppingItem from "@/components/ShoppingItem";
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
      items: null,
      visible: false,
      unsubscribe: null,
      index: 0,
    };
  },
  methods: {
    setVisible() {
      this.visible = !this.visible;
    },
    onDrop(e) {
      const { oldIndex, newIndex, element: draggedItem } = e.moved;
      const itemsList = [...this.items];
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
  async created() {
    try {
      this.unsubscribe = shoppyFirestore.collection("shoppy").onSnapshot(
        (doc) => {
          let newDoc = doc.docs
            .map((item) => item.data())
            .sort((a, b) => a.list_id - b.list_id);
          this.items = newDoc;
          this.index = newDoc[newDoc.length - 1].list_id + 1;
        },
        (err) => console.log(err)
      );
    } catch (err) {
      console.log(err);
    }
  },
  unmounted() {
    if (typeof this.unsubscribe == "function") {
      this.unsubscribe();
    }
  },
};
</script>

<style scoped>
.shoppy-section {
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

.section-draggable {
  position: absolute;
  top: calc(2rem + 20px);
  bottom: 8rem;
  max-width: 500px;
  width: 90vw;
  overflow-y: auto;
  display: flex;
}

.section-draggable > div:nth-child(2) {
  flex-grow: 1;
}

.draggable-next {
  display: flex;
  flex-direction: column;
  margin-right: 5px;
}

.draggable-next span {
  font-size: 2rem;
  border-bottom: 1px solid transparent;
  line-height: 1.5em;
  cursor: move;
}

button {
  position: absolute;
  bottom: 10px;
  font-size: 3rem;
  height: 6rem;
  width: 6rem;
  border: 1px solid grey;
  border-radius: 50%;
  line-height: 1.5;
  padding: 10px;
  cursor: pointer;
  margin-top: 2rem;
  user-select: none;
}
</style>
