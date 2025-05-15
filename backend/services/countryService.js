const axios = require('axios');

async function getAllCountries() {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name');
    return response.data.map(country => country.name.common);
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    throw new Error('Failed to fetch countries from RestCountries API');
  }
}

async function getCountryData(countryName) {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}?fields=name,flags,currencies,capital,languages`);
    const countryData = response.data[0];
    return {
      name: countryData.name.common,
      flag: countryData.flags.png,
      currency: Object.values(countryData.currencies || {})[0]?.name || 'N/A',
      capital: countryData.capital?.[0] || 'N/A',
      languages: Object.values(countryData.languages || {}).join(', ') || 'N/A' 
    };
  } catch (error) {
    console.error(`Error fetching data for ${countryName}:`, error.message);
    throw new Error(`Failed to fetch data for ${countryName}`);
  }
}

module.exports = { getAllCountries, getCountryData };