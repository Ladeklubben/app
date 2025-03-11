import { writable } from "svelte/store";
import { Capacitor } from "@capacitor/core";
import { TextZoom } from "@capacitor/text-zoom";

export enum Platform {
  Android = "android",
  IOS = "ios",
  Web = "web"
}

export const showTabBar = writable(true);
export const device = writable<Platform>(Platform.Web); // Default to web

export function setDevice() {
  const platform = Capacitor.getPlatform() as Platform;
  device.set(platform);

  switch (platform) {
    case Platform.Android:
      TextZoom.set({ value: 0.75 });
      break;
    case Platform.IOS:
      TextZoom.set({ value: 1 });
      break;
    case Platform.Web:
      // Web-specific settings if needed
      break;
  }
}