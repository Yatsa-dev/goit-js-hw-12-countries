'use stricts';

import debounce from 'lodash.debounce';
import countryTemplates from './templates/country-card.hbs';
import countryItemTpl from './templates/country-list.hbs'
import Notiflix from "notiflix";
import './css/styles.css';

const DEBOUNCE_DELAY = 500;
const refs = {
    cardContainer: document.querySelector('.country-info'),
    serchForm: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
};
refs.serchForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    event.preventDefault();
    const inputValue = refs.serchForm.value;
    if (inputValue === '') {
        refs.countryList.innerHTML = ''
        refs.cardContainer.innerHTML = ''
        return
    }

    fetchCountries(inputValue)
        .then(response => {
            if (response.length === 1) {
                renderCountryCard(response);
                refs.countryList.innerHTML = '';
                return;
            }
            if (response.length > 1 && response.length < 11) {
                const markup = response
                    .map(el => {
                        return countryItemTpl(el);
                    })
                    .join('');
                refs.cardContainer.innerHTML = '';
                refs.countryList.innerHTML = markup;
                return;
            }
            if (response.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            }
        }).catch(error => {
            if (error === 404) {
                Notiflix.Notify.failure('Oops, there is no country with that name')
            }
        })
        .finally(
            refs.cardContainer.innerHTML = ''
        );
}
function fetchCountries(name) {
    return fetch(`https://restcountries.eu/rest/v2/name/${name}`)
        .then(response => (response.ok)
            ? response.json()
            : Promise.reject(response.status))
}
function renderCountryCard(country) {
    const markup = countryTemplates(...country);
    refs.cardContainer.insertAdjacentHTML('beforeend', markup);
}
