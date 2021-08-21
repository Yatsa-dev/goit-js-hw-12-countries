function fetchCountries(name) {
    return fetch(`https://restcountries.eu/rest/v2/name/${name}`)
        .then(response => (response.ok)
            ? response.json()
            : Promise.reject(response.status))
}

export default { fetchCountries };