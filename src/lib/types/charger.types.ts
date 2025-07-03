/**
 * Interface representing the current state of a charger
 */
export interface ChargerState {
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
	/** Public charging mode status (true for on, false for off) */
	public: boolean;
	/** Indicates if smart charging mode is active */
	smart_active: boolean;
	/** Timestamp for the smart charging start time */
	smart_charge_start_time: number;
	/** Type of active smart charging (null if not active) */
	smart_type_active: null | string;
	/** Indicates if the charger is ready for smart charging */
	smartcharge_ready: boolean;
}

export type ChargerStatus = "Charging" | "EV Connected" | "Ready" | "Offline";

/**
 * Interface representing usage statistics for a charger
 */
export interface ChargerStats {
	/** Yearly statistics */
	years: YearlyStats;
	/** Monthly statistics */
	months: MonthlyStats;
}

/**
 * Interface for yearly energy consumption statistics
 */
export interface YearlyStats {
	/** Map of year to total energy consumption in kWh */
	[year: number]: number;
}

/**
 * Interface for monthly statistics
 */
export interface MonthlyStats {
	/** Map of year to monthly stats for that year */
	[year: number]: MonthlyStatsForYear;
}

/**
 * Interface for monthly statistics within a year
 */
export interface MonthlyStatsForYear {
	/** Map of month (1-12) to energy consumption in kWh */
	[month: number]: number;
}

/**
 * Interface for real-time measurement values from a charger
 */
export interface ChargerNumbers {
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
export interface NotificationSetup {
	/** Notification settings for charging begin: array of [email, enabled status] pairs */
	onBegin: Array<[string, number]>;
	/** Notification settings for charging end: array of [email, enabled status] pairs */
	onEnd: Array<[string, number]>;
}

/**
 * Interface for notification settings formatted for app
 */
export type NotificationSetupFormatted = Array<{
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
export interface SmartChargeSchedule {
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
export interface ElectricityPriceConstants {
	/** List of network company entries */
	netcompany: NetcompanyEntry[];
	/** List of spot price area entries */
	spotpriceArea: SpotpriceAreaEntry[];
}

/**
 * Interface for network company information
 */
export interface NetcompanyEntry extends Array<CompanyInfo | number> {
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
export interface CompanyInfo {
	/** Company number */
	Selsk_Nr: number;
	/** Company name */
	Selsk_Nvn: string;
}

/**
 * Interface for spot price area information
 */
export interface SpotpriceAreaEntry extends Array<string | number> {
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
export interface ElectricitySettlement extends Array<SettlementEntry> {
	/** Number of settlement entries */
	length: number;
}

/**
 * Interface for a single electricity settlement entry
 */
export interface SettlementEntry extends Array<SettlementInfo | number> {
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
export interface SettlementInfo {
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
export interface TaxReductionSettlement extends Array<TaxReductionEntry> {
	/** Number of tax reduction entries */
	length: number;
}

/**
 * Interface for a single tax reduction entry
 */
export interface TaxReductionEntry extends Array<TaxReductionSettings | number> {
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
export interface TaxReductionSettings {
	/** Indicates if tax reduction is enabled */
	enabled: boolean;
	/** Indicates if tax reduction is handled by lk system */
	lk_handled: boolean;
}

/**
 * Interface for a list of charging transactions
 * Represents an array of transaction objects
 */
export interface TransactionList extends Array<Transaction> {
	/** Number of transactions in the list */
	length: number;
}

/**
 * Interface for a single charging transaction
 */
export interface Transaction {
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
export interface ChargerTransactionInfo {
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
export interface ChargerTransactionPlot {
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

/**
 * Interface for free charging schedule
 * Represents an array of schedule entries
 */
export interface ScheduleList extends Array<SingleSchedule> {
	/** Number of schedule entries */
	length: number;
}

/**
 * Interface for a free charging interval configuration
 */
export interface SingleSchedule {
	/** Array of weekdays where this interval applies (0 = Monday, 1 = Tuesday, etc.) */
	days: number[];
	/** Starting time in minutes from midnight */
	start: number;
	/** Duration of the interval in minutes */
	interval: number;
}

/**
 * Interface for display schedule
 * Represents a schedule that can be displayed in the app
 */
export interface DisplaySchedule {
	id: string;
	days: number[];
	startTime: string;
	endTime: string;
	expanded: boolean;
	savedToServer: boolean;
}