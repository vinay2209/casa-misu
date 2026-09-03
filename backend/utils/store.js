// Store location — geocoded once from the FSSAI-registered pincode (400097,
// Goregaon East, Mumbai) via OpenStreetMap Nominatim. Update these if the
// kitchen/store address ever changes.
const STORE_ADDRESS = 'JP Decks, Goregaon East, Mumbai, Maharashtra 400097';
const STORE_LAT = 19.1825942;
const STORE_LNG = 72.8594091;

// Delivery area is the western-suburbs corridor Goregaon sits in the middle
// of — south to Bandra (East/West), north to Mira Road (East/West), not a
// simple radius (a circle would either cut into that corridor or bleed out
// past it, e.g. east into Thane / south past Bandra into South Mumbai).
// Bounds pad slightly past each end so both East and West pincodes clear it.
const DELIVERY_LAT_MIN = 19.05; // just south of Bandra
const DELIVERY_LAT_MAX = 19.30; // just north of Mira Road, short of Bhayander
const DELIVERY_LNG_MIN = 72.78; // west edge of the corridor, toward the coast
const DELIVERY_LNG_MAX = 72.91; // east edge, short of Thane

const DELIVERY_FEE = 160;

module.exports = {
  STORE_ADDRESS,
  STORE_LAT,
  STORE_LNG,
  DELIVERY_LAT_MIN,
  DELIVERY_LAT_MAX,
  DELIVERY_LNG_MIN,
  DELIVERY_LNG_MAX,
  DELIVERY_FEE,
};
