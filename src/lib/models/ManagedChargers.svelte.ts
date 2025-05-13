import { get, post, put, del } from "$lib/services/api";
import type { LocationInfo } from "$lib/types/charger.types";

/**
 * Class for managing a collection of Ladeklubben chargers
 */
export class ManagedChargers {
	// Reactive map of chargers
	chargers = $state<Map<string, ManagedCharger>>(new Map());
	// Reactive selected charger
	selectedCharger = $state<ManagedCharger | null>(null);

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
	 * @returns Promise<ManagedCharger[]> Array of initialized chargers
	 */
	async initializeChargers(): Promise<ManagedCharger[]> {
		try {
			const chargerIds = await this.fetchChargerIds();
			this.chargers = new Map(); // Reset the reactive map
			this.selectedCharger = null; // Clear selection on initialization

			chargerIds.forEach((id) => {
				this.chargers.set(id, new ManagedCharger(id));
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
	 * @returns ManagedCharger or undefined if not found
	 */
	getCharger(id: string): ManagedCharger | undefined {
		return this.chargers.get(id);
	}

	/**
	 * Returns all managed chargers
	 * @returns Array of ManagedCharger instances
	 */
	getAllChargers(): ManagedCharger[] {
		return Array.from(this.chargers.values());
	}

	/**
	 * Returns all valid chargers
	 * @returns Array of valid ManagedCharger instances
	 */
	getValidChargers(): ManagedCharger[] {
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
			this.selectedCharger = charger;
			return true;
		}
		return false;
	}

	/**
	 * Clears the selected charger
	 */
	clearSelectedCharger(): void {
		this.selectedCharger = null;
	}
}

/**
 * Class representing a single Ladeklubben charger with its associated data
 */
export class ManagedCharger {
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

	/**
	 * Creates a new ManagedCharger instance
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
	 * Updates the smart charging schedule for the charger
	 * @param data SmartChargeSchedule object with new settings
	 * @returns Promise<void>
	 */
	async putSmartChargeSchedule(data: SmartChargeSchedule): Promise<void> {
		try {
			console.log("Updating smart charge schedule:", data);
			const querystring = data.enabled ? '?enable=1' : '';
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
	async getListPrice(): Promise<ListPrice | void> {
		try {
			const response = await get(`/listprice/${this.id}`);
			this.listPrice = response;
			return this.listPrice;
		} catch (error) {
			console.error("Error getting list price:", error);
			throw error;
		}
	}

}

// Reactive state for the ManagedChargers instance
export const managedChargers = $state(new ManagedChargers());

/**
 * Interface representing the current state of a charger
 */
interface ChargerState {
	/** Auto charging mode status (1 for on, 0 for off) */
	autoon: number;
	/** Connector occupied status (1 for occupied, 0 for free) */
	connector_occupied: number;
	/** Guest charging mode status (1 for on, 0 for off) */
	gueston: number;
	/** Indicates if the charger is currently charging (1 for yes, 0 for no) */
	is_charging: number;
	/** Manual charging mode status (1 for on, 0 for off) */
	manon: number;
	/** Online status: [timestamp, boolean status] */
	online: [number, boolean];
	/** Indicates if the charger is available for public use */
	open_for_public: boolean;
	/** Public charging mode status (1 for on, 0 for off) */
	public: number;
	/** Indicates if smart charging mode is active */
	smart_active: boolean;
	/** Timestamp for the smart charging start time */
	smart_charge_start_time: number;
	/** Type of active smart charging (null if not active) */
	smart_type_active: null | string;
	/** Indicates if the charger is ready for smart charging */
	smartcharge_ready: boolean;
}

/**
 * Interface representing usage statistics for a charger
 */
interface ChargerStats {
	/** Yearly statistics */
	years: YearlyStats;
	/** Monthly statistics */
	months: MonthlyStats;
}

/**
 * Interface for yearly energy consumption statistics
 */
interface YearlyStats {
	/** Map of year to total energy consumption in kWh */
	[year: number]: number;
}

/**
 * Interface for monthly statistics
 */
interface MonthlyStats {
	/** Map of year to monthly stats for that year */
	[year: number]: MonthlyStatsForYear;
}

/**
 * Interface for monthly statistics within a year
 */
interface MonthlyStatsForYear {
	/** Map of month (1-12) to energy consumption in kWh */
	[month: number]: number;
}

/**
 * Interface for real-time measurement values from a charger
 */
interface ChargerNumbers {
	/** Total active energy in kWh */
	TotalActiveEnergy: number;
	/** Total active power in kW */
	TotalActivePower: number;
	/** Current consumption in kWh */
	consumption: number;
	/** Current on phase L1 in Amperes */
	phase_l1_i: number;
	/** Voltage on phase L1 in Volts */
	phase_l1_v: number;
	/** Power on phase L1 in Watts */
	phase_l1_w: number;
	/** Current on phase L2 in Amperes */
	phase_l2_i: number;
	/** Voltage on phase L2 in Volts */
	phase_l2_v: number;
	/** Power on phase L2 in Watts */
	phase_l2_w: number;
	/** Current on phase L3 in Amperes */
	phase_l3_i: number;
	/** Voltage on phase L3 in Volts */
	phase_l3_v: number;
	/** Power on phase L3 in Watts */
	phase_l3_w: number;
	/** Transaction ID */
	tid: string;
	/** Timestamp of the measurement */
	timestamp: number;
}

/**
 * Interface for notification settings
 */
interface NotificationSetup {
	/** Notification settings for charging begin: array of [email, enabled status] pairs */
	onBegin: Array<[string, number]>;
	/** Notification settings for charging end: array of [email, enabled status] pairs */
	onEnd: Array<[string, number]>;
}

/**
 * Interface for notification settings formatted for app
 */
type NotificationSetupFormatted = Array<{
	/** Email address for notifications */
	email: string;
	/** Whether notifications are enabled for charging begin */
	onBeginEnabled: boolean;
	/** Whether notifications are enabled for charging end */
	onEndEnabled: boolean;
}>;

/**
 * Interface for smart charging schedule configuration
 */
interface SmartChargeSchedule {
	/** Earliest time to begin charging (ISO format) */
	charging_begin_earliest: string;
	/** Latest time to end charging (ISO format) */
	charging_end_latest: string;
	/** Energy needed for the charging session in kWh */
	needed_energy: number;
	/** Preheat setting for the vehicle */
	preheat: number;
	/** Shows if smart charge is enabled */
	enabled: boolean;
}

/**
 * Interface for electricity price constants
 */
interface ElectricityPriceConstants {
	/** List of network company entries */
	netcompany: NetcompanyEntry[];
	/** List of spot price area entries */
	spotpriceArea: SpotpriceAreaEntry[];
}

/**
 * Interface for network company information
 */
interface NetcompanyEntry extends Array<CompanyInfo | number> {
	/** Company information */
	0: CompanyInfo;
	/** Associated value (often an ID or price) */
	1: number;
	/** Always 2 items in this array */
	length: 2;
}

/**
 * Interface for electricity company information
 */
interface CompanyInfo {
	/** Company number */
	Selsk_Nr: number;
	/** Company name */
	Selsk_Nvn: string;
}

/**
 * Interface for spot price area information
 */
interface SpotpriceAreaEntry extends Array<string | number> {
	/** Area code or name */
	0: string;
	/** Associated value (often a price or multiplier) */
	1: number;
	/** Always 2 items in this array */
	length: 2;
}

/**
 * Interface for electricity settlement information
 * Represents an array of settlement entries
 */
interface ElectricitySettlement extends Array<SettlementEntry> {
	/** Number of settlement entries */
	length: number;
}

/**
 * Interface for a single electricity settlement entry
 */
interface SettlementEntry extends Array<SettlementInfo | number> {
	/** Settlement information */
	0: SettlementInfo;
	/** Associated value (usually a price) */
	1: number;
	/** Always 2 items in this array */
	length: 2;
}

/**
 * Interface for settlement information details
 */
interface SettlementInfo {
	/** Name of the settlement entry */
	name: string;
	/** Start date/time of the settlement period */
	from: string;
	/** Type of settlement */
	type: string;
	/** Tariff information */
	tariff: string;
	/** Timestamp of the settlement */
	timestamp: string;
}

/**
 * Interface for tax reduction settlement information
 * Represents an array of tax reduction entries
 */
interface TaxReductionSettlement extends Array<TaxReductionEntry> {
	/** Number of tax reduction entries */
	length: number;
}

/**
 * Interface for a single tax reduction entry
 */
interface TaxReductionEntry extends Array<TaxReductionSettings | number> {
	/** Tax reduction settings */
	0: TaxReductionSettings;
	/** Associated value (usually a reduction amount) */
	1: number;
	/** Always 2 items in this array */
	length: 2;
}

/**
 * Interface for tax reduction settings
 */
interface TaxReductionSettings {
	/** Indicates if tax reduction is enabled */
	enabled: boolean;
	/** Indicates if tax reduction is handled by lk system */
	lk_handled: boolean;
}

/**
 * Interface for a list of charging transactions
 * Represents an array of transaction objects
 */
interface TransactionList extends Array<Transaction> {
	/** Number of transactions in the list */
	length: number;
}

/**
 * Interface for a single charging transaction
 */
interface Transaction {
	/** Cost of the transaction */
	Cost: string;
	/** End time of the transaction */
	Ended: string;
	/** Start time of the transaction */
	Started: string;
	/** Transaction ID */
	Tid: string;
	/** Connector ID used for the transaction */
	connector_id: string;
	/** EVSE (Electric Vehicle Supply Equipment) ID */
	evse_id: string;
	/** Meter reading at the start of the transaction */
	meter_start: string;
	/** Meter reading at the end of the transaction */
	meter_stop: string;
	/** User identifier for the transaction */
	user: string;
}

/**
 * Interface for charger transaction information
 */
interface ChargerTransactionInfo {
	/** End timestamp of the transaction */
	Ended: number;
	/** Start timestamp of the transaction */
	Started: number;
	/** Energy consumption in kWh */
	consumption_kwh: number;
	/** Total cost of the transaction */
	cost: number;
	/** Timestamp of the last communication with the station */
	last_station_comm: number;
	/** Latest transaction ID */
	latest_tid: number;
	/** Meter reading at the beginning of the transaction */
	meter_begin: number;
	/** Last meter reading for the transaction */
	meter_last: number;
	/** Transaction ID */
	tid: number;
}

/**
 * Interface for charger transaction plot data
 */
interface ChargerTransactionPlot {
	/** Transaction ID for the plot data */
	tid: number;
	/** Array of measurement values */
	values: number[];
	/** Array of timestamps corresponding to the values */
	timestamps: number[];
}

/**
 * Interface for managed charger pricing information
 */
export interface ListPrice {
	/** Price per kWh. Depending on follow_spot this is either a fixed price or a positive offset */
	nominal: number;
	/** Minimal price even with discounts */
	minimum: number;
	/** Default price if public spot prices are unavailable */
	fallback: number;
	/** Currency */
	valuta: string;
	/** Whether the charger follows spot prices */
	follow_spot: boolean;
}
