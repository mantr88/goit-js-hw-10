// Iмпорт стилів
import './css/styles.css';
// імпорт методу debounce з бібліотеки Lodash
import debounce from "lodash.debounce";
// імпорт елементу Notify з бібліотеки Notiflix
import { Notify } from 'notiflix';
// Додатковий імпорт стилів з бібліотеки Notiflix
import "notiflix/dist/notiflix-3.2.6.min.css"
// Імпорт функції запиту на backend
import { fetchCountries } from './js/fetchCountries';


const DEBOUNCE_DELAY = 300;


let items = [];

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
};


const renderSearchList = () => {
    const list = items.map(({ flags, name }) => `<li><img src="${flags.svg}" alt=${name.official} width="60" height="40">${name.official}</img></li>`).join('');
    refs.countryList.innerHTML = '';
    refs.countryList.insertAdjacentHTML('beforeend', list);
};

const renderInfo = () => {
    const infoMarkup = items.map(({ name, flags, capital, population, languages }) => `
      <h1><img src="${flags.svg}" alt=${name.official} width="60" height="40">${name.official}</img></h1>
      <p>Capital: <span class="capital">${capital}</span></p>
      <p>Population: <span class="population">${population}</span></p>
      <p>Languages: <span class="languages">${Object.values(languages)}</span></p>`);
    refs.countryList.innerHTML = ''; 
    refs.info.innerHTML = '';
    refs.info.insertAdjacentHTML('beforeend', infoMarkup);
};

const fetchHandler = (name) => {
    fetchCountries(name)
        .then((data) => {
        if (data.length < 10 || data.length >= 2) {
            items = data;
           
            refs.countryList.innerHTML = '';
            renderSearchList();
        };
            
        if (data.length === 1) {
            items = data;
       
            renderInfo();
        };

        if (data.length > 10) {
            refs.countryList.innerHTML = '';
            refs.info.innerHTML = '';

            Notify.info("Too many matches found. Please enter a more specific name.");
            return
        };
          
    }).catch(() => {
        refs.countryList.innerHTML = '';
        refs.info.innerHTML = '';

        Notify.failure("Oops, there is no country with that name");
        });
};

const inputHandler = (e) => { 
     e.preventDefault();
    let query = (e.target.value).trim();
    if (query === '') {
        refs.countryList.innerHTML = '';
        refs.info.innerHTML = '';
        return
    }
    fetchHandler(query);
};

refs.input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
