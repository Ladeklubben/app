<script lang="ts">
	import type { IPublicCharger } from "$lib/types/publicCharger.types";
	import WaypointCard from "./WaypointCard.svelte";
	import { pos } from "$lib/services/map";
	import { PublicCharger, selectedCharger, chargerRegistry } from "$lib/classes/PublicCharger.svelte";

	let { chargers = [] as IPublicCharger[] } = $props<{
		chargers?: IPublicCharger[];
	}>();

	let scrollContainer: HTMLElement;
	let waypointElements: Record<string, HTMLElement> = $state({});

	function scrollToSelectedCharger() {
		if (
			selectedCharger.charger?.stationid &&
			waypointElements[selectedCharger.charger.stationid] &&
			scrollContainer
		) {
			waypointElements[selectedCharger.charger.stationid].scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "center",
			});
		}
	}

	export function scrollToBeginning() {
		if (scrollContainer) {
			scrollContainer.scrollTo({
				left: 0,
				behavior: "smooth",
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
			class="snap-center w-3/4 flex-shrink-0 max-w-lg
			{index === 0 ? 'ml-10' : ''}
			{index === chargers.length - 1 ? 'mr-10' : ''}"
			bind:this={waypointElements[charger.stationid]}
			data-charger-id={charger.stationid}
			onclick={() => selectedCharger.setCharger(chargerRegistry.getCharger(charger.stationid, charger))}
		>
			<WaypointCard {charger} distance={charger.distance($pos)} />
		</button>
	{/each}
</div>
