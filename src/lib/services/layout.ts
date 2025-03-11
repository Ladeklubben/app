import { writable } from "svelte/store";
import { Capacitor } from "@capacitor/core";
import { TextZoom } from "@capacitor/text-zoom";

export const showTabBar = writable(true);
export const device = writable({
    isAndroid: false,
    isIOS: false,
    isWeb: false,
})

export function setDevice() {
    const platform = Capacitor.getPlatform();
    device.set({
        isAndroid: platform === "android",
        isIOS: platform === "ios",
        isWeb: platform === "web",
    });

    if (platform === "android") {
        TextZoom.set({ value: 0.75 });
    } else {
        TextZoom.set({ value: 1 });
    }

}
