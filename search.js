const express = require('express');
const router = express.Router();
const { searchGoogle } = require('../services/googleSearch');

/**
 * GET /api/search?q=klicove+slovo
 * Vrátí JSON s organickými výsledky z Googlu
 */
router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({ error: 'Parametr q (dotaz) je povinný.' });
  }

  try {
    const results = await searchGoogle(q.trim());
    return res.status(200).json(results);
  } catch (error) {
    console.error('Chyba při vyhledávání:', error.message);
    return res.status(500).json({ error: 'Nepodařilo se načíst výsledky z Googlu.' });
  }
});

module.exports = router;
