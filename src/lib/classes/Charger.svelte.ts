import { get, post, patch, put, del } from "$lib/services/api";
import type { LocationInfo } from "$lib/types/publicCharger.types";
import CryptoJS from "crypto-js";
import type {
	ChargerStats,
	ChargerState,
	ChargerNumbers,
	NotificationSetup,
	NotificationSetupFormatted,
	SmartChargeSchedule,
	ElectricityPriceConstants,
	ElectricitySettlement,
	TaxReductionSettlement,
	TransactionList,
	ChargerTransactionInfo,
	ChargerTransactionPlot,
	ListPrice,
	ScheduleList,
	SingleSchedule,
	DisplaySchedule,
} from "$lib/types/charger.types";

/**
 * Class representing a single Ladeklubben charger with its associated data
 */
export class Charger {
	/** Unique identifier for the charger */
	id = $state("");
	/** Location information for the charger */
	locationInfo = $state<LocationInfo | undefined>();
	/** Statistics for the charger */
	chargerStats = $state<ChargerStats | undefined>();
	/** Indicates if the charger is valid and operational */
	valid = $state<boolean | undefined>();
	/** Current state of the charger */
	chargeState = $state<ChargerState | undefined>();
	/** Real-time measurement values for the charger */
	numbers = $state<ChargerNumbers | undefined>();
	/** Notification settings for the charger */
	notificationSetup = $state<NotificationSetup | undefined>();
	/** Formatted notification settings for the charger */
	notificationSetupFormatted = $state<NotificationSetupFormatted | undefined>();
	/** Smart charging schedule configuration */
	smartChargeSchedule = $state<SmartChargeSchedule | undefined>();
	/** Electricity pricing constants */
	electricityPriceConstants = $state<ElectricityPriceConstants | undefined>();
	/** Electricity settlement information */
	electricitySettlement = $state<ElectricitySettlement | undefined>();
	/** Tax reduction settlement information */
	taxReductionSettlement = $state<TaxReductionSettlement | undefined>();
	/** List of charging transactions */
	transactionsList = $state<TransactionList | undefined>();
	/** Information about charger transactions */
	transactionsInfo = $state<ChargerTransactionInfo | undefined>();
	/** Plot data for charger transactions */
	transactionsPlot = $state<ChargerTransactionPlot | undefined>();
	/** List price information for the charger */
	listPrice = $state<ListPrice | undefined>();
	/** Always on schedule for free charging */
	alwaysOnSchedule = $state<ScheduleList | undefined>();
	/** Rental schedule */
	rentalSchedule = $state<ScheduleList | undefined>();

	/**
	 * Creates a new Charger instance
	 * @param id The unique identifier for the charger
	 */
	constructor(id: string) {
		this.id = id;
	}

	/**
	 * Fetches basic data for this charger
	 * @returns Promise<void>
	 */
	async getCardData(): Promise<void> {
		try {
			await Promise.allSettled([this.getChargeState(), this.getInfo(), this.getNumbers()]);
		} catch (error) {
			console.error("Error getting card data:", error);
			throw error;
		}
	}

	/**
	 * Fetches all data for this charger from various endpoints
	 * @returns Promise<void>
	 */
	async getAllData(): Promise<void> {
		try {
			await Promise.allSettled([
				this.getInfo(),
				this.getStats(),
				this.getValidity(),
				this.getChargeState(),
				this.getNumbers(),
				this.getNotificationSetup(),
				this.getSmartChargeSchedule(),
				this.getElectricityPriceConstants(),
				this.getElectricitySettlement(),
				this.getTaxReductionSettlement(),
				this.getTransactionsList(),
				this.getTransactionsInfo(),
				this.getTransactionsPlot(),
				this.getListPrice(),
				this.getAlwaysOnSchedule(),
				this.getRentalSchedule(),
			]);
		} catch (error) {
			console.error("Error getting all data:", error);
			throw error;
		}
	}

	/**
	 * Fetches location information for the charger
	 * @returns Promise with the charger's location info
	 */
	async getInfo(): Promise<LocationInfo | undefined> {
		try {
			const response = await get(`/cp/${this.id}/info`);
			this.locationInfo = response;
			return this.locationInfo;
		} catch (error) {
			console.error("Error getting charger info:", error);
			throw error;
		}
	}

