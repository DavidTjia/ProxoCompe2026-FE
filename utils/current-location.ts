import * as Location from "expo-location";

export async function withLocationRetry<T>(
  action: () => Promise<T>,
  retries = 3,
  delayMs = 1500
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((res) => setTimeout(res, delayMs));
    return withLocationRetry(action, retries - 1, delayMs);
  }
}

export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Location permission not granted");
  }

  // Use the retry wrapper specifically for the native location call
  const location = await withLocationRetry(() =>
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })
  );
  return location;
}

export async function reverseGeocode(latitude: number, longitude: number) {
  return await withLocationRetry(() =>
    Location.reverseGeocodeAsync({ latitude, longitude })
  );
}
