import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

// Define available icon sets
type IconSet = "material" | "material-community" | "ionicons" | "font-awesome";

// Mapping types for each icon set
type MaterialMapping = Record<
  string,
  ComponentProps<typeof MaterialIcons>["name"]
>;
type MaterialCommunityMapping = Record<
  string,
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;
type IoniconsMapping = Record<string, ComponentProps<typeof Ionicons>["name"]>;
type FontAwesomeMapping = Record<
  string,
  ComponentProps<typeof FontAwesome>["name"]
>;

// Union type for all icon names
type IconSymbolName =
  | keyof typeof MATERIAL_MAPPING
  | keyof typeof MATERIAL_COMMUNITY_MAPPING
  | keyof typeof IONICONS_MAPPING
  | keyof typeof FONT_AWESOME_MAPPING;

// Material Icons (default)
const MATERIAL_MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.left": "chevron-left",
  "chevron.right": "chevron-right",
  plus: "add",
  document: "text-snippet",
  bell: "notifications",
  "person.fill": "person",
  camera: "camera-alt",
  "photo.badge.plus": "add-a-photo",
  photo: "image",
  location: "location-on",
  sparkles: "auto-awesome",
  "x.circle.fill": "cancel",
  person: "person",
  "doc.text": "description",
  "arrow.up.right": "north-east",
  "star.fill": "star",
  "star.outline": "star-outline",
  "bubble.left": "chat-bubble-outline",
  mappin: "place",
  "chart.bar": "bar-chart",
  "arrow.right.square": "logout",
  checkmark: "save",
} as MaterialMapping;

// Material Community Icons
const MATERIAL_COMMUNITY_MAPPING = {
  "exclamationmark.circle": "alert-octagon-outline",
  "exclamationmark.triangle": "alert-outline",
  leaf: "leaf",
  plus: "plus-circle",
  pencil: "pencil",
} as MaterialCommunityMapping;

// Ionicons
const IONICONS_MAPPING = {
  plus: "add-circle",
} as IoniconsMapping;

// Font Awesome
const FONT_AWESOME_MAPPING = {
  plus: "plus-circle",
} as FontAwesomeMapping;

// Icon set mapping
const ICON_SETS = {
  material: {
    Component: MaterialIcons,
    mapping: MATERIAL_MAPPING,
  },
  "material-community": {
    Component: MaterialCommunityIcons,
    mapping: MATERIAL_COMMUNITY_MAPPING,
  },
  ionicons: {
    Component: Ionicons,
    mapping: IONICONS_MAPPING,
  },
  "font-awesome": {
    Component: FontAwesome,
    mapping: FONT_AWESOME_MAPPING,
  },
};

interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
  iconSet?: IconSet; // NEW: pilih icon library
}

/**
 * Multi-platform icon component supporting various icon libraries.
 * - iOS: SF Symbols (via expo-symbols jika tersedia)
 * - Android/Web: Material Icons, Material Community, Ionicons, Font Awesome
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  iconSet = "material", // default
}: IconSymbolProps) {
  const { Component, mapping } = ICON_SETS[iconSet];
  const iconName = mapping[name] || MATERIAL_MAPPING[name] || "help-outline";

  return (
    <Component color={color} size={size} name={iconName as any} style={style} />
  );
}
