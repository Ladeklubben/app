<script lang="ts">
	import Map from "$lib/components/features/map/BaseMap.svelte";
	import ChargerMap from "$lib/components/features/map/ChargerMap.svelte";
	import InteractiveMap from "$lib/components/features/map/InteractiveMap.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let chargers = [
		{ lat: 55.6761, lng: 12.5683, name: "Copenhagen Charger" },
		{ lat: 56.1629, lng: 10.2039, name: "Aarhus Charger" },
		// Add more chargers
	];

</script>
<div class="h-full flex flex-cl">
	<ChargerMap {chargers} isSatellite={false} />
</div>
