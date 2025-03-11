export type MeterData = {
	timestamp: number;
	totals: {
		total_energy_import: number;
		total_energy_export: number;
		total_reactive_import: number;
		total_reactive_export: number;
		total_power_import: number;
		total_power_export: number;
		total_reactive_power_import: number;
		total_reactive_power_export: number;
	};
	current: number[];
	voltage: number[];
};
