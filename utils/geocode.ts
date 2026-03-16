import { reverseGeocodeAsync } from "expo-location";

// Simple in-memory cache to avoid redundant geocoding of the exact same coordinates
const geocodeCache = new Map<string, string>();

// A queue to hold pending geocoding requests to prevent hitting rate limits
type QueueItem = {
  latitude: number;
  longitude: number;
  resolve: (value: string) => void;
};
let queue: QueueItem[] = [];
let isProcessing = false;

/**
 * Gets a cached or queued reverse geocoded address to prevent hitting
 * "too many requests" rate limits from Google Maps / OS APIs.
 */
export const getGeocodedAddress = async (
  latitude: number,
  longitude: number,
): Promise<string> => {
  const cacheKey = `${latitude},${longitude}`;

  // If already cached, return immediately
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  // Otherwise, add to the queue
  return new Promise((resolve) => {
    queue.push({ latitude, longitude, resolve });
    if (!isProcessing) {
      processQueue();
    }
  });
};

const processQueue = async () => {
  if (queue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const item = queue.shift();

  if (item) {
    const { latitude, longitude, resolve } = item;
    const cacheKey = `${latitude},${longitude}`;

    // Double check cache in case a duplicate was queued before the first one finished
    if (geocodeCache.has(cacheKey)) {
      resolve(geocodeCache.get(cacheKey)!);
    } else {
      try {
        const addressData = await reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const formatted =
          addressData?.[0]?.formattedAddress ||
          addressData?.[0]?.city ||
          addressData?.[0]?.region ||
          "Unknown Location";

        geocodeCache.set(cacheKey, formatted);
        resolve(formatted);
      } catch (error) {
        console.warn("Geocoding rate limit or error:", error);
        // On error, return an empty string or generic message but don't hold up the queue
        resolve("");
      }
    }
  }

  // Add a 1 second delay between geocoding requests to avoid "Too Many Requests"
  setTimeout(() => {
    processQueue();
  }, 1000);
};
