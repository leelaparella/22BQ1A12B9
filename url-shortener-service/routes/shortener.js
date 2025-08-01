const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Url = require('../models/Url'); // only if using MongoDB

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// POST /shorturls
router.post('/shorturls', async (req, res) => {
  const { url, shortcode, validity } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const code = shortcode || nanoid(6);

  try {
    const exists = await Url.findOne({ shortCode: code });
    if (exists) return res.status(409).json({ error: 'Shortcode already exists' });

    const entry = new Url({
      originalUrl: url,
      shortCode: code,
      validity: validity || 30,
    });

    await entry.save();

    return res.status(201).json({
      shortUrl: `http://localhost:3000/${code}`,
      expiresAt: new Date(Date.now() + (validity || 30) * 60000),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /shorturls/:shortcode
router.get('/shorturls/:shortcode', async (req, res) => {
  const { shortcode } = req.params;

  try {
    const urlDoc = await Url.findOne({ shortCode: shortcode });
    if (!urlDoc) return res.status(404).json({ error: 'Shortcode not found' });

    const expiresAt = new Date(urlDoc.createdAt.getTime() + urlDoc.validity * 60000);
    if (Date.now() > expiresAt) return res.status(410).json({ error: 'Link expired' });

    return res.status(200).json({
      originalUrl: urlDoc.originalUrl,
      createdAt: urlDoc.createdAt,
      expiresAt,
      totalClicks: urlDoc.clicks.length,
      clickDetails: urlDoc.clicks,
    });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /:shortcode (Redirection)
router.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params;

  try {
    const urlDoc = await Url.findOne({ shortCode: shortcode });
    if (!urlDoc) return res.status(404).json({ error: 'Shortcode not found' });

    const expiresAt = new Date(urlDoc.createdAt.getTime() + urlDoc.validity * 60000);
    if (Date.now() > expiresAt) return res.status(410).json({ error: 'Link expired' });

    urlDoc.clicks.push({
      timestamp: new Date(),
      referrer: req.headers.referer || 'direct',
      location: req.ip || 'unknown',
    });

    await urlDoc.save();

    return res.redirect(urlDoc.originalUrl);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
