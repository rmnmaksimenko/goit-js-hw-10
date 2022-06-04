import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import FindCountry from './fetch';
const findCountry = new FindCountry();

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryInfo: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
};
const DEBOUNCE_DELAY = 400;

refs.searchBox.addEventListener('input', debounce(search, DEBOUNCE_DELAY));

function search(e) {
  const searchValue = e.target.value.trim();
  if (!searchValue) {
    return;
  }
  findCountry
    .fetchCountry(searchValue)
    .then(r => {
      if (r === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return;
      }
      if (r.length >= 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
      } else if (r.length >= 2) {
        let text = '';
        for (let i = 0; i < r.length; i++) {
          const name = r[i].name.official;
          const flag = r[i].flags.svg;
          const svg = `<img class='flag' src="${flag}" alt="${name}">`;
          text += svg + name + '<br>';
        }
        refs.countryList.classList.remove('country-big');
        refs.countryList.classList.add('country-small');
        refs.countryList.innerHTML = text;
        refs.countryInfo.innerHTML = '';
        // console.log(r);
      } else if (r.length === 1) {
        const capital = r[0].capital;
        const population = separatedigits(r[0].population);
        const languagesObj = r[0].languages;
        const name = r[0].name.official;
        const flag = r[0].flags.svg;
        const svg = `<img class='flag' src="${flag}" alt="${name}">`;
        let text = `<span class='span'>Capital:</span> ${capital}<br><span class='span'>Population:</span> ${population}<br>`;
        let isMultipleLanguages = 0;
        let languagesText = '';
        for (const key in languagesObj) {
          if (isMultipleLanguages > 0) {
            languagesText += `, `;
          }
          languagesText += `${languagesObj[key]}`;

          isMultipleLanguages += 1;
        }
        if (isMultipleLanguages >= 2) {
          text += `<span class='span'>Languages:</span> ${languagesText}<br>`;
        } else {
          text += `<span class='span'>Language:</span> ${languagesText}<br>`;
        }

        refs.countryList.classList.remove('country-small');
        refs.countryList.classList.add('country-big');
        refs.countryList.innerHTML = svg + name;
        refs.countryInfo.innerHTML = text;
        // console.log(r, flag);
      }
    })
    .catch(e => console.log(e));
}

function separatedigits(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