	/**
	 * Fetches usage statistics for the charger
	 * @returns Promise with the charger's stats
	 */
	async getStats(): Promise<ChargerStats | undefined> {
		try {
			const response = await get(`/cp/${this.id}/stats`);
			this.chargerStats = response;
			return this.chargerStats;
		} catch (error) {
			console.error("Error getting charger stats:", error);
			throw error;
		}
	}

	/**
	 * Fetches the validity status of the charger
	 * @returns Promise with the charger's validity status
	 */
	async getValidity(): Promise<boolean | undefined> {
		try {
			const response = await get(`/cp/${this.id}/valid`);
			this.valid = response.is_valid;
			return this.valid;
		} catch (error) {
			console.error("Error getting charger validity:", error);
			throw error;
		}
	}

	/**
	 * Fetches the current state of the charger
	 * @returns Promise with the charger's current state
	 */
	async getChargeState(): Promise<ChargerState | undefined> {
		try {
			const response = await get(`/cp/${this.id}/chargestate`);
			this.chargeState = response;
			return this.chargeState;
		} catch (error) {
			console.error("Error getting charger state:", error);
			throw error;
		}
	}

	/**
	 * Fetches real-time measurement values for the charger
	 * @returns Promise with the charger's measurement values
	 */
	async getNumbers(): Promise<ChargerNumbers | undefined> {
		try {
			const response = await get(`/cp/${this.id}/chargernumbers`);
			this.numbers = response;
			return this.numbers;
		} catch (error) {
			console.error("Error getting charger numbers:", error);
			throw error;
		}
	}

	/**
	 * Fetches notification settings for the charger
	 * @returns Promise with the charger's notification setup
	 */
	async getNotificationSetup(): Promise<NotificationSetup | undefined> {
		try {
			const response = await get(`/cp/${this.id}/notification_setup`);
			this.notificationSetup = response;
			this.notificationSetupFormatted = this.getFormattedNotificationSetup();
			return this.notificationSetup;
		} catch (error) {
			console.error("Error getting notification setup:", error);
			throw error;
		}
	}

	/**
	 * Fetches smart charging schedule for the charger
	 * @returns Promise with the charger's smart charging schedule
	 */
	async getSmartChargeSchedule(): Promise<SmartChargeSchedule | undefined> {
		try {
			const response = await get(`/cp/${this.id}/smart`);
			this.smartChargeSchedule = response;
			return this.smartChargeSchedule;
		} catch (error) {
			console.error("Error getting smart charge schedule:", error);
			throw error;
		}
	}

	/**
	 * Updates the public status of the charger
	 * @param enabled Whether to enable or disable public access
	 * @returns Promise indicating success or failure
	 */
	async putPublicCharger(enabled: boolean): Promise<boolean> {
		try {
			await put(`/cp/${this.id}/public?enable=${enabled}`);

			// Update local state if chargeState is available
			if (this.chargeState) {
				this.chargeState.public = enabled;
			}

			// Return true to indicate charger is possible to be public
			return true;
		} catch (error: any) {
			if (error.cause === 403) {
				console.error("This kind og charger cannot be made public");
				return false;
			}
			console.error("Error updating charger public status:", error);
			throw error;
		}
	}

	/**
	 * Updates the smart charging schedule for the charger
	 * @param data SmartChargeSchedule object with new settings
	 * @returns Promise<void>
	 */
	async putSmartChargeSchedule(data: SmartChargeSchedule): Promise<void> {
		try {
			console.log("Updating smart charge schedule:", data);
			const querystring = data.enabled ? "?enable=1" : "";
			await put(`/cp/${this.id}/smart${querystring}`, data);
			this.smartChargeSchedule = data;
		} catch (error) {
			console.error("Error updating smart charge schedule:", error);
			throw error;
		}
	}

	/**
	 * Fetches electricity price constants for the charger
	 * @returns Promise with the charger's electricity price constants
	 */
	async getElectricityPriceConstants(): Promise<ElectricityPriceConstants | undefined> {
		try {
			const response = await get(`/cp/${this.id}/electricitypriceconstants`);
			this.electricityPriceConstants = response;
			return this.electricityPriceConstants;
		} catch (error) {
			console.error("Error getting electricity price constants:", error);
			throw error;
		}
	}

