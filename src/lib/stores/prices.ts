// src/lib/stores/prices.ts
import { writable } from 'svelte/store';
import { fetch } from '@tauri-apps/plugin-http';

interface PriceData {
    Timestamp: number;
    EnergyTotal: number;
    Energyynet_price: number;
    Subscribtion_price: number;
    Distribution_price: number;
    EnergyTax: number;
    Spotprice: number;
    Energynet_tariff: number;
    Distribution_tariff: number;
    EnergyTax_tariff: number;
    Spotprice_tariff: number;
    Subscription_tariff: number;
    Costprice: number;
    Costprice_VAT: number;
}

export const prices = writable<PriceData[]>([]);
export const isLoading = writable<boolean>(false);
export const error = writable<string | null>(null);

export async function fetchPrices() {
    isLoading.set(true);
    error.set(null);

    try {
        const response = await fetch('https://restapi.ladeklubben.dk/electricity/cost');
        if (!response.ok) {
            throw new Error('Failed to fetch prices');
        }
        const data = await response.json();
        prices.set(data.price_list);
    } catch (err) {
        error.set(err.message);
    } finally {
        isLoading.set(false);
    }
}