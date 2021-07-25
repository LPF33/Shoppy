<template>
  <main>
    <h1>👩‍🍳 Wann kochen wir was? 👨‍🍳</h1>
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
</style>
