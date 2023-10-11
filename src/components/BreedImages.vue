<template>
  <div>
    <h1>Select a dog from the checklist</h1>
    <div className="selectors">
      <template v-for="item in activeBreeds" :key="item">
        <template v-if="item">
          <div className="selectors-content">
            <h2>Configure `{{ item }}` details:</h2>
            <select
              className="select"
              v-model="numberOfImages[item]"
              @change="(e) => handleSelectChange(item, e)"
            >
              <template v-for="n in 10" :key="n"
                ><option className="option" :selected="n === 5" :value="n">
                  {{ n }}
                </option></template
              >
            </select>
          </div>
        </template>
      </template>
    </div>
    <button class="button" :disabled="isLoading" @click="fetchBreeds">
      Refetch
    </button>
    <div className="image-container">
      <template
        v-for="(urls, breedName) in imageListForMultipleBreeds"
        :key="breedName"
      >
        <div class="image-content">
          <h3>Breed Name: {{ breedName }}</h3>
          <p v-if="isLoading">Loading...</p>
          <p v-else-if="isError">Could not load images</p>
          <div v-else>
            <template v-for="url in urls" :key="url">
              <img
                @click="removeImage(breedName, url)"
                class="image"
                alt="picture of a dog"
                :src="url"
              />
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { defineEmits, defineProps, ref, watch } from "vue";
import { getBreedImages } from "../services/api/breeds";
import { localStorage } from "../services/storage/breeds";

const props = defineProps(["activeBreeds"]);
const emit = defineEmits(["removeActiveBreeds"]);
const imageListForMultipleBreeds = ref({});
const numberOfImages = ref(localStorage.getNumberOfImages() ?? {});
const isError = ref(false);
const isLoading = ref(false);

const handleBreedImages = async (name, imageNumber) => {
  try {
    isLoading.value = true;
    isError.value = false;
    const breedImages = await getBreedImages(name, imageNumber);
    return { [name]: breedImages.message };
  } catch (error) {
    console.error(error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const removeImage = (breedName, url) => {
  imageListForMultipleBreeds.value = {
    ...imageListForMultipleBreeds.value,
    [breedName]: imageListForMultipleBreeds.value[breedName].filter(
      (item) => item !== url
    ),
  };

  if (imageListForMultipleBreeds.value[breedName].length < 1) {
    const filteredActiveBreeds = props.activeBreeds.filter(
      (item) => item !== breedName
    );
    emit("updateActiveBreeds", filteredActiveBreeds);
  }
};

const handleSelectChange = (item, e) => {
  localStorage.setNumberOfImages({
    ...numberOfImages.value,
    [item]: e.target.value,
  });
};

const numImagesToShow = (userSelectedNumber) =>
  userSelectedNumber
    ? userSelectedNumber
    : props.activeBreeds.length > 1
    ? 5
    : 10;

const fetchBreeds = async () => {
  let result = {};
  if (props.activeBreeds.length) {
    await (async function () {
      for (const breed of props.activeBreeds) {
        result = {
          ...result,
          ...(await handleBreedImages(
            breed,
            numImagesToShow(numberOfImages.value[breed])
          )),
        };
      }
    })();

    imageListForMultipleBreeds.value = result;
  }
};

watch([() => props.activeBreeds], async () => await fetchBreeds(), {
  immediate: true,
});
</script>
<style scoped lang="scss">
.container {
  min-width: 200px;
}
.selectors {
  display: flex;
  justify-content: space-between;
}
.selectors-content {
  width: 30%;
  min-width: 200px;
  gap: 16px;
  margin-bottom: 25px;
}

.select {
  width: 80px;
  height: 40px;
  border-radius: 4px;
}

.image {
  max-width: 25%;
  margin: 16px;
  border-radius: 4px;
}

.image-container {
  min-height: 300px;
  border: 1px solid #000;
  padding: 16px 16px 0;
  border-radius: 8px;
  margin-bottom: 24px;
  background: #bdb1b1;
  min-width: 200px;
}

.image-content {
  border-bottom: 1px solid #000;
}

.button {
  height: 48px;
  background: #101010;
  color: white;
  border: 0;
  margin-bottom: 24px;
  border-radius: 4px;
  padding: 8px 24px;
  font-weight: 500;
  cursor: pointer;
}
.button:disabled {
  opacity: 0.2;
  cursor: unset;
}
</style>
