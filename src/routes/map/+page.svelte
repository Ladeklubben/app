<script lang="ts">
	import ChargerMap from "$lib/components/features/map/ChargerMap.svelte";
	import ChargerWaypoints from "$lib/components/features/map/ChargerWaypoints.svelte";
	import { get } from "$lib/services/api";
	import type { ChargerStation } from "$lib/types/chargers";

	let chargers: ChargerStation[] = $state([]);
	let selectedChargerId: string = $state("");

	// Function to handle navigation
	function navigateToCharger(id: string) {
		selectedChargerId = id;
		// Here you would implement opening the navigation app
		// This could be launching a maps URL or using a native app integration
		const charger = chargers.find((c) => c.stationid === id);
		if (charger) {
			// Example: Open Google Maps
			const url = `https://www.google.com/maps/dir/?api=1&destination=${charger.location.latitude},${charger.location.longitude}`;
			window.open(url, "_blank");
		}
	}

	get("/chargermap")
		.then((response) => {
			chargers = response.upd;
		})
		.catch((error) => {
			console.error("Error fetching chargers:", error);
		});
</script>

<div class="h-full flex flex-col relative">
	<ChargerMap {chargers} isSatellite={false} />
	<div class="absolute bottom-0 left-0 right-0 z-500">
		<ChargerWaypoints {chargers} onNavigate={navigateToCharger} />
	</div>
</div>
