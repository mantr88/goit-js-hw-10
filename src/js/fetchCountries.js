const URL = 'https://restcountries.com/v3.1/name';

export const fetchCountries = (name) => {
    return fetch(`${URL}/${name}?fields=name,capital,population,flags,languages`)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Cant load the items');
            }
        }
        )
};