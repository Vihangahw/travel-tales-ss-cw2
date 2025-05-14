const express = require('express');
const router = express.Router();
const { getAllCountries, getCountryData } = require('../services/countryService');

router.get('/countries', async (req, res) => {
  try {
    const countries = await getAllCountries();
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/country/:name', async (req, res) => {
  try {
    const countryData = await getCountryData(req.params.name);
    res.status(200).json(countryData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;