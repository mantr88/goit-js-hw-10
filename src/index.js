// Iмпорт стилів
import './css/styles.css';
// імпорт методу debounce з бібліотеки Lodash
import debounce from "lodash.debounce";
// імпорт елементу Notify з бібліотеки Notiflix
import { Notify } from 'notiflix';
// Додатковий імпорт стилів з бібліотеки Notiflix
import "notiflix/dist/notiflix-3.2.6.min.css"


const DEBOUNCE_DELAY = 300;
const URL = 'https://restcountries.com/v3.1/name'
let name ={};
let capital = '';
let population = 0;
let flags = {};
let languages = {};
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
      <img src="${flags.svg}" alt=${name.official} width="60" height="40">${name.official}</img>
      <p>Capital: <span class="capital">${capital}</span></p>
      <p>Population: <span class="population">${population}</span></p>
      <p>Languages: <span class="languages">${languages}</span></p>`) 
    refs.info.innerHTML = '';
    refs.info.insertAdjacentHTML('beforeend', infoMarkup);
};




const fetchCountries = (name) => {
    fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Cant load the items');
            }
        }
    ).then((data) => {
        if(data.length===1) {
                items = data;
                name = data.name;
                flags = data.flags;
                capital = data.capital;
                population = data.population;
                languages = data.languages;

                refs.countryList.innerHTML = '';
                renderInfo();

            } else if (data.length < 10 || data.length >= 2) {
                items = data;
                name = data.name;
                flags = data.flags;
                renderSearchList();   
            } else if (data.length >= 10) {
            Notify.info("Too many matches found. Please enter a more specific name.");
            return
            }
        }).catch((error) => console.log('error: ', error));
};


refs.input.addEventListener('input', debounce((e) => {
    e.preventDefault();
    let query = (e.target.value).trim();
    if (query === '') {
        refs.countryList.innerHTML = '';
        return
    }
    name = query;
    fetchCountries(query);
}, DEBOUNCE_DELAY));
