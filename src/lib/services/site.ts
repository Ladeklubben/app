import { writable } from "svelte/store";
import { get, post } from "$lib/services/api";
import { showError } from "./dialog.svelte";

const siteInitialState = {
	name: "",
	location: {
		address: "",
		city: "",
		zip: "",
	},
	taxRebate: {
		solarPanels: false,
		heatPump: false,
		electricHeating: false,
		noneOfTheAbove: true,
	},
	distributionCompany: 0,
};

export const siteFormData = writable(siteInitialState);

export function resetSiteFormData() {
	// Necessary to properly reset the form data
	const freshState = JSON.parse(JSON.stringify(siteInitialState));
	siteFormData.set(freshState);
}

export async function createNewSite(data: any) {
	try {
		await post("/site/new", data, true);
	} catch (err) {
		console.error((err as Error).message);
		showError("Error", "Failed to create new site. Please try again later or contact support.");
	}
}

//
// Fetch power companies
//
export const powerCompanies = writable<{ value: string; label: string }[]>([]);

export async function fetchPowerCompanies() {
	try {
		// Type the API response as an object with string keys and string values
		const data = (await get("/electricity/powernetcompanies", false)) as Record<string, string>;
		// Transform the object into an array of { value, label } objects
		const formattedCompanies = Object.entries(data).map(([key, name]) => ({
			value: key, // Integer key from backend (e.g., "3033")
			label: name, // Company name (e.g., "Nord Energi Net A/S")
		}));
		// Sort the array by the label property
		formattedCompanies.sort((a, b) => a.label.localeCompare(b.label));
		powerCompanies.set(formattedCompanies);
	} catch (err) {
		console.error((err as Error).message);
	}
}
