<template>
  <main>
    <h1>👩‍🍳 👨‍🍳</h1>
    <h1>Wann kochen wir was?</h1>
    <CookCalendar />
  </main>
</template>

<script>
import CookCalendar from "@/components/CookCalendar.vue";

export default {
  name: "Cooky",
  components: {
    CookCalendar,
  },
};
</script>

<style scoped>
main {
  position: relative;
  background-color: #39a9cb;
  width: 100%;
  height: 100%;
  color: #232323;
  text-align: center;
}

h1 {
  margin-bottom: 10px;
}
</style>
