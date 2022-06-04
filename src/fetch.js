export default class FindCountry {
  constructor() {}
  fetchCountry(country) {
    if (!country) return;
    return fetch(
      `https://restcountries.com/v3.1/name/${country}?fields=name,capital,population,flags,svg,languages`
    )
      .then(r => {
        if (!r.ok) {
          console.log(r);
          return 0;
        }
        return r.json();
      })
      .catch(e => console.log(e));
  }
}
