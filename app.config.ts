import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    // Provide defaults for required fields if they are somehow missing from config
    name: config.name || 'TilikKota',
    slug: config.slug || 'tilikkota',
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          ...config.android?.config?.googleMaps,
          apiKey: process.env.GOOGLE_MAPS_API_KEY || "",
        },
      },
    },
  };
};
