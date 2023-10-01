import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const options =
  'key=39676264-d979f0a5535d0f08dce9d65a8&image_type=photo&orientation=horizontal&safesearch=true';

export async function fetchData(inputData, page = 1) {
  const responses = await axios.get(
    `${BASE_URL}?${options}&q=${inputData}&page=${page}&per_page=40`
  );
  return responses.data;
}
