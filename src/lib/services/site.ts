import { writable } from "svelte/store";
import { get } from "$lib/services/api";

const siteInitialState = {
    name: "",
    location: {
        address: "",
        city: "",
        zip: "",
        latitude: "",
        longitude: "",
    },
    taxRebate: {
        solarPanels: false,
		heatPump: false,
		electricHeating: false,
		noneOfTheAbove: true,
    },
    powerCompany: "",
};

export const siteFormData = writable(siteInitialState);

export function resetSiteFormData() {
    siteFormData.set(siteInitialState);
}

//
// Fetch power companies
//
export const powerCompanies = writable<{ value: string; label: string }[]>([]);

export async function fetchPowerCompanies() {
    try {
        // Type the API response as an object with string keys and string values
        const data = await get("/electricity/powernetcompanies", false) as Record<string, string>;
        // Transform the object into an array of { value, label } objects
        const formattedCompanies = Object.entries(data).map(([key, name]) => ({
            value: key,       // Integer key from backend (e.g., "3033")
            label: name       // Company name (e.g., "Nord Energi Net A/S")
        }));
        // Sort the array by the label property
        formattedCompanies.sort((a, b) => a.label.localeCompare(b.label));
        powerCompanies.set(formattedCompanies);
    } catch (err) {
        console.error((err as Error).message);
    }
}