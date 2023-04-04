import Notiflix from "notiflix";
import API from './fetch';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const simpleLightbox = new SimpleLightbox(".gallery a", { captionSelector: 'img', captionsData: 'alt', captionDelay: 250 });
const serviceAPI = new API();


form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);


function handleSearch(event) {
  event.preventDefault();
  currentQuery();
  try {
    fetchGallery();
  }
  catch (error) {
    console.log(error);
    Notiflix.Notify.failure("Error!!!");
  }
}
function createGalleryMarkup(images) {
    return images.map(({largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => {
        return `
        <div class="gallery photo-card">
            <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item">
                <b>Likes:<br> <span class="data">${likes}</span></b>
                </p>
                <p class="info-item">
                <b>Views:<br> <span class="data">${views}</span></b>
                </p>
                <p class="info-item">
                <b>Comments:<br> <span class="data">${comments}</span></b>
                </p>
                <p class="info-item">
                <b>Downloads:<br> <span class="data">${downloads}</span></b>
                </p>
            </div>
            </div>
        `;
    }).join('');


    // gallery.insertAdjacentHTML("beforeend", createImgMarkup);
    // loadMoreBtn.classList.remove('is-hidden');
    // simpleLightbox.refresh();

    // if (images.data.hits.length < 40) {
    //     loadMoreBtn.classList.add('is-hidden')
    // }
};

function createImg(images) {
  gallery.insertAdjacentHTML("beforeend", images);
  simpleLightbox.refresh();
};

function clearGallery() {
    gallery.innerHTML = '';
};

async function handleLoadMore() {
  try {
    const response = await serviceAPI.fetchImages();
    const cardEl = document.querySelectorAll('.photo-card');
    if (cardEl.length === response.data.totalHits) {
      endGallery();
    };
    
      const newPage = createGalleryMarkup(response.data.hits);
      createImg(newPage);
        
    } catch (error) {
    console.log(error);
    Notiflix.Notify.failure("Error!");
  }
};

function endGallery() {
  loadMoreBtn.classList.toggle('is-hidden');
  Notiflix.Notify.info("Were sorry, but you've reached the end of search results");
};

function currentQuery() {
  const formData = new FormData(form);
  serviceAPI.query = formData.get('searchQuery').trim();
  serviceAPI.resetPage();
  clearGallery();
};

async function fetchGallery() {
    const response = await serviceAPI.fetchImages();
    const hits = response.data.hits;
    const totalHits = response.data.totalHits;
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
      clearGallery();
      return;
    };

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    const galleryMarkup = createGalleryMarkup(hits);
    createImg(galleryMarkup);
    loadMoreBtn.classList.toggle('is-hidden');
};
