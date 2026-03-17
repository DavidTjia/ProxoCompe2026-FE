import * as ImagePicker from "expo-image-picker";

export const openCamera =
  async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return null;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      return result.assets[0];
    }

    return null;
  };

export const openGallery =
  async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      return result.assets[0];
    }

    return null;
  };
