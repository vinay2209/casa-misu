const express = require('express');
const router = express.Router();
const { STORE_LAT, STORE_LNG, DELIVERY_LAT_MIN, DELIVERY_LAT_MAX, DELIVERY_LNG_MIN, DELIVERY_LNG_MAX } = require('../utils/store');

// Nominatim (OpenStreetMap) has no CORS headers, so this can't be called
// directly from the browser — the frontend calls this route instead, which
// calls Nominatim server-to-server. Small in-memory cache since pincodes
// don't move and Nominatim asks callers to be polite (max ~1 req/sec).
const cache = new Map();

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET /api/delivery/check?pincode=400097
router.get('/check', async (req, res) => {
  try {
    const pincode = String(req.query.pincode || '').trim();
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ message: 'Enter a valid 6-digit postal code' });
    }

    let coords = cache.get(pincode);
    if (!coords) {
      const url = `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&limit=1`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'CasaMisuWebsite/1.0 (casamisuuuuu2026@gmail.com)' },
      });
      const data = await resp.json();
      if (!Array.isArray(data) || data.length === 0) {
        return res.json({ found: false, eligible: false });
      }
      coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      cache.set(pincode, coords);
    }

    const distanceKm = haversineKm(STORE_LAT, STORE_LNG, coords.lat, coords.lng);
    const eligible =
      coords.lat >= DELIVERY_LAT_MIN &&
      coords.lat <= DELIVERY_LAT_MAX &&
      coords.lng >= DELIVERY_LNG_MIN &&
      coords.lng <= DELIVERY_LNG_MAX;
    return res.json({ found: true, eligible, distanceKm: Math.round(distanceKm * 10) / 10 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not check delivery eligibility right now' });
  }
});

module.exports = router;
