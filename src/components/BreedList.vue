<template>
  <form class="form-container">
    <fieldset class="container">
      <legend>Breeds</legend>
      <div v-if="loading">Loading Dog Breeds...</div>
      <div v-if="error">Something went wrong</div>
      <div v-else>
        <template v-for="(value, key) in breeds" :key="key">
          <div class="checkbox-container">
            <input
              type="checkbox"
              :disabled="isDisabled(key)"
              :id="key"
              :value="key"
              :checked="isChecked(key)"
              @change="handleClick(key)"
              className="checkbox"
            />
            <label :for="key">{{ key }}</label>
          </div>
          <p class="checkbox-number">Number of Sub-breeds:{{ value.length }}</p>
        </template>
      </div>
    </fieldset>
  </form>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted } from "vue";
import { listBreeds } from "../services/api/breeds";
const props = defineProps(["activeBreeds"]);
const emit = defineEmits(["updateActiveBreeds"]);

const breeds = ref([]);
const isLoading = ref(false);
const isError = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    const apiData = await listBreeds();
    breeds.value = apiData.message;
  } catch (error) {
    console.error(error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
});

const isChecked = (item) => {
  if (props.activeBreeds.includes(item)) {
    return true;
  }
  return false;
};

const isDisabled = (item) => {
  if (props.activeBreeds.length > 1 && !props.activeBreeds.includes(item)) {
    return true;
  }
};

const handleClick = (key) => {
  let breeds = [];
  if (props.activeBreeds.includes(key)) {
    breeds = props.activeBreeds.filter((item) => item !== key);
  } else {
    breeds = [...props.activeBreeds, key];
  }
  emit("updateActiveBreeds", breeds);
};
</script>
<style lang="scss" scoped>
.form-container {
  width: 40%;
}
.container {
  min-width: 280px;
}
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
}
.checkbox-number {
  text-align: left;
  height: 24px;
  margin-top: 0;
  border-bottom: 1px solid black;
}
.checkbox {
  width: 16px;
  height: 16px;
}
</style>
