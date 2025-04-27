import { get, post, put, del } from "$lib/services/api";
import type { LocationInfo } from "$lib/types/charger.types";

export class ManagedChargers {
	private chargers: Map<string, ManagedCharger> = new Map();

	constructor() {}

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
			this.chargers.clear();

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

			await Promise.all(promises);
		} catch (error) {
			console.error("Error loading all chargers data:", error);
			throw error;
		}
	}
}

export class ManagedCharger {
	id: string;
	locationInfo?: LocationInfo;
	chargerStats?: ChargerStats;
	valid: boolean = false;
	chargeState?: ChargerState;
	numbers?: ChargerNumbers;
	notificationSetup?: NotificationSetup;
	smartChargeSchedule?: SmartChargeSchedule;
	electricityPriceConstants?: ElectricityPriceConstants;
	electricitySettlement?: ElectricitySettlement;
	taxReductionSettlement?: TaxReductionSettlement;
	transactionsList?: TransactionList;
	transactionsInfo?: ChargerTransactionInfo;
	transactionsPlot?: ChargerTransactionPlot;

	constructor(id: string) {
		this.id = id;
	}

	async getAllData() {
		try {
			await Promise.all([
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
			]);
		} catch (error) {
			console.error("Error getting all data:", error);
			throw error;
		}
	}

	async getInfo() {
		try {
			const response = await get(`/cp/${this.id}/info`);
			this.locationInfo = response;
			return this.locationInfo;
		} catch (error) {
			console.error("Error getting charger info:", error);
			throw error;
		}
	}

	async getStats() {
		try {
			const response = await get(`/cp/${this.id}/stats`);
			this.chargerStats = response;
			return this.chargerStats;
		} catch (error) {
			console.error("Error getting charger stats:", error);
			throw error;
		}
	}

	async getValidity() {
		try {
			const response = await get(`/cp/${this.id}/valid`);
			this.valid = response.is_valid;
			return this.valid;
		} catch (error) {
			console.error("Error getting charger validity:", error);
			throw error;
		}
	}

	async getChargeState() {
		try {
			const response = await get(`/cp/${this.id}/chargestate`);
			this.chargeState = response;
			return this.chargeState;
		} catch (error) {
			console.error("Error getting charger state:", error);
			throw error;
		}
	}

	async getNumbers() {
		try {
			const response = await get(`/cp/${this.id}/chargernumbers`);
			this.numbers = response;
			return this.numbers;
		} catch (error) {
			console.error("Error getting charger numbers:", error);
			throw error;
		}
	}

	async getNotificationSetup() {
		try {
			const response = await get(`/cp/${this.id}/notification_setup`);
			this.notificationSetup = response;
			return this.notificationSetup;
		} catch (error) {
			console.error("Error getting notification setup:", error);
			throw error;
		}
	}

	async getSmartChargeSchedule() {
		try {
			const response = await get(`/cp/${this.id}/smart`);
			this.smartChargeSchedule = response;
			return this.smartChargeSchedule;
		} catch (error) {
			console.error("Error getting smart charge schedule:", error);
			throw error;
		}
	}

	async getElectricityPriceConstants() {
		try {
			const response = await get(`/cp/${this.id}/electricitypriceconstants`);
			this.electricityPriceConstants = response;
			return this.electricityPriceConstants;
		} catch (error) {
			console.error("Error getting electricity price constants:", error);
			throw error;
		}
	}

	async getElectricitySettlement() {
		try {
			const response = await get(`/cp/${this.id}/electricitysettlement`);
			this.electricitySettlement = response;
			return this.electricitySettlement;
		} catch (error) {
			console.error("Error getting electricity settlement:", error);
			throw error;
		}
	}

	async getTaxReductionSettlement() {
		try {
			const response = await get(`/cp/${this.id}/taxreductionsettlement`);
			this.taxReductionSettlement = response;
			return this.taxReductionSettlement;
		} catch (error) {
			console.error("Error getting tax reduction settlement:", error);
			throw error;
		}
	}

