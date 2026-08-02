const GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export async function getPlaceName(latitude, longitude) {
  try {
    const url = new URL(GEOCODE_URL);
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set('localityLanguage', 'en');

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.log('getPlaceName: bad status', response.status);
      return null;
    }

    const data = await response.json();
    return data.locality || data.city || data.principalSubdivision || data.countryName || null;
  } catch (e) {
    console.log('getPlaceName error:', e);
    return null;
  }
}