	/**
	 * Fetches electricity settlement information for the charger
	 * @returns Promise with the charger's electricity settlement data
	 */
	async getElectricitySettlement(): Promise<ElectricitySettlement | undefined> {
		try {
			const response = await get(`/cp/${this.id}/electricitysettlement`);
			this.electricitySettlement = response;
			return this.electricitySettlement;
		} catch (error) {
			console.error("Error getting electricity settlement:", error);
			throw error;
		}
	}

	/**
	 * Fetches tax reduction settlement information for the charger
	 * @returns Promise with the charger's tax reduction settlement data
	 */
	async getTaxReductionSettlement(): Promise<TaxReductionSettlement | undefined> {
		try {
			const response = await get(`/cp/${this.id}/taxreductionsettlement`);
			this.taxReductionSettlement = response;
			return this.taxReductionSettlement;
		} catch (error) {
			console.error("Error getting tax reduction settlement:", error);
			throw error;
		}
	}

	/**
	 * Fetches the list of transactions for the charger
	 * @returns Promise with the charger's transaction list
	 */
	async getTransactionsList(): Promise<TransactionList | undefined> {
		try {
			const response = await get(`/ta/${this.id}/list`);
			this.transactionsList = response;
			return this.transactionsList;
		} catch (error) {
			console.error("Error getting transactions list:", error);
			throw error;
		}
	}

	/**
	 * Fetches transaction information for the charger
	 * @returns Promise with the charger's transaction information
	 */
	async getTransactionsInfo(): Promise<ChargerTransactionInfo | undefined> {
		try {
			const response = await get(`/ta/${this.id}/info`);
			this.transactionsInfo = response;
			return this.transactionsInfo;
		} catch (error) {
			console.error("Error getting transactions info:", error);
			throw error;
		}
	}

	/**
	 * Fetches transaction plot data for the charger
	 * @returns Promise with the charger's transaction plot data
	 */
	async getTransactionsPlot(): Promise<ChargerTransactionPlot | undefined> {
		try {
			const response = await get(`/ta/${this.id}/plot`);
			this.transactionsPlot = response;
			return this.transactionsPlot;
		} catch (error) {
			console.error("Error getting transactions plot:", error);
			throw error;
		}
	}

	/**
	 * Updates the location information for the charger
	 * @param data LocationInfo object with new settings
	 * @returns Promise<void>
	 */
	async putLocationInfo(data: LocationInfo): Promise<void> {
		try {
			// Using /info instead of /location, since I was getting CORS errors
			await put(`/cp/${this.id}/info`, { location: data }); 
			this.locationInfo = data;
			console.log("Location info updated successfully:", data);
		} catch (error) {
			console.error("Error updating location info:", error);
			throw error;
		}
	}

	/**
	 * Converts the raw notification setup to a more user-friendly format
	 * @returns Formatted notification settings
	 */
	getFormattedNotificationSetup(): NotificationSetupFormatted {
		if (!this.notificationSetup) {
			return [];
		}

		// Get unique email addresses from both notification types
		const emails = new Set<string>();

		if (Array.isArray(this.notificationSetup.onBegin)) {
			this.notificationSetup.onBegin.forEach(([email]) => emails.add(email));
		}

		if (Array.isArray(this.notificationSetup.onEnd)) {
			this.notificationSetup.onEnd.forEach(([email]) => emails.add(email));
		}

		// Create formatted notification setup
		return Array.from(emails).map((email) => {
			// Find if this email has onBegin notifications enabled
			const onBeginSetting = this.notificationSetup?.onBegin?.find(([e]) => e === email);
			const onBeginEnabled = onBeginSetting ? onBeginSetting[1] === 1 : false;

			// Find if this email has onEnd notifications enabled
			const onEndSetting = this.notificationSetup?.onEnd?.find(([e]) => e === email);
			const onEndEnabled = onEndSetting ? onEndSetting[1] === 1 : false;

			return {
				email,
				onBeginEnabled,
				onEndEnabled,
			};
		});
	}

