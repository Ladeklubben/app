export interface ChargerAPIResponse {
	updatetime: number;
	upd: PublicCharger[];
}

export interface PublicCharger {
	stationid: string;
	prices: PriceInfo;
	location: LocationInfo;
	openhours: OpenHoursPeriod[];
	type: ChargerType;
	connector: ConnectorStatus;
	online?: [number, boolean]; // Timestamp and status
	qr: string;
	energyprices?: EnergyPrices;
}

export interface PriceInfo {
	nominal: number;
	minimum: number;
	fallback: number;
	valuta: string;
	follow_spot: number;
}

export interface LocationInfo {
	brief: string;
	address: string;
	city: string;
	zip: string;
	latitude: number;
	longitude: number;
}

export interface OpenHoursPeriod {
	days: number[]; // Days of week
	start: number; // Start minute of the day (0 = 00:00)
	interval: number; // Duration in minutes
}

export interface ChargerType {
	isSmart?: boolean;
	info?: Record<string, any>;
	model?: string;
	brand?: string;
	power?: string;
	connector?: string;
}

export type ConnectorStatus = "Available" | "SuspendedEV" | "Finishing" | "Preparing" | "Charging" | string;

export interface EnergyPrices {
	Costprice: number[];
	start: number; // Timestamp when prices start
}
