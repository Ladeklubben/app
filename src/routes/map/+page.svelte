<script lang="ts">
	import ChargerMap from "$lib/components/features/map/ChargerMap.svelte";
	import ChargerWaypoints from "$lib/components/features/map/ChargerWaypoints.svelte";
	import Glass from "$lib/components/ui/Glass.svelte";
	import { get } from "$lib/services/api";
	import { PublicCharger, selectedChargerID } from "$lib/classes/PublicCharger";
	import type { ChargerAPIResponse } from "$lib/types/charger.types";
	import Layer from "~icons/mdi/layers-outline";
	import CrossHairs from "~icons/mdi/crosshairs-gps";
	import QRCode from "~icons/mdi/qrcode-scan";
	import { pos, calculateDistance, getPosition } from "$lib/services/map";
	import { device, Platform } from "$lib/services/layout";
	import { onDestroy } from "svelte";

	let chargers: PublicCharger[] = $state([]);
	let isDark: boolean = $state(false);
	let isSorted: boolean = $state(false);
	let chargerWaypointsComponent: any = $state(null);

	get("/chargermap")
		.then((response: ChargerAPIResponse) => {
			chargers = PublicCharger.fromApiResponse(response.upd);
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

	// Handle clicking on the GPS button
	function handleGPSClick() {
		// Scroll to the beginning of the waypoints
		if (chargerWaypointsComponent) {
			chargerWaypointsComponent.scrollToBeginning();
		}
		// Get the current position
		getPosition();
	}

	onDestroy(() => {
		// Clear selected charger
		$selectedChargerID = "";
	});
</script>

<div class="h-full flex flex-col relative">
	<!-- TODO: Handle loading and errors in loading -->
	<div
		class="absolute right-0 z-500 p-4 flex flex-col gap-4
		{$device === Platform.IOS ? 'top-16' : ''}
		{$device === Platform.Android ? 'top-10' : ''}"
	>
		<Glass>
			<div class="flex flex-col">
				<button class="p-3 border-b border-lk-blue-800" onclick={() => (isDark = !isDark)}>
					<Layer class="text-lg" />
				</button>
				<button class="p-3">
					<QRCode class="text-lg" />
				</button>
			</div>
		</Glass>

		<Glass>
			<button class="p-3 border-lk-blue-800" onclick={() => handleGPSClick()}>
				<CrossHairs class="text-lg" />
			</button>
		</Glass>
	</div>
	<ChargerMap {chargers} {isDark} />
	{#if isSorted}
		<div class="absolute bottom-0 left-0 right-0 z-500">
			<ChargerWaypoints bind:this={chargerWaypointsComponent}  {chargers} />
		</div>
	{/if}
</div>
