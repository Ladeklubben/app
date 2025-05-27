import { get } from "$lib/services/api";
import { Charger } from "./Charger.svelte";

/**
 * Class for managing a collection of Ladeklubben chargers
 */
export class Chargers {
    // Reactive map of chargers
    chargers = $state<Map<string, Charger>>(new Map());
    // Reactive selected charger
    selected = $state<Charger | null>(null);

    /**
     * Fetches the list of charger IDs from the server
     * @returns Promise<string[]> Array of charger IDs
     */
    async fetchChargerIds(): Promise<string[]> {
        try {
            const response = await get("/user/chargepoints");
            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error("Error fetching charger IDs:", error);
            throw error;
        }
    }

    /**
     * Initializes chargers with IDs from the server
     * @returns Promise<Charger[]> Array of initialized chargers
     */
    async initializeChargers(): Promise<Charger[]> {
        try {
            const chargerIds = await this.fetchChargerIds();
            this.chargers = new Map(); // Reset the reactive map
            this.selected = null; // Clear selection on initialization

            chargerIds.forEach((id) => {
                this.chargers.set(id, new Charger(id));
            });

            return this.getAllChargers();
        } catch (error) {
            console.error("Error initializing chargers:", error);
            throw error;
        }
    }

    /**
     * Returns a specific charger by ID
     * @param id Charger ID
     * @returns Charger or undefined if not found
     */
    getCharger(id: string): Charger | undefined {
        return this.chargers.get(id);
    }

    /**
     * Returns all managed chargers
     * @returns Array of Charger instances
     */
    getAllChargers(): Charger[] {
        return Array.from(this.chargers.values());
    }

    /**
     * Returns all valid chargers
     * @returns Array of valid Charger instances
     */
    getValidChargers(): Charger[] {
        return this.getAllChargers().filter((charger) => charger.valid);
    }

    /**
     * Loads basic data for all chargers
     * @returns Promise<void>
     */
    async loadAllChargersCardData(): Promise<void> {
        try {
            const promises = this.getAllChargers().map((charger) =>
                charger.getCardData().catch((error) => {
                    console.error(`Error loading card data for charger ${charger.id}:`, error);
                }),
            );
            await Promise.allSettled(promises);
        } catch (error) {
            console.error("Error loading all chargers card data:", error);
            throw error;
        }
    }

    /**
     * Loads complete data for all chargers
     * @returns Promise<void>
     */
    async loadAllChargersData(): Promise<void> {
        try {
            const promises = this.getAllChargers().map((charger) =>
                charger.getAllData().catch((error) => {
                    console.error(`Error loading data for charger ${charger.id}:`, error);
                }),
            );

            await Promise.allSettled(promises);
        } catch (error) {
            console.error("Error loading all chargers data:", error);
            throw error;
        }
    }

    /**
     * Selects a charger by ID
     * @param id Charger ID
     * @returns boolean indicating if selection was successful
     */
    selectCharger(id: string): boolean {
        const charger = this.chargers.get(id);
        if (charger) {
            this.selected = charger;
            return true;
        }
        return false;
    }

    /**
     * Clears the selected charger
     */
    clearSelectedCharger(): void {
        this.selected = null;
    }
}

// Reactive state for the Chargers instance
export const chargers = $state(new Chargers());