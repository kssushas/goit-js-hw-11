import { fetchData } from './pixabey';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.loadMore-hidden'),
  lastP: document.querySelector('.lastP-hidden'),
};

let page = 1;

refs.form.addEventListener('submit', onSubmitBnt);
refs.input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    onSubmitBnt(e);
  }
});
refs.loadMore.addEventListener('click', onLoadMoreClick);

async function onSubmitBnt(e) {
  e.preventDefault();
  refs.lastP.classList.replace('lastP', 'lastP-hidden');

  try {
    const data = await fetchData(`${refs.form.elements.searchQuery.value}`);
    refs.loadMore.classList.replace('loadMore', 'loadMore-hidden');
    if (data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      throw new Error();
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    if (data.hits.length > 39) {
      refs.loadMore.classList.replace('loadMore-hidden', 'loadMore');
    }

    const markup = validData(data.hits);
    refs.gallery.innerHTML = markup;
    new SimpleLightbox('.gallery a');

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 1.3,
      behavior: 'smooth',
    });
  } catch (error) {
    console.error(error);
  }
}

async function onLoadMoreClick(e) {
  page += 1;

  try {
    const data = await fetchData(
      `${refs.form.elements.searchQuery.value}`,
      page
    );

    if (data.hits.length < 40) {
      refs.loadMore.classList.replace('loadMore', 'loadMore-hidden');
      refs.lastP.classList.replace('lastP-hidden', 'lastP');
    }
    const markupLoadMore = validData(data.hits);
    refs.gallery.insertAdjacentHTML('beforeend', markupLoadMore);
    let gallery = new SimpleLightbox('.gallery a');
    gallery.refresh();
  } catch (er) {
    console.log(er);
  }
}

function validData(data) {
  const readyMarkup = data.map(data => {
    return createMarkup(
      data.webformatURL,
      data.largeImageURL,
      data.tags,
      data.likes,
      data.views,
      data.comments,
      data.downloads
    );
  });
  return readyMarkup.join(' ');
}

function createMarkup(
  smallImage,
  largeImage,
  alt,
  likes,
  views,
  comments,
  downloads
) {
  return `<div class="photo-card">
    <a href="${largeImage}">
    <img src="${smallImage}" alt="${alt} " loading="lazy"/>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${likes}
      </p>
      <p class="info-item">
        <b>Views</b>${views}
      </p>
      <p class="info-item">
        <b>Comments</b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${downloads}
      </p>
    </div>
    </a>
  </div>`;
}
