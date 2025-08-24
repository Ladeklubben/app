import type {
	IPublicCharger,
	PriceInfo,
	LocationInfo,
	OpenHoursPeriod,
	ChargerType,
	ConnectorStatus,
	EnergyPrices,
	Reservation,
	MemberPriceSetup,
} from "$lib/types/publicCharger.types";
import { getMemberPriceSetup } from "$lib/services/memberPricing.svelte";
import { type Position } from "@capacitor/geolocation";
import { put } from "$lib/services/api";
import { showError, showWarning } from "$lib/services/dialog.svelte";
import { goto } from "$app/navigation";

class SelectedCharger {
	charger: PublicCharger | null = $state(null);

	setCharger(charger: PublicCharger) {
		this.charger = charger;
	}

	clearCharger() {
		this.charger = null;
	}
}

export const selectedCharger = $state(new SelectedCharger());

export class PublicCharger implements IPublicCharger {
	stationid: string;
	prices: PriceInfo;
	calculatedprice?: number;
	location: LocationInfo;
	openhours: OpenHoursPeriod[];
	type: ChargerType;
	connector: ConnectorStatus;
	online?: [number, boolean];
	qr: string;
	energyprices?: EnergyPrices;
	memberPrice?: MemberPriceSetup;
	reservation = $state<Reservation>({
		reserved: false,
		claimTimeout: 0,
		timer: null,
	});

	// Private properties
	private lktarif: number = 1.1; // 10% service fee
	private VAT: number = 1.25; // 25% VAT

	constructor(data: IPublicCharger) {
		this.stationid = data.stationid;
		this.prices = data.prices;
		this.location = data.location;
		this.openhours = data.openhours;
		this.type = data.type;
		this.connector = data.connector;
		this.online = data.online;
		this.qr = data.qr;
		this.energyprices = data.energyprices;

		// Automatically set member pricing for this station
		this.memberPrice = getMemberPriceSetup(this.stationid);
	}

	get isAvailable(): boolean {
		return this.connector === "Available";
	}

	get city(): string {
		return this.location.city || "";
	}

	get currentPrice(): string {
		// Check for member pricing first
		if (this.memberPrice) {
			if (this.memberPrice.flat || this.memberPrice.free) {
				return "0.00";
			}
		}

		let price: number = this.prices.nominal;
		let discount = 0;

		// Apply member discount if available
		if (this.memberPrice && this.memberPrice.tariff_pct > 0) {
			price = this.prices.nominal * (1 - this.memberPrice.tariff_pct / 100);
			discount = this.prices.nominal - price;
		}

		// Apply minimum price check (after member discount, before tariff/VAT)
		price = price < this.prices.minimum ? this.prices.minimum : price;

		// Handle spot price following
		if (this.prices.follow_spot === 1) {
			if (this.energyprices && this.energyprices.Costprice) {
				price += this.energyprices.Costprice[0] / 100;
				price -= discount; // Subtract discount from energy price calculation
				price *= this.lktarif;
				price *= this.VAT;
			} else {
				price = this.prices.fallback;
				price -= discount; // Subtract discount from fallback price calculation
				price *= this.lktarif;
				price *= this.VAT;
			}
		} else {
			price *= this.lktarif;
			price *= this.VAT;
		}

		return price.toFixed(2);
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
	 * Creates an array of PublicCharger instances from API data
	 */
	static fromApiResponse(data: IPublicCharger[]): PublicCharger[] {
		return data.map((station) => new PublicCharger(station));
	}

	/**
	 * Sets member pricing for this charger
	 */
	setMemberPrice(memberPrice: MemberPriceSetup) {
		this.memberPrice = memberPrice;
	}

	/**
	 * Creates a default member price setup (no discounts)
	 */
	static getDefaultMemberPrice(): MemberPriceSetup {
		return {
			tariff_pct: 0,
			discount_tariff: 0,
			flat: false,
			free: false,
		};
	}

	/**
	 * Refreshes member pricing for this charger (useful when user info changes)
	 */
	refreshMemberPricing() {
		this.memberPrice = getMemberPriceSetup(this.stationid);
	}

	/**
	 * Refreshes member pricing for an array of chargers
	 */
	static refreshMemberPricingForAll(chargers: PublicCharger[]) {
		chargers.forEach(charger => charger.refreshMemberPricing());
	}

	/**
	 * Calculate opening hours
	 */
	calculateOpeningHours() {
		// TODO: Handle charger clsosed
		if (!this.openhours || this.openhours.length === 0) {
			return "Unknown";
		}
		const schedule = this.openhours[0];

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

	async reserveCharger() {
		// Claim this charger by sending a PUT request to /cp/{stationid}/claim
		try {
			const response = await put(`/cp/${this.stationid}/claim`, "");

			if (response.claimTimeout) {
				this.reservation.claimTimeout = response.claimTimeout;

				console.info("Claimed for " + response.claimTimeout + " seconds");

				if (this.reservation.timer) {
					clearInterval(this.reservation.timer);
				}

				this.reservation.reserved = true;

				// Start a countdown timer
				this.reservation.timer = setInterval(() => {
					this.reservation.claimTimeout--;
					this.startCharge(false);
					if (this.reservation.claimTimeout <= 0) {
						this.clearReservation();
					}
				}, 1000);
			} else {
				showError("Failed to claim charger.");
				throw new Error("Failed to claim charger");
			}

		} catch (error) {
			console.error("Failed to claim charger:", error);
			// Optionally, handle error (e.g., show user feedback)
		}
	}

	/**
	 * Clears the current reservation for this charger.
	 * - Stops and removes the countdown timer if it exists.
	 * - Sets the reservation status to not reserved.
	 * - Resets the claim timeout to 0.
	 */
	clearReservation() {
		if (this.reservation.timer) {
			clearInterval(this.reservation.timer);
			this.reservation.timer = null;
			this.reservation.reserved = false;
			this.reservation.claimTimeout = 0;
		}
	}

	async startCharge(showErrorOnFail: boolean = false) {
		this.clearReservation();
		selectedCharger.setCharger(this);
		goto("/charging");
		// let response: any;
		// try {
		// 	response = await put(`/cp/${this.stationid}/startcharge`, "");
		// 	console.info("Start charge response:", response);
		// } catch (error) {
		// 	if (showErrorOnFail) {
		// 		showWarning("Could not start charging", "Please make sure the car is connected to the charger.");
		// 	}
		// }
	}

	stopCharge() {
		console.log("Stopping charge");
		selectedCharger.clearCharger();
	}
}