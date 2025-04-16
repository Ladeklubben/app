<script lang="ts">
	import type { ChargerStation } from "$lib/types/chargers";
	import WaypointCard from "./WaypointCard.svelte";
	import { pos, calculateDistance, selectedChargerID } from "$lib/services/map";

	let { chargers = [] as ChargerStation[], onNavigate } = $props<{
		chargers?: ChargerStation[];
		onNavigate?: (id: string) => void;
	}>();

	let scrollContainer: HTMLElement;
	let waypointElements: Record<string, HTMLElement> = $state({});

	function getChargerDistance(charger: ChargerStation): number {
		if (!$pos) return 0;

		return calculateDistance(
			$pos.coords.latitude,
			$pos.coords.longitude,
			charger.location.latitude,
			charger.location.longitude,
		);
	}

	function scrollToSelectedCharger() {
		if ($selectedChargerID && waypointElements[$selectedChargerID] && scrollContainer) {
			waypointElements[$selectedChargerID].scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "center",
			});
		}
	}

	$effect(() => {
		scrollToSelectedCharger();
	});
</script>

<div
	class="flex overflow-x-auto gap-5 py-5 px-0 w-full no-scrollbar scroll-smooth snap-x snap-mandatory items-end"
	bind:this={scrollContainer}
>
	{#each chargers as charger, index (charger.stationid)}
		<button
			class="snap-center w-3/4 flex-shrink-0  max-w-lg
			{index === 0 ? 'ml-10' : ''}
			{index === chargers.length - 1 ? 'mr-10' : ''}"
			bind:this={waypointElements[charger.stationid]}
			data-charger-id={charger.stationid}
			onclick={() => ($selectedChargerID = charger.stationid)}
		>
			<WaypointCard
				{charger}
				onNavigate={() => onNavigate(charger.stationid)}
				distance={getChargerDistance(charger)}
			/>
		</button>
	{/each}
</div>
