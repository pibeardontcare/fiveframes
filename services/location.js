
import * as Location from 'expo-location';

//theres a bug causeing this to hang, so timeout added 


const TIMEOUT = 8000;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('location timeout')), ms)),
  ]);
}

async function fetchCoords() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;
  const location = await Location.getCurrentPositionAsync({});
  return { latitude: location.coords.latitude, longitude: location.coords.longitude };
}

export async function getCurrentCoords() {
  try {
    return await withTimeout(fetchCoords(), TIMEOUT);
  } catch (e) {
    console.log('getCurrentCoords error:', e.message);
    return null;
  }
}

