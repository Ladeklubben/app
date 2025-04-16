import type {
	ChargerStation as IChargerStation,
	PriceInfo,
	LocationInfo,
	OpenHoursPeriod,
	ChargerType,
	ConnectorStatus,
	EnergyPrices,
} from "$lib/types/chargers";
import { type Position } from "@capacitor/geolocation";
import { writable, type Writable } from "svelte/store";

export const selectedChargerID: Writable<string> = writable("");

export class ChargerStation implements IChargerStation {
	stationid: string;
	prices: PriceInfo;
	location: LocationInfo;
	openhours: OpenHoursPeriod[];
	type: ChargerType;
	connector: ConnectorStatus;
	online?: [number, boolean];
	qr: string;
	energyprices?: EnergyPrices;

	constructor(data: IChargerStation) {
		this.stationid = data.stationid;
		this.prices = data.prices;
		this.location = data.location;
		this.openhours = data.openhours;
		this.type = data.type;
		this.connector = data.connector;
		this.online = data.online;
		this.qr = data.qr;
		this.energyprices = data.energyprices;
	}

	get isAvailable(): boolean {
		return this.connector === "Available";
	}

	get city(): string {
		return this.location.city || "";
	}

	get currentPrice(): number {
		// Return the applicable price based on business logic
		// This is a simple implementation - extend as needed
		return this.prices.nominal;
	}

	distance(userPosition: Position): number {
		const R = 6371; // Earth's radius in km
		const dLat = ((this.location.latitude - userPosition.coords.latitude) * Math.PI) / 180;
		const dLon = ((this.location.longitude - userPosition.coords.longitude) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((userPosition.coords.latitude * Math.PI) / 180) *
				Math.cos((this.location.latitude * Math.PI) / 180) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	/**
	 * Opens Google Maps with directions to the charger station
	 */
	navigateToCharger() {
		// TODO: Handle other navigation methods (e.g., Apple Maps, Waze)
		const url = `https://www.google.com/maps/dir/?api=1&destination=${this.location.latitude},${this.location.longitude}`;
		window.open(url, "_blank");
	}

	/**
	 * Creates an array of ChargerStation instances from API data
	 */
	static fromApiResponse(data: IChargerStation[]): ChargerStation[] {
		return data.map((station) => new ChargerStation(station));
	}

	/**
	 * Calculate opening hours
	 */
	calculateOpeningHours() {
		// TODO: Handle charger clsosed
		const schedule = this.openhours[0]

		// Check if open 24/7 (10079 minutes = ~7 days)
		if (schedule.interval >= 10079) {
			return "Always Open";
		}
		return this.convertTimeString(schedule);
	}

	private convertTimeString(scheduleObj: OpenHoursPeriod): string {
		// TODO: Handle multi-day intervals
		const start = scheduleObj.start;
		const stop = start + scheduleObj.interval;

		let startHour = Math.floor(start / 60);
		const startMinute = Math.floor(start - startHour * 60);

		let stopHour = Math.floor(stop / 60);
		const stopMinute = Math.floor(stop - stopHour * 60);

		if (stopHour > 24) stopHour = stopHour - 24;

		const formattedStartHour = String(startHour).padStart(2, "0");
		const formattedStartMinute = String(startMinute).padStart(2, "0");
		const formattedStopHour = String(stopHour).padStart(2, "0");
		const formattedStopMinute = String(stopMinute).padStart(2, "0");

		return `${formattedStartHour}:${formattedStartMinute} - ${formattedStopHour}:${formattedStopMinute}`;
	}
}