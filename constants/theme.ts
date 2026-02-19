/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#10a37f";
const tintColorDark = "#10a37f";

export const Colors = {
  light: {
    text: "#d1d5db",
    background: "#212121",
    tint: tintColorLight,
    icon: "#8e8ea0",
    tabIconDefault: "#8e8ea0",
    tabIconSelected: tintColorLight,
    card: "#2f2f2f",
    border: "rgba(255,255,255,0.08)",
    secondaryText: "#8e8ea0",
    surface: "#303030",
    accent: "#10a37f",
  },
  dark: {
    text: "#ececf1",
    background: "#171717",
    tint: tintColorDark,
    icon: "#8e8ea0",
    tabIconDefault: "#8e8ea0",
    tabIconSelected: tintColorDark,
    card: "#212121",
    border: "rgba(255,255,255,0.06)",
    secondaryText: "#8e8ea0",
    surface: "#2f2f2f",
    accent: "#10a37f",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
