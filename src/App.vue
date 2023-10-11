<template>
  <div class="container">
    <BreedList
      :activeBreeds="activeBreeds"
      @update-active-breeds="updateAllActiveBreeds"
    />
    <BreedImages
      :activeBreeds="activeBreeds"
      @update-active-breeds="updateAllActiveBreeds"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import BreedList from "./components/BreedList.vue";
import BreedImages from "./components/BreedImages.vue";
import { localStorage } from "./services/storage/breeds";

const activeBreeds = ref(localStorage.getActiveBreeds() ?? []);
const updateAllActiveBreeds = (breeds) => {
  activeBreeds.value = breeds;
  localStorage.setActiveBreeds(activeBreeds.value);
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
<style lang="scss" scoped>
.container {
  display: flex;
  overflow-x: scroll;
  min-width: 450px;
  max-width: 1440px;
  margin: 0 auto;
  justify-content: space-around;
  gap: 30px;
  @media only screen and (max-width: 750px) {
    flex-direction: column-reverse;
  }
}
</style>
