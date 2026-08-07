export function getMoodByDay(entries) {
  const days = {};
  for (const entry of entries) {
    const day = entry.timestamp.slice(0, 10);
    if (!days[day]) days[day] = [];
    days[day].push(entry.mood);
  }
  return Object.entries(days).map(([day, moods]) => ({
    day,
    averageMood: moods.reduce((sum, mood) => sum + mood, 0) / moods.length,
  }));
}

function getHourBucket(timestamp) {
  const hour = new Date(timestamp).getHours();
  if (hour < 6) return 'Night';
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  if (hour < 21) return 'Evening';
  return 'Night';
}

export function getBestTimeOfDay(entries) {
  if (entries.length === 0) return null;
  const buckets = {};
  for (const entry of entries) {
    const bucket = getHourBucket(entry.timestamp);
    if (!buckets[bucket]) buckets[bucket] = [];
    buckets[bucket].push(entry.mood);
  }
  let best = null;
  let bestAvg = -Infinity;
  for (const [bucket, moods] of Object.entries(buckets)) {
    const avg = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
    if (avg > bestAvg) {
      bestAvg = avg;
      best = bucket;
    }
  }
  return best;
}

const CLUSTER_RADIUS_METERS = 150; 

function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function clusterByLocation(entries) {
const withCoords = entries.filter((entry) => entry.latitude != null && entry.longitude != null);
  const clusters = [];

  for (const entry of withCoords) {
    const existing = clusters.find(
    (cluster) =>
        distanceMeters(entry.latitude, entry.longitude, cluster.latitude, cluster.longitude) <
        CLUSTER_RADIUS_METERS
    );
    
    if (existing) {
      existing.entries.push(entry);
    } else {
      clusters.push({ latitude: entry.latitude, longitude: entry.longitude, entries: [entry] });
    }
  }

  return clusters;
}

export function getBestAndWorstPlace(entries) {
  const clusters = clusterByLocation(entries);
  if (clusters.length === 0) return { best: null, worst: null };

  const scored = clusters.map((cluster) => ({
    place: cluster.entries[0].place || 'Unnamed place',
    averageMood: cluster.entries.reduce((sum, e) => sum + e.mood, 0) / cluster.entries.length,
  }));

  scored.sort((a, b) => b.averageMood - a.averageMood);

  return {
    best: scored[0]?.place ?? null,
    worst: scored[scored.length - 1]?.place ?? null,
  };
}