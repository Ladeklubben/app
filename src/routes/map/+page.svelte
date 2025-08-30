<script lang="ts">
	import ChargerMap from "$lib/components/features/map/ChargerMap.svelte";
	import ChargerWaypoints from "$lib/components/features/map/ChargerWaypoints.svelte";
	import Glass from "$lib/components/ui/Glass.svelte";
	import { get } from "$lib/services/api";
	import { PublicCharger, chargerRegistry } from "$lib/classes/PublicCharger.svelte";
	import type { ChargerAPIResponse } from "$lib/types/publicCharger.types";
	import Layer from "~icons/mdi/layers-outline";
	import CrossHairs from "~icons/mdi/crosshairs-gps";
	import QRCode from "~icons/mdi/qrcode-scan";
	import { pos, calculateDistance, getPosition } from "$lib/services/map";
	import { device, Platform } from "$lib/services/layout";
	import { onMount } from "svelte";
	import { showError } from "$lib/services/dialog.svelte";
	import { tileServer } from "$lib/services/map";
	import { userInfo } from "$lib/services/auth";

	let chargers: PublicCharger[] = $state([]);
	let isSorted: boolean = $state(false);
	let chargerWaypointsComponent: any = $state(null);

	async function fetchChargers() {
		try {
			const response: ChargerAPIResponse = await get("/chargermap");
			chargers = response.upd.map(chargerData => 
				chargerRegistry.getCharger(chargerData.stationid, chargerData)
			);
		} catch (error) {
			console.error("Error fetching chargers:", error);
			showError("Failed to load chargers");
		}
	}

	// Create a reactive function to sort chargers when position is available
	$effect(() => {
		if ($pos && chargers.length > 0) {
			sortChargersByDistance();
		}
	});

	// Refresh member pricing when user info changes
	$effect(() => {
		if ($userInfo && chargers.length > 0) {
			PublicCharger.refreshMemberPricingForAll(chargers);
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

	function cycleTileServer() {
		const servers: TileServer[] = ["dark", "light", "satellite"];
		const currentIndex = servers.indexOf($tileServer);
		$tileServer = servers[(currentIndex + 1) % servers.length];
	}

	onMount(() => {
		fetchChargers();
	});
</script>

<div class="h-full flex flex-col relative">
	<div
		class="absolute right-0 z-500 p-4 flex flex-col gap-4
		{$device === Platform.IOS ? 'top-16' : ''}
		{$device === Platform.Android ? 'top-10' : ''}"
	>
		<Glass>
			<div class="flex flex-col">
				<button class="p-3 border-b border-lk-blue-800" onclick={() => cycleTileServer()}>
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
	<ChargerMap {chargers} />
	{#if isSorted}
		<div class="absolute bottom-0 left-0 right-0 z-500">
			<ChargerWaypoints bind:this={chargerWaypointsComponent} {chargers} />
		</div>
	{/if}
</div>
