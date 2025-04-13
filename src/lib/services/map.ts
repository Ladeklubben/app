import { get, writable, type Writable } from "svelte/store";
import { device, Platform } from "$lib/services/layout";
import { type Position, type PermissionStatus, Geolocation } from "@capacitor/geolocation";

export const pos: Writable<Position | null> = writable(null);
export const selectedChargerID: Writable<string> = writable("");

export async function getPosition() {
	const deviceVal: Platform = get(device);

	// For native platforms
	if (deviceVal !== Platform.Web) {
		try {
			const status: PermissionStatus = await Geolocation.requestPermissions();
			if (status.location === "granted") {
				const position: Position = await Geolocation.getCurrentPosition({
					timeout: 10000,
				});
				pos.set(position);
				return position;
			} else {
				console.warn("Location permission denied");
				return null;
			}
		} catch (error) {
			console.error("Failed to get position:", error instanceof Error ? error.message : String(error));
			return null;
		}
	} else {
		// For web platform
		return new Promise<Position>((resolve) => {
			setTimeout(() => {
				const pseudoPosition: Position = {
					coords: {
						latitude: 54.951718,
						longitude: 9.896465,
						accuracy: 0,
						altitude: 0,
						altitudeAccuracy: 0,
						heading: 0,
						speed: 0,
					},
					timestamp: Date.now(),
				};
				pos.set(pseudoPosition);
				resolve(pseudoPosition);
			}, 1000);
		});
	}
}

// Utility function for distance calculations
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}