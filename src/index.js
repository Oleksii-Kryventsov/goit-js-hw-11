import Notiflix from "notiflix";
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34970535-de5786fce74da62105e4e2a92';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');


form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

let searchQuery = '';
const simpleLightbox = new SimpleLightbox(".gallery a", { captionSelector: 'img', captionsData: 'alt', captionDelay: 250 });


function handleSearch(event) {
    event.preventDefault();
    searchQuery = event.target.searchQuery.value.trim();
    clearGallery();
    if (!searchQuery) {
        return
    };
    fetchImg(searchQuery)
    event.target.reset();
};

function clearGallery() {
    gallery.innerHTML = '';
};

let totalHits = 40;
let page = 1;
let per_page = 40;

function renderGallery(images) {
    page += 1;
    
    totalHits = images.data.totalHits;
    if (images.data.hits.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');   
    };
    
    const createImgMarkup = images.data.hits.map(({largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => {
        const createdImg = `
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
        return createdImg;
    }).join('');

    gallery.insertAdjacentHTML("beforeend", createImgMarkup);
    loadMoreBtn.classList.remove('is-hidden');
    simpleLightbox.refresh();

    if (images.data.hits.length < 40) {
        loadMoreBtn.classList.add('is-hidden')
    }
};

function handleError() {
    Notiflix.Notify.failure('Error');
};

function handleLoadMore() {
    loadMoreBtn.classList.add('is-hidden');
    fetchImg(searchQuery)
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
};