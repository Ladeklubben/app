import { writable } from "svelte/store";
import { get } from "$lib/services/api";
import type { MeterData } from "$lib/types/meter.types";

const formatter = new Intl.NumberFormat("en-DK");

export const lastFetch = writable<string>("");
export const meterData = writable<MeterData | null>(null);

export async function fetchpowerImport() {
	try {
		const response = await get("/installation/mainmeter_tmp", true);
		meterData.set(response);
		const lastFetchDate = new Date();
		const lastFetchTime = lastFetchDate.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
		lastFetch.set(lastFetchTime);
	} catch (error) {
		console.error("Error fetching data:", error);
	}
}
