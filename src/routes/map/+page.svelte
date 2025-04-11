<script lang="ts">
	import ChargerMap from "$lib/components/features/map/ChargerMap.svelte";
	import { get } from "$lib/services/api";
	import type { ChargerStation } from "$lib/types/chargers";

	let chargers: ChargerStation[] = $state([]);

	get("/chargermap")
		.then((response) => {
			chargers = response.upd;
		})
		.catch((error) => {
			console.error("Error fetching chargers:", error);
		});

</script>
<div class="h-full flex flex-cl">
	<ChargerMap {chargers} isSatellite={false} />
</div>
