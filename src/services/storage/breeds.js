const getLocalStorageItem = (key) => {
  return JSON.parse(window.localStorage.getItem(key));
};

const setLocalStorageItem = (key, value) => {
  return window.localStorage.setItem(key, JSON.stringify(value));
};

export const localStorage = {
  getActiveBreeds: () => getLocalStorageItem("activeBreeds"),
  setActiveBreeds: (val) => setLocalStorageItem("activeBreeds", val),
  getNumberOfImages: () => getLocalStorageItem("numberOfImages"),
  setNumberOfImages: (val) => setLocalStorageItem("numberOfImages", val),
};