	/**
	 * Add or update notification settings for a specific email
	 * @param email Email address to add or update
	 * @param onBeginEnabled Whether to enable notifications for charging begin
	 * @param onEndEnabled Whether to enable notifications for charging end
	 * @returns Promise<void>
	 */
	async addOrUpdateNotification(email: string, onBeginEnabled: boolean, onEndEnabled: boolean): Promise<void> {
		// Store original data for rollback if needed
		const originalSetup = this.notificationSetup;
		const originalFormatted = this.notificationSetupFormatted;
		// Optimistically update UI immediately
		this.notificationSetupFormatted = this.notificationSetupFormatted?.map((item) => {
			if (item.email === email) {
				return {
					...item,
					onBeginEnabled,
					onEndEnabled,
				};
			}
			return item;
		});
		this.notificationSetupFormatted = [
			...(this.notificationSetupFormatted?.filter((i) => i.email !== email) ?? []),
			{ email, onBeginEnabled, onEndEnabled },
		];
		try {
			// Perform actual update operations
			await Promise.all([
				put(`/cp/${this.id}/notification_setup`, {
					email,
					eventType: "onBegin",
					enabled: onBeginEnabled ? true : false,
				}),
				put(`/cp/${this.id}/notification_setup`, {
					email,
					eventType: "onEnd",
					enabled: onEndEnabled ? true : false,
				}),
			]);
		} catch (error) {
			// Restore original data on any error
			this.notificationSetup = originalSetup;
			this.notificationSetupFormatted = originalFormatted;
			console.error("Error updating notification setup:", error);
			throw error;
		}
	}

	/**
	 * Deletes notification settings for a specific email
	 * @param email Email address to delete notifications for
	 * @returns Promise<void>
	 */
	async deleteNotification(email: string): Promise<void> {
		// Store original data for rollback if needed
		const originalSetup = this.notificationSetup;
		const originalFormatted = this.notificationSetupFormatted;

		// Optimistically update UI immediately
		this.notificationSetupFormatted = this.notificationSetupFormatted?.filter((item) => item.email !== email);

		try {
			// Perform actual delete operations
			await Promise.all([
				del(`/cp/${this.id}/notification_setup`, {
					email,
					eventType: "onBegin",
					enabled: 0,
				}),
				del(`/cp/${this.id}/notification_setup`, {
					email,
					eventType: "onEnd",
					enabled: 0,
				}),
			]);
		} catch (error) {
			// Restore original data on any error
			this.notificationSetup = originalSetup;
			this.notificationSetupFormatted = originalFormatted;
			console.error("Error deleting notification setup:", error);
			throw error;
		}
	}

	/**
	 * Fetches the list price for the charger
	 * @returns Promise with the charger's list price
	 */
	async getListPrice(): Promise<ListPrice | undefined> {
		try {
			const response = await get(`/listprice/${this.id}`);
			this.listPrice = response;
			return this.listPrice;
		} catch (error) {
			console.error("Error getting list price:", error);
			throw error;
		}
	}

	/**
	 * Updates the list price for the charger
	 * @param data ListPrice object with new settings
	 * @returns Promise<void>
	 */
	async putListPrice(data: ListPrice): Promise<void> {
		try {
			await put(`/listprice/${this.id}`, data);
			this.listPrice = data;
		} catch (error) {
			console.error("Error updating list price:", error);
			throw error;
		}
	}

	/**
	 * Converts the list price based on VAT inclusion
	 * @param listPrice The original list price object
	 * @param addVAT Whether to add VAT or remove it
	 * @returns Converted list price object
	 */
	convertListPrice(listPrice: ListPrice, addVAT: boolean): ListPrice {
		const convertedListPrice: ListPrice = {
			...listPrice,
			nominal: Math.round(listPrice.nominal * (addVAT ? 1.25 : 0.8) * 100) / 100, // Round to 2 decimal places
			minimum: Math.round(listPrice.minimum * (addVAT ? 1.25 : 0.8) * 100) / 100,
			fallback: Math.round(listPrice.fallback * (addVAT ? 1.25 : 0.8) * 100) / 100,
		};

		return convertedListPrice;
	}

	/**
	 * Generic method to fetch a schedule by type
	 * @param scheduleType The type of schedule ('alwayson' or 'openhours')
	 * @returns Promise with the schedule data
	 */
	private async getSchedule(scheduleType: "alwayson" | "openhours"): Promise<ScheduleList | undefined> {
		try {
			const response = await get(`/schedule/${this.id}/${scheduleType}`);
			return response;
		} catch (error) {
			console.error(`Error getting ${scheduleType} schedule:`, error);
			throw error;
		}
	}

