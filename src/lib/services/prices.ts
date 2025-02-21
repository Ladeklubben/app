// src/lib/stores/prices.ts
import { writable } from 'svelte/store';
import { get } from '$lib/services/api';
import type { PriceData } from '$lib/types/prices';

// Create writable store
export const prices = writable<PriceData[]>([]);
export const isLoading = writable<boolean>(false);
export const error = writable<string | null>(null);

// Fetch prices from API
export async function fetchPrices() {
    isLoading.set(true);
    error.set(null);
    try {
        const data = await get('/electricity/cost', false);
        prices.set(data.price_list);
    } catch (err) {
        error.set((err as Error).message);
    } finally {
        isLoading.set(false);
    }
}