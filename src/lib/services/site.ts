import { writable } from "svelte/store";

const siteInitialState = {
    name: "",
    location: {
        address: "",
        city: "",
        zip: "",
        latitude: "",
        longitude: "",
    },
    taxRebate: false,
    powerCompany: "",
};

export const siteFormData = writable(siteInitialState);

export function resetSiteFormData() {
    siteFormData.set(siteInitialState);
}