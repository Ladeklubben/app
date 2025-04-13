<script lang="ts">
	import ChargerMap from "$lib/components/features/map/ChargerMap.svelte";
	import ChargerWaypoints from "$lib/components/features/map/ChargerWaypoints.svelte";
	import Glass from "$lib/components/ui/Glass.svelte";
	import { get } from "$lib/services/api";
	import type { ChargerStation } from "$lib/types/chargers";
	import Layer from "~icons/mdi/layers-outline";
	import CrossHairs from "~icons/mdi/crosshairs-gps";
	import QRCode from "~icons/mdi/qrcode-scan";
	import { pos, getPosition } from "$lib/services/map";

	let chargers: ChargerStation[] = $state([]);
	let selectedChargerId: string = $state("");
	let isSatellite: boolean = $state(false);

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

			// Check if the user has granted location permissions
			if (!$pos) {
				return;
			}

			// Sort chargers by distance to the user's location
			let time_start = Date.now();
			chargers.sort((a, b) => {
				const distanceA = Math.sqrt(
					Math.pow(a.location.latitude - $pos?.coords.latitude, 2) +
						Math.pow(a.location.longitude - $pos?.coords.longitude, 2)
				);
				const distanceB = Math.sqrt(
					Math.pow(b.location.latitude - $pos?.coords.latitude, 2) +
						Math.pow(b.location.longitude - $pos?.coords.longitude, 2)
				);
				return distanceA - distanceB;
			});
			let time_end = Date.now();
			console.info("Sorting time:", time_end - time_start, "ms");
		})
		.catch((error) => {
			console.error("Error fetching chargers:", error);
		});
</script>

<div class="h-full flex flex-col relative">
	<div class="absolute top-10 right-0 z-500 p-4 flex flex-col gap-4">
		<Glass>
			<div class="flex flex-col">
				<button class="p-3 border-b border-lk-blue-800" onclick={() => (isSatellite = !isSatellite)}>
					<Layer class="text-lg" />
				</button>
				<button class="p-3">
					<QRCode class="text-lg" />
				</button>
			</div>
		</Glass>

		<Glass>
			<button class="p-3 border-b border-lk-blue-800">
				<CrossHairs class="text-lg" />
			</button>
		</Glass>
	</div>
	<ChargerMap {chargers} {isSatellite} />
	<div class="absolute bottom-0 left-0 right-0 z-500">
		<ChargerWaypoints {chargers} onNavigate={navigateToCharger} />
	</div>
</div>
