import { get, writable, type Writable } from "svelte/store";
import { device, Platform } from "$lib/services/layout";
import { type Position, type PermissionStatus, Geolocation } from "@capacitor/geolocation";

export const pos: Writable<Position | null> = writable(null);

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
                        latitude: 55.763246,
                        longitude: 12.47746,
                        accuracy: 0,
                        altitude: 0,
                        altitudeAccuracy: 0,
                        heading: 0,
                        speed: 0
                    },
                    timestamp: Date.now()
                };
                pos.set(pseudoPosition);
                resolve(pseudoPosition);
            }, 1000);
        });
    }
}

