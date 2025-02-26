import { writable } from 'svelte/store';
import { get } from '$lib/services/api';

const formatter = new Intl.NumberFormat('en-DK');

export const powerImport = writable<string>('N/A');

export async function fetchpowerImport() {
    try {
        const response = await get('/installation/mainmeter_tmp', true);
        const totalPowerImport = Math.round(response.total_power_import * 1000);
        powerImport.set(formatter.format(totalPowerImport));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}