	async getTransactionsList() {
		try {
			const response = await get(`/ta/${this.id}/list`);
			this.transactionsList = response;
			return this.transactionsList;
		} catch (error) {
			console.error("Error getting transactions list:", error);
			throw error;
		}
	}

	async getTransactionsInfo() {
		try {
			const response = await get(`/ta/${this.id}/info`);
			this.transactionsInfo = response;
			return this.transactionsInfo;
		} catch (error) {
			console.error("Error getting transactions info:", error);
			throw error;
		}
	}

	async getTransactionsPlot() {
		try {
			const response = await get(`/ta/${this.id}/plot`);
			this.transactionsPlot = response;
			return this.transactionsPlot;
		} catch (error) {
			console.error("Error getting transactions plot:", error);
			throw error;
		}
	}
}

// Interfaces
interface ChargerState {
	autoon: number;
	connector_occupied: number;
	gueston: number;
	is_charging: number;
	manon: number;
	online: [number, boolean];
	open_for_public: boolean;
	public: number;
	smart_active: boolean;
	smart_charge_start_time: number;
	smart_type_active: null | string;
	smartcharge_ready: boolean;
}

interface ChargerStats {
	years: YearlyStats;
	months: MonthlyStats;
}

interface YearlyStats {
	[year: number]: number;
}

interface MonthlyStats {
	[year: number]: MonthlyStatsForYear;
}

interface MonthlyStatsForYear {
	[month: number]: number;
}

interface ChargerNumbers {
	TotalActiveEnergy: number;
	TotalActivePower: number;
	consumption: number;
	phase_l1_i: number;
	phase_l1_v: number;
	phase_l1_w: number;
	phase_l2_i: number;
	phase_l2_v: number;
	phase_l2_w: number;
	phase_l3_i: number;
	phase_l3_v: number;
	phase_l3_w: number;
	tid: string;
	timestamp: number;
}

interface NotificationSetup {
	onBegin: [string, number];
	onEnd: [string, number];
}

interface SmartChargeSchedule {
	charging_begin_earliest: string;
	charging_end_latest: string;
	needed_energy: number;
	preheat: number;
}

interface ElectricityPriceConstants {
	netcompany: NetcompanyEntry[];
	spotpriceArea: SpotpriceAreaEntry[];
}

interface NetcompanyEntry extends Array<CompanyInfo | number> {
	0: CompanyInfo;
	1: number;
	length: 2;
}

interface CompanyInfo {
	Selsk_Nr: number;
	Selsk_Nvn: string;
}

interface SpotpriceAreaEntry extends Array<string | number> {
	0: string;
	1: number;
	length: 2;
}

interface ElectricitySettlement extends Array<SettlementEntry> {
	length: number;
}

interface SettlementEntry extends Array<SettlementInfo | number> {
	0: SettlementInfo;
	1: number;
	length: 2;
}

interface SettlementInfo {
	name: string;
	from: string;
	type: string;
	tariff: string;
	timestamp: string;
}

interface TaxReductionSettlement extends Array<TaxReductionEntry> {
	length: number;
}

interface TaxReductionEntry extends Array<TaxReductionSettings | number> {
	0: TaxReductionSettings;
	1: number;
	length: 2;
}

interface TaxReductionSettings {
	enabled: boolean;
	lk_handled: boolean;
}

interface TransactionList extends Array<Transaction> {
	length: number;
}

interface Transaction {
	Cost: string;
	Ended: string;
	Started: string;
	Tid: string;
	connector_id: string;
	evse_id: string;
	meter_start: string;
	meter_stop: string;
	user: string;
}

interface ChargerTransactionInfo {
	Ended: number;
	Started: number;
	consumption_kwh: number;
	cost: number;
	last_station_comm: number;
	latest_tid: number;
	meter_begin: number;
	meter_last: number;
	tid: number;
}

interface ChargerTransactionPlot {
	tid: number;
	values: number[];
	timestamps: number[];
}
