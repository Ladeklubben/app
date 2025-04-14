<script lang="ts">
	import Directions from "~icons/mdi/directions";
	import type { ChargerStation } from "$lib/types/chargers";
	import Glass from "$lib/components/ui/Glass.svelte";
	import { selectedChargerID } from "$lib/services/map";

	let {
		charger,
		onNavigate,
		distance = 0,
	} = $props<{
		charger: ChargerStation;
		onNavigate: () => void;
		distance?: number;
	}>();

	let isSelected: boolean = $state(false);

	$effect(() => {
		isSelected = charger.stationid === $selectedChargerID;
	});
</script>

<Glass>
	<div class="p-4 flex flex-col gap-3">
		<div class="flex items-center justify-between">
			<div class="flex items-end text-lk-blue-50 font-bold">
				<span class="text-3xl">{charger.prices.nominal}</span>
				<span class="text-lg font-light ml-2">
					<span class="font-bold">DKK</span>
					/kWh
				</span>
			</div>
			<div
				class="bg-lk-green-400  font-bold rounded-md px-2 py-1 text-sm flex items-center backdrop-blur-sm
					{charger.connector === 'Available' ? 'bg-lk-green-400 text-lk-green-900' : 'bg-lk-red-700 text-white'}"
			>
				<span>{distance.toFixed(1)} km</span>
			</div>
		</div>

		{#if isSelected}
			<div class="flex justify-between gap-3">
				<button
					onclick={onNavigate}
					disabled={charger.connector !== "Available"}
					class="flex-1 backdrop-blur-sm border border-lk-blue-800 transition-all p-1.5 rounded-2xl text-sm font-medium shadow-sm
						{charger.connector === 'Available' ? 'bg-lk-blue-200 text-lk-blue-900' : 'bg-lk-blue-900 text-gray-300'}"
				>
					{#if charger.connector === "Available"}
						Reserve
					{:else}
						Charging...
					{/if}
				</button>
				<button
					onclick={onNavigate}
					class="bg-lk-blue-200 backdrop-blur-sm border border-lk-blue-800 text-gray-800 transition-all p-1.5 rounded-2xl font-medium shadow-sm"
				>
					<Directions class="text-xl" />
				</button>
			</div>
		{/if}
	</div>
</Glass>
