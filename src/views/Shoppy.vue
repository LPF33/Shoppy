<template>
  <div class="shoppy-section" @click.self="setVisible">
    <h1>Shoppy</h1>
    <section v-if="sortedList">
      <ShoppingItem
        v-for="it in sortedList"
        :key="it.key"
        :item="it"
        draggable="true"
        @dragstart="startDrag($event, it)"
        @drop="onDrop($event, it)"
        @dragover.prevent
        @dragenter.prevent
      />
    </section>
    <AddItem v-if="visible" @close="setVisible" />
    <button v-else @click="setVisible">➕</button>
  </div>
</template>

<script>
import AddItem from "@/components/AddItem";
import ShoppingItem from "@/components/ShoppingItem";
import { shoppyFirestore } from "@/firebase/config";

export default {
  name: "Shoppy",
  components: {
    AddItem,
    ShoppingItem,
  },
  data() {
    return {
      items: null,
      visible: false,
      unsubscribe: null,
    };
  },
  methods: {
    setVisible() {
      this.visible = !this.visible;
    },
    startDrag(e, item) {
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("itemId", item.list_id);
    },
    onDrop(e, item) {
      const newId = item.list_id;
      const oldId = parseInt(e.dataTransfer.getData("itemId"));
      if (newId === oldId) {
        return;
      }
      const itemsList = [...this.items];
      const draggedItem = itemsList.find((item) => item.list_id === oldId);
      if (newId < oldId) {
        itemsList.forEach((item) => {
          if (item.list_id >= newId && item.list_id < oldId) {
            item.list_id++;
            this.updateFirebase(item);
          }
        });
      } else {
        itemsList.forEach((item) => {
          if (item.list_id > oldId && item.list_id <= newId) {
            item.list_id--;
          }
        });
      }
      draggedItem.list_id = newId;
      this.updateFirebase(draggedItem);
    },
    async updateFirebase(item) {
      await shoppyFirestore
        .collection("shoppy")
        .doc(item.key)
        .update({ list_id: item.list_id });
    },
  },
  computed: {
    sortedList() {
      if (!this.items || !this.items.length) {
        return null;
      }
      return [...this.items].sort((a, b) => a.list_id - b.list_id);
    },
  },
  async created() {
    try {
      this.unsubscribe = shoppyFirestore.collection("shoppy").onSnapshot(
        (doc) => {
          let newDoc = doc.docs.map((item) => item.data());
          this.items = newDoc;
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

section {
  position: absolute;
  top: calc(2rem + 20px);
  bottom: 8rem;
  max-width: 500px;
  width: 80vw;
  overflow-y: auto;
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

.drag-over {
  border-bottom: 5px solid #39a9cb;
}
</style>
