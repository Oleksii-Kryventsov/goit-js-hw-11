import axios from 'axios';

const API_KEY = '34970535-de5786fce74da62105e4e2a92';
const BASE_URL = 'https://pixabay.com/api/';

export default class API {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
    }
    
    fetchImages() {
        const response = axios.get(`${BASE_URL}`, {
            params: {
                key: API_KEY,
                q: this.searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                page: this.page,
                per_page: this.per_page,
                safesearch: true,
                
            },
        })
    
        this.renderGallery();
        return response
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
    renderGallery() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
};