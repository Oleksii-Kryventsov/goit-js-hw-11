import Notiflix from "notiflix";
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34970535-de5786fce74da62105e4e2a92'

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

let searchQuery = "";
let totalHits = 40;
let page = 1;
let per_page = 40;
const lightbox = new SimpleLightbox('.gallery a', {
    captionSelector: 'img',
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    scrollZoom: false,
});

function handleSearch(event) {
    event.preventDefault();
    searchQuery = event.target.searchQuery.value.trim();
    clearGallery();
    if (!searchQuery) {
        return
    }
    fetchImg(searchQuery);
    event.target.reset();
}

function clearGallery() {
    gallery.innerHTML = "";
}

function renderGallery(images) {
    page += 1;
    totalHits = images.data.totalHits;
    
    if (images.data.hits.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    };
    const createImgMarkup = images.data.hits.map(({ webformatURL, largeImageURL, likes, views, comments, downloads, tags }) => {
        const createdImg = `
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
        </a>
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
        </div>`
        return createdImg;
    }); join("");

    gallery.insertAdjacentElement('beforeend', createImgMarkup);
    loadMoreBtn.classList.remove('is-hidden');
    lightbox.refresh();

    if (images.data.hits.length < 40) {
        loadMoreBtn.classList.add('is-hidden')
    };
};

function handleError() {
    Notiflix.Notify.failure('Error');
};

function handleLoadMore() {
    loadMoreBtn.classList.add('is-hidden');
    fetchImg(searchQuery);
    searchQuery = '';

    if ((totalHits - page * per_page) > 0) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits - page * per_page} images.`);
    } else if ((totalHits - page * per_page) < 40) {
        Notiflix.Notify.warning('We`re sorry, but you`ve reached the end of search results.');
    }
};

async function fetchImg(searchQuery) {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                key: API_KEY,
                q: searchQuery,
                per_page: per_page,
                page: page,
                safesearch: true,
                orientation: 'horizontal',
                image_type: 'photo',
            },
        });
        
    renderGallery(response);
    
    } catch (error) {
    handleError(error);
    }
}

