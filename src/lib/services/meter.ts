import { writable } from 'svelte/store';
import { get } from '$lib/services/api';

const formatter = new Intl.NumberFormat('en-DK');

export const lastFetch = writable<string>('N/A');
export const powerImport = writable<string>('N/A');

export async function fetchpowerImport() {
    try {
        const response = await get('/installation/mainmeter_tmp', true);
        const lastFetchDate = new Date();
        const lastFetchTime = lastFetchDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        lastFetch.set(lastFetchTime);
        const totalPowerImport = Math.round(response.total_power_import * 1000);
        powerImport.set(formatter.format(totalPowerImport));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}