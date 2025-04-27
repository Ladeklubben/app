<script lang="ts">
	import { ManagedCharger } from "$lib/models/ManagedChargers";
	import { onMount } from "svelte";
	import { ManagedChargersStore } from "$lib/models/ManagedChargers";
	import Subpage from "$lib/components/ui/Subpage.svelte";
	import Bolt from "~icons/mdi/lightning-bolt";
	import MapMarker from "~icons/mdi/map-marker";
	import ChevronRight from "~icons/mdi/chevron-right";
	import { goto } from "$app/navigation";
	import Button from "$lib/components/ui/Button.svelte";

	let isLoading = $state(true);
	let chargers: ManagedCharger[] = $state([]);

	onMount(async () => {
		await $ManagedChargersStore.initializeChargers();
		await $ManagedChargersStore.loadAllChargersData();
		chargers = $ManagedChargersStore.getAllChargers();
		isLoading = false;
	});

	// Helper functions for the card
	function getChargerStatus(charger: ManagedCharger) {
		const isCharging = charger.chargeState?.is_charging === 1;
		const isConnected = charger.chargeState?.connector_occupied === 1;

		if (isCharging) return { text: "Charging", class: "text-green-400" };
		if (isConnected) return { text: "Connected", class: "text-lk-blue-200" };
		return { text: "Idle", class: "text-lk-blue-200" };
	}

	function handleChargerClick(charger: ManagedCharger) {
		// Navigate to charger details page
		// window.location.href = `/chargers/${charger.id}`;
		goto("/menu");
	}
</script>

<Subpage title="Chargers" backURL="/menu">
	{#if isLoading}
		<div class="rounded-2xl p-8 text-center">
			<p class="text-lk-blue-50">Loading chargers...</p>
		</div>
	{:else if chargers.length > 0}
		{#each chargers as charger}
			<button
				type="button"
				class="rounded-2xl overflow-hidden border border-lk-blue-800 w-full p-0 m-0 bg-transparent focus:outline-none text-left"
				onclick={() => handleChargerClick(charger)}
			>
				<div class="flex p-4">
					<div class="mr-4 flex-shrink-0">
						<div
							class={`w-12 h-12 rounded-full flex items-center justify-center 
							${charger.chargeState?.is_charging === 1 ? "bg-lk-green-500/20" : "bg-lk-blue-500/20"}`}
						>
							<Bolt
								class={`w-8 h-8 ${charger.chargeState?.is_charging === 1 ? "text-lk-green-400" : "text-lk-blue-400"}`}
							/>
						</div>
					</div>

					<div class="flex-grow">
						<div class="flex justify-between items-start ">
							<h3 class="text-lg font-bold text-lk-blue-50 mb-2">
								{charger.locationInfo?.brief || "Charger"}
							</h3>
							<div
								class={`h-3 w-3 rounded-full ${charger.chargeState?.online?.[1] ? "bg-lk-green-500" : "bg-lk-red-600"}`}
							></div>
						</div>

						<div class="grid grid-cols-2 gap-2 text-sm">
							<div>
								<span class="text-lk-blue-400">Status:</span>
								<span class={`ml-1 ${getChargerStatus(charger).class}`}>
									{getChargerStatus(charger).text}
								</span>
							</div>

							<div>
								<span class="text-lk-blue-400">Power:</span>
								<span class="ml-1 text-lk-blue-50">
									{charger.numbers?.TotalActivePower?.toFixed(1) || 0} kW
								</span>
							</div>

							<div>
								<span class="text-lk-blue-400">Total:</span>
								<span class="ml-1 text-lk-blue-50">
									{charger.numbers?.consumption?.toFixed(0) || 0} kWh
								</span>
							</div>

							<div>
								<span class="text-lk-blue-400">Current:</span>
								<span class="ml-1 text-lk-blue-50">
									{charger.numbers?.phase_l1_i.toFixed(1) || 0} A
								</span>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-lk-blue-900 bg-opacity-30 px-4 py-2 flex justify-between items-center text-xs text-lk-blue-300">
					{#if charger.locationInfo?.address}
						<div class="flex items-center">
							<MapMarker class="w-3 h-3 mr-1" />
							<span>{charger.locationInfo.address}</span>
						</div>
					{:else}
						<span class="italic text-lk-blue-50">No location set</span>
					{/if}
					<div class=" hover:text-lk-blue-100 flex items-center">
						View Settings <ChevronRight class="w-3 h-3 ml-1 mt-0.5" />
					</div>
				</div>
			</button>
		{/each}
	{:else}
		<div class="rounded-2xl p-8 text-center pt-16">
			<Bolt class="w-12 h-12 text-lk-blue-400 mx-auto mb-4" />
			<p class="text-lk-blue-50 text-lg font-medium mb-2">No Chargers Found</p>
			<p class="text-lk-blue-300 text-sm mb-4">You don't have any EV chargers registered yet.</p>
			<Button type="button">Add New Charger</Button>
		</div>
	{/if}
</Subpage>