	/**
	 * Generic method to add a schedule
	 * @param scheduleType The type of schedule ('alwayson' or 'openhours')
	 * @param data SingleSchedule object with new settings
	 * @returns Promise<void>
	 */
	private async addSchedule(scheduleType: "alwayson" | "openhours", data: SingleSchedule): Promise<void> {
		try {
			await patch(`/schedule/${this.id}/${scheduleType}`, data);
		} catch (error) {
			console.error(`Error adding ${scheduleType} schedule:`, error);
			throw error;
		}
	}

	/**
	 * Generic method to update a schedule
	 * @param scheduleType The type of schedule ('alwayson' or 'openhours')
	 * @param schedule_new SingleSchedule object with new settings
	 * @param schedule_org SingleSchedule object with original settings
	 * @returns Promise<void>
	 */
	private async updateSchedule(
		scheduleType: "alwayson" | "openhours",
		schedule_new: SingleSchedule,
		schedule_org: SingleSchedule,
	): Promise<void> {
		try {
			const data = {
				schedule_new: schedule_new,
				schedule_org: schedule_org,
			};
			await put(`/schedule/${this.id}/${scheduleType}`, data);
		} catch (error) {
			console.error(`Error updating ${scheduleType} schedule:`, error);
			throw error;
		}
	}

	/**
	 * Generic method to delete a schedule
	 * @param scheduleType The type of schedule ('alwayson' or 'openhours')
	 * @param data SingleSchedule object with the schedule to delete
	 * @returns Promise<void>
	 */
	private async deleteSchedule(scheduleType: "alwayson" | "openhours", data: SingleSchedule): Promise<void> {
		try {
			await put(`/schedule/${this.id}/${scheduleType}/rm`, data);
		} catch (error) {
			console.error(`Error deleting ${scheduleType} schedule:`, error);
			throw error;
		}
	}

	/**
	 * Fetches the always on schedule for free charging
	 * @returns Promise with the always on schedule data
	 * */
	async getAlwaysOnSchedule(): Promise<ScheduleList | undefined> {
		this.alwaysOnSchedule = await this.getSchedule("alwayson");
		return this.alwaysOnSchedule;
	}

	/**
	 * Adds a new always on schedule for free charging
	 * @param data SingleSchedule object with new settings
	 * @returns Promise<void>
	 */
	async addAlwaysOnSchedule(data: SingleSchedule): Promise<void> {
		await this.addSchedule("alwayson", data);
		if (!this.alwaysOnSchedule) {
			this.alwaysOnSchedule = [];
		}
		this.alwaysOnSchedule = [...this.alwaysOnSchedule, data];
	}

	/**
	 * Updates an existing always on schedule for free charging
	 * @param schedule_new SingleSchedule object with new settings
	 * @param schedule_org SingleSchedule object with original settings
	 * @returns Promise<void>
	 */
	async updateAlwaysOnSchedule(schedule_new: SingleSchedule, schedule_org: SingleSchedule): Promise<void> {
		await this.updateSchedule("alwayson", schedule_new, schedule_org);
	}

	/**
	 * Deletes an existing always on schedule for free charging
	 * @param data SingleSchedule object with the schedule to delete
	 * @returns Promise<void>
	 */
	async deleteAlwaysOnSchedule(data: SingleSchedule): Promise<void> {
		await this.deleteSchedule("alwayson", data);
		if (this.alwaysOnSchedule) {
			this.alwaysOnSchedule = this.alwaysOnSchedule.filter(
				(schedule) => schedule.start !== data.start || schedule.interval !== data.interval,
			);
		}
	}

	/**
	 * Fetches the rental schedule for the charger
	 * @returns Promise with the rental schedule data
	 */
	async getRentalSchedule(): Promise<ScheduleList | undefined> {
		this.rentalSchedule = await this.getSchedule("openhours");
		return this.rentalSchedule;
	}

	/**
	 * Adds a new rental schedule for the charger
	 * @param data SingleSchedule object with new settings
	 * @returns Promise<void>
	 */
	async addRentalSchedule(data: SingleSchedule): Promise<void> {
		await this.addSchedule("openhours", data);
		if (!this.rentalSchedule) {
			this.rentalSchedule = [];
		}
		this.rentalSchedule = [...this.rentalSchedule, data];
	}

	/**
	 * Updates an existing rental schedule for the charger
	 * @param schedule_new SingleSchedule object with new settings
	 * @param schedule_org SingleSchedule object with original settings
	 * @returns Promise<void>
	 */
	async updateRentalSchedule(schedule_new: SingleSchedule, schedule_org: SingleSchedule): Promise<void> {
		await this.updateSchedule("openhours", schedule_new, schedule_org);
	}

