const BASE_URL = 'https://restcountries.com/v3.1';
const END_POINT_NAME = '/name';

function fetchCountries(countryName, searchParams) {
  const URL = `${BASE_URL}${END_POINT_NAME}/${countryName}?${searchParams}`;
  return fetch(URL).then(resp => {
    if (!resp.ok) {
      throw new Error(resp);
    }
    return resp.json();
  });
}

export { fetchCountries };
