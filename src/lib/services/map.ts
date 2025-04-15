import { get, writable, type Writable } from "svelte/store";
import { device, Platform } from "$lib/services/layout";
import { type Position, type PermissionStatus, Geolocation } from "@capacitor/geolocation";
import type { OpenHoursPeriod } from "$lib/types/chargers";

export const pos: Writable<Position | null> = writable(null);
export const selectedChargerID: Writable<string> = writable("");
export const MAP_TOKENS = writable({
	JAWG: import.meta.env.VITE_JAWG_ACCESS_TOKEN,
});

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
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

// Function to calculate opening hours
export function calculateOpeningHours(schedule: OpenHoursPeriod) {
	// TODO: Handle charger clsosed

	// Check if open 24/7 (10079 minutes = ~7 days)
	if (schedule.interval >= 10079) {
		return "Always Open";
	}
	return convertTimeString(schedule);
}

// Convert time values (in minutes) to formatted time string
function convertTimeString(scheduleObj: OpenHoursPeriod): string {
	// TODO: Handle multi-day intervals
	const start = scheduleObj.start;
	const stop = start + scheduleObj.interval;

	let startHour = Math.floor(start / 60);
	const startMinute = Math.floor(start - startHour * 60);

	let stopHour = Math.floor(stop / 60);
	const stopMinute = Math.floor(stop - stopHour * 60);

	if (stopHour > 24) stopHour = stopHour - 24;

	const formattedStartHour = String(startHour).padStart(2, "0");
	const formattedStartMinute = String(startMinute).padStart(2, "0");
	const formattedStopHour = String(stopHour).padStart(2, "0");
	const formattedStopMinute = String(stopMinute).padStart(2, "0");

	return `${formattedStartHour}:${formattedStartMinute} - ${formattedStopHour}:${formattedStopMinute}`;
}
