import { create } from "zustand";
import { getCurrentLocation, reverseGeocode } from "@/utils/current-location";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address: string;
  district: string | null;
  city: string | null;
  province: string | null;
}

interface LocationState {
  location: GeoLocation | null;
  status: "idle" | "loading" | "success" | "error";
  errorMessage: string | null;
  fetchLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  status: "idle",
  errorMessage: null,
  
  fetchLocation: async () => {
    set({ status: "loading", errorMessage: null });
    try {
      const position = await getCurrentLocation();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      const geocodeArray = await reverseGeocode(lat, lng);
      const geocode = geocodeArray?.[0];
      
      const address = geocode?.formattedAddress || "Location unavailable";
      const district = geocode?.district || null;
      // Many regions map the "Kabupaten/Kota" level to `subregion`, and some to `city`. We prefer subregion.
      const city = geocode?.subregion || geocode?.city || null;
      const province = geocode?.region || null;
      
      set({
        location: {
          latitude: lat,
          longitude: lng,
          address,
          district,
          city,
          province,
        },
        status: "success",
      });
    } catch (error: any) {
      set({ 
        status: "error", 
        errorMessage: error.message || "Failed to fetch location" 
      });
    }
  },
}));
