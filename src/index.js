import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');
const searchParams = 'fields=name,capital,population,flags,languages';
let countryName;
let languageCharacters;

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  countryName = e.target.value.toLowerCase().trim();
  languageCharacters = countryName.slice(0, 3).toLowerCase();
  if (!countryName) {
    cleanDOM();
    return;
  }
  fetchCountries(countryName, searchParams)
    .then(data => filtersInterface(data))
    .catch(() => throwError());
}

function filtersInterface(data) {
  if (data.length > 10) {
    cleanDOM();
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (data.length >= 2 && data.length <= 10) {
    listEl.innerHTML = createMarkupMoreThanOne(data);
    divEl.innerHTML = '';
  } else if (data.length === 1) {
    listEl.innerHTML = createMarkupMoreThanOne(data);
    divEl.innerHTML = createMarkupOne(data);
    const name = document.querySelector('.of-name-js');
    name.classList.add('of-name-js--mod');
  }
}

function createMarkupMoreThanOne(arr) {
  return arr
    .map(
      ({
        name: { official },
        flags: { svg },
      }) => `<div class="container-js"><img class="img-js" src="${svg}" alt="${official}">
    <h2 class="of-name-js">${official}</h2></div>`
    )
    .join('');
}

function createMarkupOne(arr) {
  return arr
    .map(
      ({
        capital,
        population,
        languages,
      }) => `<h3><span class="property-decoration">Capital: </span><span class="value-decoration">${capital}</span></h3>
<p><span class="property-decoration">Population: </span><span class="value-decoration">${population}</span></p>
<p><span class="property-decoration">Languages: </span><span class="value-decoration">${languages[languageCharacters]}</span></p>`
    )
    .join('');
}

function throwError() {
  cleanDOM();
  Notify.failure('Oops, there is no country with that name');
}

function cleanDOM() {
  listEl.innerHTML = '';
  divEl.innerHTML = '';
}
