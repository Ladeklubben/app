import { writable } from 'svelte/store';
import { get } from '$lib/services/api';

const formatter = new Intl.NumberFormat('en-DK');

export const energyImport = writable<string>('N/A');

export async function fetchEnergyImport() {
    try {
        const response = await get('/installation/mainmeter_tmp', true);
        const totalEnergyImport = Math.round(response.total_energy_import);
        energyImport.set(formatter.format(totalEnergyImport));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}