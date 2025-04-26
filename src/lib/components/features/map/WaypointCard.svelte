<script lang="ts">
	import Directions from "~icons/mdi/directions";
	import { PublicCharger, selectedChargerID } from "$lib/models/PublicCharger";
	import Glass from "$lib/components/ui/Glass.svelte";
	import Bolt from "~icons/mdi/lightning-bolt";
	import MapMarker from "~icons/mdi/map-marker";
	import Clock from "~icons/mdi/clock-time-four-outline";
	import { slide } from "svelte/transition";

	let {
		charger,
		distance = 0,
	} = $props<{
		charger: PublicCharger;
		distance?: number;
	}>();

	let isSelected: boolean = $state(false);
	let available: boolean = $derived(charger.connector === "Available");

	$effect(() => {
		isSelected = charger.stationid === $selectedChargerID;
	});
</script>

<Glass>
	<div class="flex flex-col">
		{#if charger.location.city}
			<div class="border-b border-lk-blue-800 p-2 text-lg">
				{charger.location.city}
			</div>
		{/if}

		<div class="flex justify-around p-3">
			<div class="flex flex-col items-center gap-1.5">
				<div class="p-1.5 flex items-center bg-lk-blue-800/50 rounded-full">
					<Bolt class="text-lg text-lk-green-400" />
				</div>
				<span class="text-lg font-medium text-lk-green-400">
					{charger.currentPrice} kr.
				</span>
			</div>
			<div class="flex flex-col items-center gap-1.5">
				<div class="p-1.5 flex items-center bg-lk-blue-800/50 rounded-full">
					<MapMarker class="text-lg {available ? 'text-lk-blue-50' : 'text-lk-red-600'}" />
				</div>
				<span class="text-lg font-medium {available ? 'text-lk-blue-50' : 'text-lk-red-600'}">
					{distance.toFixed(2)} km
				</span>
			</div>
		</div>

		{#if isSelected}
			<div class="flex flex-col p-4 gap-2 border-t border-lk-blue-800 bg-lk-blue-950" transition:slide>
				<div class="flex gap-2 pb-2 text-lg text-lk-blue-100/80 items-center">
					<Clock />
					{charger.calculateOpeningHours()}
				</div>
				<div class="flex justify-between gap-3">
					<button
						onclick={() => console.log("Reserve clicked")}
						disabled={!available}
						class="flex-1 backdrop-blur-sm transition-all p-1.5 rounded-2xl text-lg font-medium shadow-sm
						{available ? 'bg-lk-blue-200 text-lk-blue-900' : 'bg-lk-red-800 text-gray-300'}"
					>
						{#if available}
							Reserve
						{:else}
							Charging...
						{/if}
					</button>
					<button
						onclick={() => charger.navigateToCharger()}
						class="bg-lk-blue-200 backdrop-blur-sm text-gray-800 transition-all p-2 rounded-2xl font-medium shadow-sm"
					>
						<Directions class="text-xl" />
					</button>
				</div>
			</div>
		{/if}
	</div>
</Glass>
