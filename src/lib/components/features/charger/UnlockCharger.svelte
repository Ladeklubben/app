<script lang="ts">
	import { chargers } from "$lib/classes/Chargers.svelte";
	import { Charger } from "$lib/classes/Charger.svelte";
	import { onMount } from "svelte";
	import Bolt from "~icons/mdi/lightning-bolt";
	import MapMarker from "~icons/mdi/map-marker";
	import ChevronRight from "~icons/mdi/chevron-right";
	import { goto } from "$app/navigation";
	import Button from "$lib/components/ui/Button.svelte";
	import { showError } from "$lib/services/dialog.svelte";
	import { fade } from "svelte/transition";
	import Dots from "~icons/mdi/dots-horizontal";
	import Power from "~icons/mdi/power";

	const chargerArray = $derived(Array.from(chargers.chargers.values()));
	let loaded = $state(false);

	onMount(async () => {
		try {
			loaded = false;
			await chargers.initializeChargers();
			await chargers.loadAllChargersCardData();
		} catch (error) {
			console.error("Failed to initialize charger data:", error);
			showError("Failed to load charger data.");
		} finally {
			loaded = true;
		}
	});

	function handleChargerClick(charger: Charger) {
		// Navigate to charger details page
		chargers.selectCharger(charger.id);
		goto(`/menu/chargers/settings`);
	}

	async function toggleChargerUnlock(charger: Charger) {
		try {
			if (!charger.chargeState) {
				showError("Charger state not available.");
				return;
			}
			if (charger.chargeState.is_charging === 1) {
				await charger.stopCharging();
				charger.chargeState.is_charging = 0;
			} else {
				await charger.startCharging();
				charger.chargeState.is_charging = 1;
			}
		} catch (error) {
			return;
		}
	}
</script>

{#if chargerArray.length > 0 && loaded}
	<div class="flex flex-col gap-5" transition:fade>
		{#each chargerArray as charger}
			<button
				type="button"
				class="rounded-2xl overflow-hidden border border-lk-blue-800 w-full p-0 m-0 bg-transparent focus:outline-none text-left"
				onclick={() => toggleChargerUnlock(charger)}
			>
				<div class="flex p-5">
					<div class="mr-4 flex-shrink-0">
						<div
							class={`w-12 h-12 rounded-full flex items-center justify-center 
							${charger.chargeState?.is_charging === 1 ? "bg-lk-green-500/20" : "bg-lk-blue-500/20"}`}
						>
							<Power
								class={`w-8 h-8 ${charger.chargeState?.is_charging === 1 ? "text-lk-green-400" : "text-lk-blue-400"}`}
							/>
						</div>
					</div>
					<div class="flex-grow flex items-center">
						<div class="flex justify-between items-center w-full">
							<div class="flex flex-col">
								<h3 class="text-lg font-bold text-lk-blue-50">
									{charger.locationInfo?.brief || "Unnamed"}
								</h3>
								<p class="text-lk-blue-300 text-sm">
									{charger.getChargerStatus(charger)}
								</p>
							</div>
							<div onclick={() => handleChargerClick(charger)}>
								<Dots class="text-lk-blue-50 text-2xl" />
							</div>
						</div>
					</div>
				</div>
			</button>
		{/each}
	</div>
{:else if loaded}
	<div class="rounded-2xl p-8 text-center pt-16">
		<Bolt class="w-12 h-12 text-lk-blue-400 mx-auto mb-4" />
		<p class="text-lk-blue-50 text-lg font-medium mb-2">No Chargers Found</p>
		<p class="text-lk-blue-300 text-sm mb-4">You don't have any EV chargers registered yet.</p>
		<Button type="button">Add New Charger</Button>
	</div>
{/if}
