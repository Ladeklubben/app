import { writable } from "svelte/store";
import { Capacitor } from "@capacitor/core";

export enum Platform {
	Android = "android",
	IOS = "ios",
	Web = "web",
}

export const showTabBar = writable(true);
export const bottomButtonFixed = writable(false);
export const device = writable<Platform>(Platform.Web);

export function setDevice() {
	const platform = Capacitor.getPlatform() as Platform;
	device.set(platform);
}
