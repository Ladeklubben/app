<script lang="ts">
	import ChargerMap from "$lib/components/features/map/ChargerMap.svelte";
	import ChargerWaypoints from "$lib/components/features/map/ChargerWaypoints.svelte";
	import Glass from "$lib/components/ui/Glass.svelte";
	import { get } from "$lib/services/api";
	import type { ChargerStation } from "$lib/types/chargers";
	import Layer from "~icons/mdi/layers-outline";
	import CrossHairs from "~icons/mdi/crosshairs-gps";
	import QRCode from "~icons/mdi/qrcode-scan";
	import { pos, calculateDistance, getPosition } from "$lib/services/map";

	let chargers: ChargerStation[] = $state([]);
	let isSatellite: boolean = $state(false);
	let isSorted: boolean = $state(false);

	// Function to handle navigation
	function navigateToCharger(id: string) {
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
			console.log("Chargers fetched:", chargers);
		})
		.catch((error) => {
			console.error("Error fetching chargers:", error);
		});

	// Create a reactive function to sort chargers when position is available
	$effect(() => {
		if ($pos && chargers.length > 0) {
			sortChargersByDistance();
		}
	});

	// Function to sort chargers by distance to user
	function sortChargersByDistance() {
		if (!$pos || chargers.length === 0) return;

		chargers.sort((a, b) => {
			const distanceA = calculateDistance(
				$pos.coords.latitude,
				$pos.coords.longitude,
				a.location.latitude,
				a.location.longitude,
			);
			const distanceB = calculateDistance(
				$pos.coords.latitude,
				$pos.coords.longitude,
				b.location.latitude,
				b.location.longitude,
			);
			return distanceA - distanceB;
		});
		isSorted = true;
	}
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
			<button class="p-3 border-lk-blue-800" onclick={() => getPosition()}>
				<CrossHairs class="text-lg" />
			</button>
		</Glass>
	</div>
	<ChargerMap {chargers} {isSatellite} />
	{#if isSorted}
		<div class="absolute bottom-0 left-0 right-0 z-500">
			<ChargerWaypoints {chargers} onNavigate={navigateToCharger} />
		</div>
	{/if}
</div>
