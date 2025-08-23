<script lang="ts">
	import Directions from "~icons/mdi/directions";
	import { PublicCharger, selectedCharger } from "$lib/classes/PublicCharger.svelte";
	import Glass from "$lib/components/ui/Glass.svelte";
	import Bolt from "~icons/mdi/lightning-bolt";
	import MapMarker from "~icons/mdi/map-marker";
	import Clock from "~icons/mdi/clock-time-four-outline";
	import Name from "~icons/mdi/rename-outline";
	import Cancel from "~icons/mdi/cancel";
	import { slide } from "svelte/transition";

	let { charger, distance = 0 } = $props<{
		charger: PublicCharger;
		distance?: number;
	}>();

	let isSelected: boolean = $state(false);
	let available: boolean = $derived(charger.connector === "Available");

	$effect(() => {
		isSelected = charger.stationid === selectedCharger.id;
	});

	let reserved = $derived(charger.reservation.claimTimeout > 0 && charger.reservation.reserved);

	function handleClick() {
		if (reserved) {
			charger.startCharge(true);
		} else {
			charger.reserveCharger();
		}
	}
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
			<div class="flex flex-col p-4 gap-3 border-t border-lk-blue-800 bg-lk-blue-950 text-md" transition:slide>
				<div class="flex gap-2 text-lk-blue-100/80">
					<Name />
					<span class="truncate">
						{charger.location.brief || "Unnamed"}
					</span>
				</div>
				<div class="flex gap-2 text-lk-blue-100/80 items-center">
					<Clock />
					{charger.calculateOpeningHours()}
				</div>

				{#if reserved}
					<button
						onclick={() => console.log("TODO: Cancel reservation")}
						disabled={!available}
						class="flex flex-col items-center w-full justify-between flex-1 backdrop-blur-sm transition-all p-2 rounded-2xl text-lg font-medium shadow-sm border border-lk-green-400 bg-lk-green-950 mb-1"
					>
						<span class="text-lg">
							{Math.floor(charger.reservation.claimTimeout / 60)
								.toString()
								.padStart(2, "0")}
							:
							{(charger.reservation.claimTimeout % 60).toString().padStart(2, "0")}
						</span>
						<span class="text-xs text-center text-lk-blue-100/70">Reserved</span>
					</button>
				{/if}

				<div class="flex justify-between gap-3">
					<button
						onclick={() => handleClick()}
						disabled={!available}
						class="flex-1 backdrop-blur-sm transition-all p-1.5 rounded-2xl text-lg font-medium shadow-sm
						{available ? 'bg-lk-blue-200 text-lk-blue-900' : 'bg-lk-red-800 text-gray-300'}"
					>
						{#if available}
							{#if reserved}
								Start Charge
							{:else}
								Reserve
							{/if}
						{:else}
							Charging...
						{/if}
					</button>
					<button
						onclick={() => charger.navigateToCharger()}
						class="bg-lk-blue-200 backdrop-blur-sm text-gray-800 border border-lk-blue-200 transition-all p-2 rounded-2xl font-medium shadow-sm"
					>
						<Directions class="text-xl" />
					</button>
				</div>
			</div>
		{/if}
	</div>
</Glass>
