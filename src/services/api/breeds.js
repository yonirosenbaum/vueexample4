const baseURL = "https://dog.ceo";

const fetch = {
  get: (url, config) => window.fetch(url, config),
};

export const listBreeds = (config) => {
  return fetch
    .get(`${baseURL}/api/breeds/list/all`, config)
    .then((res) => res.json());
};

export const getBreedImages = (slug, numOfImages = 5, config) => {
  return fetch
    .get(`${baseURL}/api/breed/${slug}/images/random/${numOfImages}`, config)
    .then((res) => res.json());
};