	/**
	 * Deletes an existing rental schedule for the charger
	 * @param data SingleSchedule object with the schedule to delete
	 * @returns Promise<void>
	 */
	async deleteRentalSchedule(data: SingleSchedule): Promise<void> {
		await this.deleteSchedule("openhours", data);
		if (this.rentalSchedule) {
			this.rentalSchedule = this.rentalSchedule.filter(
				(schedule) => schedule.start !== data.start || schedule.interval !== data.interval,
			);
		}
	}

	/**
	 * Converts time string (HH:MM) to minutes from midnight
	 */
	static timeStringToMinutes(timeString: string): number {
		if (!timeString) return 0;
		const [hours, minutes] = timeString.split(":").map(Number);
		return hours * 60 + minutes;
	}

	/**
	 * Converts minutes from midnight to time string (HH:MM)
	 */
	static minutesToTimeString(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
	}

	/**
	 * Converts ScheduleList data to display format
	 */
	static convertScheduleDataToDisplayData(scheduleData: ScheduleList): DisplaySchedule[] {
		return scheduleData.map((schedule) => ({
			id: CryptoJS.MD5(JSON.stringify(schedule)).toString(),
			days: schedule.days,
			startTime: Charger.minutesToTimeString(schedule.start),
			endTime: Charger.minutesToTimeString(schedule.start + schedule.interval),
			expanded: false,
			savedToServer: true,
		}));
	}

	/**
	 * Converts display data back to schedule format
	 */
	static convertDisplayDataToScheduleData(displayData: DisplaySchedule[]): ScheduleList {
		return displayData.map((schedule) => ({
			days: schedule.days,
			start: Charger.timeStringToMinutes(schedule.startTime),
			interval: Charger.timeStringToMinutes(schedule.endTime) - Charger.timeStringToMinutes(schedule.startTime),
		}));
	}

	/**
	 * Validates if a time range is valid (end time after start time)
	 */
	static isValidTimeRange(startTime: string, endTime: string): boolean {
		const start = Charger.timeStringToMinutes(startTime);
		const end = Charger.timeStringToMinutes(endTime);
		return end > start;
	}

	/**
	 * Checks for schedule conflicts with existing schedules
	 */
	static hasConflicts(
		scheduleId: string,
		days: number[],
		startTime: string,
		endTime: string,
		existingSchedules: DisplaySchedule[],
	): boolean {
		const start = Charger.timeStringToMinutes(startTime);
		const end = Charger.timeStringToMinutes(endTime);

		return existingSchedules.some((schedule) => {
			if (schedule.id === scheduleId) return false;

			const otherStart = Charger.timeStringToMinutes(schedule.startTime);
			const otherEnd = Charger.timeStringToMinutes(schedule.endTime);

			// Check if any days overlap
			const daysOverlap = days.some((day) => schedule.days.includes(day));
			if (!daysOverlap) return false;

			// Check if times overlap
			return start < otherEnd && end > otherStart;
		});
	}

	/**
	 * Checks if a schedule is valid (no conflicts and valid time range)
	 */
	static isScheduleValid(schedule: DisplaySchedule, existingSchedules: DisplaySchedule[]): boolean {
		return (
			schedule.days.length > 0 &&
			Charger.isValidTimeRange(schedule.startTime, schedule.endTime) &&
			!Charger.hasConflicts(schedule.id, schedule.days, schedule.startTime, schedule.endTime, existingSchedules)
		);
	}

	/**
	 * Formats days array for display
	 */
	static formatDaysDisplay(days: number[]): string {
		const dayAbbreviations = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

		if (days.length === 0) return "No days";
		if (days.length === 7) return "Every day";

		// Check for weekdays (0 - 4)
		const weekdays = [0, 1, 2, 3, 4];
		const isWeekdays = weekdays.every((day) => days.includes(day)) && days.length === 5;
		if (isWeekdays) return "Weekdays";

		// Check for weekend (5 - 6)
		const weekend = [5, 6];
		const isWeekend = weekend.every((day) => days.includes(day)) && days.length === 2;
		if (isWeekend) return "Weekend";

		// Otherwise, show abbreviated day names
		return days.map((day) => dayAbbreviations[day]).join(", ");
	}
}
